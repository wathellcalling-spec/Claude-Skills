<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

/* Root of the hero section — every DOM measurement below is scoped to it. */
const root = ref(null)

/* Copy-link toast + image lightbox are the two pieces of local UI state. */
const toastOn = ref(false)
const lightboxSrc = ref(null)
const lightboxOpen = computed(() => !!lightboxSrc.value)

let toastTimer = null
const cleanups = []

/* ---- Copy Link (from the Shares popover) ---- */
function showToast() {
  toastOn.value = true
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toastOn.value = false }, 1600)
}
function copyLink() {
  const url = 'https://www.houzeo.com/best-places-to-live/florida#'
  const fallback = () => {
    const t = document.createElement('textarea')
    t.value = url
    t.style.position = 'fixed'
    t.style.opacity = '0'
    document.body.appendChild(t)
    t.select()
    try { document.execCommand('copy') } catch (e) { /* noop */ }
    t.remove()
    showToast()
  }
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(url).then(showToast).catch(fallback)
  } else {
    fallback()
  }
}

/* ---- Avatar lightbox ---- */
function openLightbox(src) { lightboxSrc.value = src }
function closeLightbox() { lightboxSrc.value = null }

/* ---- Byline bio popovers: JS-positioned fixed cards (behaviour only) ---- */
function setupBioPops(el) {
  const coarse = window.matchMedia('(hover:none),(pointer:coarse)').matches
  const GAP = 12
  const CLOSE_MS = 150
  let cur = null
  let timer = null
  let raised = []

  const cancel = () => { if (timer) { clearTimeout(timer); timer = null } }

  /* lift every positioned ancestor so the fixed card is never clipped */
  const unraise = () => { raised.forEach(([n, z]) => { n.style.zIndex = z }); raised = [] }
  const raise = (node) => {
    unraise()
    for (let n = node.parentElement; n && n !== document.body; n = n.parentElement) {
      const cs = getComputedStyle(n)
      if (cs.position !== 'static' && cs.zIndex !== 'auto') {
        raised.push([n, n.style.zIndex])
        n.style.zIndex = '2147483000'
      }
    }
  }

  const place = (wrap) => {
    const pop = wrap.querySelector('.hz-bio-pop')
    if (!pop) return
    const r = wrap.getBoundingClientRect()
    const w = pop.offsetWidth || 344
    const left = Math.max(GAP, Math.min(r.left, window.innerWidth - w - GAP))
    pop.style.setProperty('--hz-left', left + 'px')
    pop.style.setProperty('--hz-top', r.bottom + 'px')
    pop.style.setProperty('--hz-arrow', Math.max(16, Math.min(w - 30, r.left + 18 - left)) + 'px')
  }

  const open = (wrap) => {
    cancel()
    if (cur && cur !== wrap) cur.removeAttribute('data-open')
    cur = wrap
    place(wrap)
    raise(wrap.querySelector('.hz-bio-pop') || wrap)
    wrap.setAttribute('data-open', '1')
  }
  const closeNow = () => {
    cancel()
    if (cur) cur.removeAttribute('data-open')
    cur = null
    unraise()
  }
  const scheduleClose = () => {
    cancel()
    timer = setTimeout(() => { timer = null; closeNow() }, CLOSE_MS)
  }

  el.querySelectorAll('.hz-bio-wrap').forEach((wrap) => {
    const trigger = wrap.firstElementChild
    const pop = wrap.querySelector('.hz-bio-pop')
    if (!trigger || !pop) return
    const avatar = wrap.parentElement && wrap.parentElement.querySelector(':scope > img')

    if (!coarse) {
      trigger.addEventListener('mouseenter', () => open(wrap))
      trigger.addEventListener('mouseleave', scheduleClose)
      pop.addEventListener('mouseenter', cancel)
      pop.addEventListener('mouseleave', scheduleClose)
      if (avatar) {
        avatar.style.cursor = 'pointer'
        avatar.addEventListener('mouseenter', () => open(wrap))
        avatar.addEventListener('mouseleave', scheduleClose)
      }
    }
    trigger.addEventListener('click', (e) => {
      if (!coarse) return
      e.preventDefault()
      if (cur === wrap) closeNow(); else open(wrap)
    })
    if (avatar) {
      avatar.addEventListener('click', (e) => {
        if (!coarse) return
        e.preventDefault()
        if (cur === wrap) closeNow(); else open(wrap)
      })
    }
    trigger.addEventListener('focus', () => open(wrap))
    trigger.addEventListener('blur', scheduleClose)
    pop.addEventListener('focusin', cancel)
    pop.addEventListener('focusout', scheduleClose)
  })

  const onScroll = () => { if (cur) coarse ? closeNow() : place(cur) }
  const onResize = () => { if (cur) place(cur) }
  const onDocClick = (e) => {
    if (!e.target.closest('.hz-bio-wrap') && !e.target.closest('.hz-lightbox') && !e.target.classList.contains('hz-avatar-zoom')) closeNow()
  }
  const onKey = (e) => { if (e.key === 'Escape') closeNow() }

  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onResize)
  document.addEventListener('click', onDocClick)
  document.addEventListener('keydown', onKey)

  cleanups.push(() => {
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', onResize)
    document.removeEventListener('click', onDocClick)
    document.removeEventListener('keydown', onKey)
    unraise()
  })
}

onMounted(() => {
  const el = root.value
  if (!el) return

  /* normalise the path length so the stat-icon draw animation covers the whole path */
  el.querySelectorAll('svg [data-ln]').forEach((n) => n.setAttribute('pathLength', '1'))

  /* premium reveal — add .hz-in as each .hz-rv scrolls in */
  const rvIO = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return
    e.target.classList.add('hz-in')
    rvIO.unobserve(e.target)
  }), { threshold: 0.12, rootMargin: '0px 0px -6% 0px' })
  el.querySelectorAll('.hz-rv:not(.hz-in)').forEach((n) => rvIO.observe(n))
  cleanups.push(() => rvIO.disconnect())

  /* count-up for the stat cards */
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const numIO = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return
    const n = e.target
    numIO.unobserve(n)
    const target = parseFloat(n.dataset.count) || 0
    const pre = n.dataset.pre || ''
    const post = n.dataset.post || ''
    if (reduce) { n.textContent = pre + target.toLocaleString('en-US') + post; return }
    const dur = 1500
    const t0 = performance.now()
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / dur)
      const k = 1 - Math.pow(1 - p, 3)
      n.textContent = pre + Math.round(target * k).toLocaleString('en-US') + post
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }), { threshold: 0.5 })
  el.querySelectorAll('[data-count]').forEach((n) => numIO.observe(n))
  cleanups.push(() => numIO.disconnect())

  /* Shares popover — fixed positioning anchored to the trigger */
  const wrap = el.querySelector('.hz-shr-wrap')
  const pop = wrap && wrap.querySelector('.hz-shr-pop')
  if (wrap && pop) {
    const place = () => {
      const r = wrap.getBoundingClientRect()
      pop.style.top = r.bottom + 'px'
      pop.style.left = Math.round(Math.min(Math.max(r.left + r.width / 2 - 120, 10), window.innerWidth - 250)) + 'px'
      const tail = pop.querySelector('.hz-shr-tail')
      if (tail) tail.style.left = Math.round(r.left + r.width / 2 - parseFloat(pop.style.left)) + 'px'
    }
    const onScroll = () => { if (wrap.matches(':hover')) place() }
    wrap.addEventListener('mouseenter', place)
    wrap.addEventListener('focusin', place)
    window.addEventListener('resize', place)
    window.addEventListener('scroll', onScroll, true)
    cleanups.push(() => {
      wrap.removeEventListener('mouseenter', place)
      wrap.removeEventListener('focusin', place)
      window.removeEventListener('resize', place)
      window.removeEventListener('scroll', onScroll, true)
    })
  }

  /* lightbox: Escape closes */
  const onKey = (e) => { if (e.key === 'Escape') closeLightbox() }
  window.addEventListener('keydown', onKey)
  cleanups.push(() => window.removeEventListener('keydown', onKey))

  setupBioPops(el)
})

onBeforeUnmount(() => {
  clearTimeout(toastTimer)
  cleanups.forEach((fn) => fn())
})
</script>

<template>
  <section
    ref="root"
    class="relative px-0 pt-[34px] pb-[18px] bg-[#182638] [background-image:radial-gradient(1250px_820px_at_6%_-12%,#1F3652_0%,rgba(31,54,82,0)_60%),radial-gradient(1000px_720px_at_88%_2%,#1A3048_0%,rgba(26,48,72,0)_62%),linear-gradient(180deg,#1A3048_0%,#182638_100%)] max-md:pt-3 max-md:pb-[30px]"
  >
    <div aria-hidden="true" class="absolute inset-0 overflow-hidden pointer-events-none [background:linear-gradient(180deg,#09264B,#28211a)]">
      <div aria-hidden="true" class="absolute left-[-6%] top-[20%] w-[640px] h-[420px] rounded-[50%] [background:radial-gradient(closest-side,rgba(64,150,230,.20),transparent_72%)] blur-[30px] pointer-events-none"></div>
      <div aria-hidden="true" class="absolute right-[-4%] top-[22%] w-[720px] h-[560px] rounded-[50%] [background:radial-gradient(closest-side,rgba(94,180,255,.22),transparent_70%)] blur-[40px] pointer-events-none"></div>
    </div>

    <div class="relative z-[1] max-w-[1240px] mx-auto px-6 max-md:px-4">
      <!-- breadcrumb + engagement row -->
      <div class="hz-crumbrow flex items-center justify-between gap-5 flex-wrap mb-4 max-md:flex-col max-md:items-start max-md:gap-[9px] max-md:mb-3">
        <nav aria-label="Breadcrumb">
          <ol class="flex items-center gap-2 text-[14px] text-white/65 max-md:flex-wrap max-md:gap-[7px] max-md:gap-y-1 max-md:text-[12px]">
            <li><a href="#" class="text-white/65 transition-colors duration-[180ms] hover:text-white">Home</a></li>
            <li aria-hidden="true" class="text-white/32">/</li>
            <li><a href="#" class="text-white/65 transition-colors duration-[180ms] hover:text-white">Best Places to Live</a></li>
            <li aria-hidden="true" class="text-white/32">/</li>
            <li aria-current="page" class="text-white font-medium">Florida</li>
          </ol>
        </nav>
        <div class="hz-engage flex items-center justify-center gap-[18px] text-[14px] text-white/65 basis-[48%] grow-0 shrink-0 pl-7 max-md:flex max-md:basis-full max-md:grow max-md:w-full max-md:max-w-full max-md:pl-0 max-md:justify-start max-md:flex-wrap max-md:overflow-visible max-md:gap-3 max-md:text-[12px] max-[409px]:gap-2.5 max-[389px]:gap-x-3 max-[389px]:gap-y-2.5 max-[339px]:gap-x-2.5">
          <span class="inline-flex items-center gap-[7px] max-md:shrink-0 max-md:grow-0">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.65)" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="shrink-0 block"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg><b class="text-white font-semibold">14,599</b> reads
          </span>
          <span aria-hidden="true" class="w-px h-4 bg-white/16 max-md:hidden"></span>
          <span class="hz-shr-wrap group/shr relative inline-flex items-center max-md:shrink-0 max-md:grow-0">
            <button type="button" id="hz-shr-btn" aria-haspopup="true" class="inline-flex items-center gap-[7px] bg-none border-none p-0 font-[inherit] text-[inherit] cursor-pointer"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#F2711C" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="block"><path d="M21.5 2.5 2.8 9.9c-.7.3-.7 1.2 0 1.5l7.4 2.9c.2.1.4.3.5.5l2.9 7.4c.3.7 1.2.7 1.5 0z"></path><path d="M21.5 2.5 10.7 13.3"></path></svg><b class="text-white font-semibold">55</b> shares<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="ml-px"><path d="M6 9l6 6 6-6"></path></svg></button>
            <span class="hz-shr-pop fixed top-0 left-0 w-[240px] pt-[11px] opacity-0 -translate-y-1.5 pointer-events-none transition-[opacity,transform] duration-[170ms] ease-out z-[9999] group-hover/shr:opacity-100 group-hover/shr:translate-y-0 group-hover/shr:pointer-events-auto group-focus-within/shr:opacity-100 group-focus-within/shr:translate-y-0 group-focus-within/shr:pointer-events-auto">
              <span class="hz-shr-tail absolute top-1.5 left-1/2 w-[11px] h-[11px] bg-white border-l border-t border-[#E6E8EB] -translate-x-1/2 rotate-45 rounded-tl-[2px] pointer-events-none"></span>
              <span class="relative w-[240px] bg-white border border-[#E6E8EB] rounded-xl shadow-[0_12px_32px_rgba(0,0,0,.18)] flex flex-col overflow-hidden">
                <button type="button" id="hz-shr-copy" @click="copyLink" class="flex items-center gap-3 h-12 px-4 bg-none border-none font-medium text-[14px] leading-none text-[#333] whitespace-nowrap text-left no-underline cursor-pointer transition-[background] duration-[130ms] ease-out hover:bg-[#EFF4FA]"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="block basis-5 grow-0 shrink-0"><path d="M9 17H7A5 5 0 0 1 7 7h2"></path><path d="M15 7h2a5 5 0 1 1 0 10h-2"></path><path d="M8 12h8"></path></svg>Copy Link</button>
                <a href="https://www.facebook.com/sharer/sharer.php?u=https://www.houzeo.com/best-places-to-live/florida" target="_blank" rel="noopener noreferrer" class="flex items-center gap-3 h-12 px-4 border-t border-[#EDEFF2] font-medium text-[14px] leading-none text-[#333] whitespace-nowrap no-underline cursor-pointer transition-[background] duration-[130ms] ease-out hover:bg-[#EFF4FA]"><svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" class="block basis-5 grow-0 shrink-0"><path fill="#1877F2" d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 3.874 23.1 9.101 24v-8.437H6.627v-3.49h2.474V9.412c0-4.03 1.848-5.9 5.858-5.9.401 0 .955.042 1.468.103.513.06.897.15 1.141.195v3.29a8.6 8.6 0 0 0-.653-.036c-.243-.007-.487-.01-.733-.01-.707 0-1.259.097-1.675.31a1.69 1.69 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.835h3.919l-.386 2.075-.287 1.415h-3.246V24C20.126 23.1 24 18.1 24 12.073Z"></path></svg>Share on Facebook</a>
                <a href="https://twitter.com/intent/tweet?url=https://www.houzeo.com/best-places-to-live/florida" target="_blank" rel="noopener noreferrer" class="flex items-center gap-3 h-12 px-4 border-t border-[#EDEFF2] font-medium text-[14px] leading-none text-[#333] whitespace-nowrap no-underline cursor-pointer transition-[background] duration-[130ms] ease-out hover:bg-[#EFF4FA]"><svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" class="block basis-5 grow-0 shrink-0"><path fill="#101010" d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"></path></svg>Share on X</a>
                <a href="https://www.linkedin.com/sharing/share-offsite/?url=https://www.houzeo.com/best-places-to-live/florida" target="_blank" rel="noopener noreferrer" class="flex items-center gap-3 h-12 px-4 border-t border-[#EDEFF2] font-medium text-[14px] leading-none text-[#333] whitespace-nowrap no-underline cursor-pointer transition-[background] duration-[130ms] ease-out hover:bg-[#EFF4FA]"><svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" class="block basis-5 grow-0 shrink-0"><path fill="#0A66C2" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433a2.063 2.063 0 1 1 0-4.126 2.063 2.063 0 0 1 0 4.126Zm1.782 13.019H3.555V9h3.564v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0Z"></path></svg>Share on LinkedIn</a>
                <a href="https://api.whatsapp.com/send?text=https://www.houzeo.com/best-places-to-live/florida" target="_blank" rel="noopener noreferrer" class="flex items-center gap-3 h-12 px-4 border-t border-[#EDEFF2] font-medium text-[14px] leading-none text-[#333] whitespace-nowrap no-underline cursor-pointer transition-[background] duration-[130ms] ease-out hover:bg-[#EFF4FA]"><svg width="20" height="20" viewBox="0 0 32 32" fill="none" aria-hidden="true" class="block basis-5 grow-0 shrink-0 overflow-visible"><path fill="#25D366" fill-rule="evenodd" clip-rule="evenodd" d="M16.003 0h-.008C7.174 0 .001 7.176.001 16c0 3.5 1.128 6.744 3.046 9.377L1.053 31.32l6.15-1.966A15.87 15.87 0 0 0 16.003 32C24.827 32 32 24.822 32 16S24.827 0 16.003 0Zm9.313 22.594c-.386 1.09-1.918 1.994-3.14 2.258-.836.178-1.928.32-5.603-1.204-4.7-1.947-7.727-6.72-7.963-7.032-.235-.311-1.904-2.53-1.904-4.826 0-2.295 1.166-3.422 1.636-3.902.386-.394.102-.622 1.176-.622.347 0 .522.002.68.01.47.02.706.048.982.708.386.83 1.29 3.052 1.397 3.28.112.228.223.537.068.836-.145.31-.273.448-.501.71-.229.263-.446.464-.674.746-.209.245-.445.508-.181.963.264.446 1.168 1.912 2.497 3.094 1.715 1.527 3.106 2.014 3.608 2.223.374.155.82.118 1.094-.173.347-.374.777-.996 1.214-1.608.31-.44.702-.489 1.113-.334.418.146 3.075 1.46 3.53 1.687.456.229.757.337.868.53.108.191.108 1.097-.278 2.186Z"></path></svg>Share on Whatsapp</a>
              </span>
            </span>
            <span id="hz-shr-toast" role="status" :data-on="toastOn ? '1' : null" class="absolute top-[calc(100%+14px)] left-1/2 -translate-x-1/2 translate-y-1 opacity-0 pointer-events-none transition-[opacity,transform] duration-150 ease-out bg-[#202020] text-white font-medium text-[12px] leading-none px-3 py-[7px] rounded-lg whitespace-nowrap z-[10000] data-[on=1]:opacity-100 data-[on=1]:translate-y-0">Copied!</span>
          </span>
          <span aria-hidden="true" class="w-px h-4 bg-white/16 max-md:hidden"></span>
          <span class="inline-flex items-center gap-[9px] bg-[#F2711C]/14 border border-[#F2711C]/34 text-[#FFB37A] text-[12px] font-semibold tracking-[.4px] uppercase px-[13px] py-[5px] rounded-full max-md:shrink-0 max-md:grow-0 max-md:text-[10px] max-md:px-2 max-md:py-[5px] max-md:whitespace-nowrap"><span class="hz-glow-hot w-[7px] h-[7px] rounded-full bg-[#FF8636] animate-glow-hot motion-reduce:animate-none"></span>Hot Post · Top 1%</span>
        </div>
      </div>

      <!-- hero grid -->
      <div class="hz-hero-grid grid grid-cols-2 gap-14 items-stretch max-[1024px]:grid-cols-1 max-md:flex max-md:flex-col max-md:gap-3 max-md:items-stretch">
        <div class="flex flex-col justify-start gap-5 min-w-0 pb-0 min-[768px]:max-[1024px]:pb-2 max-md:contents">
          <h1 class="hz-rv opacity-0 [transform:translateY(26px)] transition-[opacity,transform] duration-[750ms] ease-[cubic-bezier(.22,1,.36,1)] [&.hz-in]:opacity-100 [&.hz-in]:[transform:none] motion-reduce:!opacity-100 motion-reduce:![transform:none] relative text-[clamp(24px,3.55vw,48px)] leading-[1.05] tracking-[-1.4px] mb-0 grow-0 shrink-0 text-white max-md:order-1 max-md:text-[24px] max-md:leading-[1.07] max-md:tracking-[-1px]">Best Places to Live in <span class="text-[#4C9EE8]">Florida</span></h1>
          <p class="hz-rv opacity-0 [transform:translateY(26px)] transition-[opacity,transform] duration-[750ms] delay-[90ms] ease-[cubic-bezier(.22,1,.36,1)] [&.hz-in]:opacity-100 [&.hz-in]:[transform:none] motion-reduce:!opacity-100 motion-reduce:![transform:none] text-[18px] leading-[30px] text-white/74 max-w-[620px] mt-0.5 grow-0 shrink-0 tracking-[-.1px] text-pretty [hyphens:none] [-webkit-hyphens:none] break-words max-md:order-2 max-md:text-[15px] max-md:leading-[1.6] max-md:max-w-full max-md:mt-0 min-[768px]:max-[1024px]:max-w-[66ch]">Life in Florida is usually painted with palm-lined streets, white sand beaches, and warm sunshine. Beyond its well-known tourist destinations, the Sunshine State has bustling places where you can pursue a career, start a family, or lead a relaxed coastal lifestyle. Here are the top 10 places to live in Florida.</p>

          <!-- byline -->
          <div class="hz-rv opacity-0 [transform:translateY(26px)] transition-[opacity,transform] duration-[750ms] delay-[180ms] ease-[cubic-bezier(.22,1,.36,1)] [&.hz-in]:opacity-100 [&.hz-in]:[transform:none] motion-reduce:!opacity-100 motion-reduce:![transform:none] inline-flex items-center flex-nowrap gap-2.5 text-[12px] font-normal leading-[1.4] text-white/55 grow-0 shrink-0 self-start bg-white/6 border border-white/12 rounded-full pl-2 pr-[18px] py-[7px] shadow-[inset_0_1px_0_rgba(255,255,255,.08)] whitespace-nowrap overflow-visible max-md:order-4 max-md:flex max-md:flex-wrap max-md:justify-start max-md:items-center max-md:whitespace-normal max-md:gap-x-2.5 max-md:gap-y-2 max-md:w-auto max-md:max-w-full max-md:leading-[1.5] max-md:rounded-[20px] max-md:pt-2 max-md:pr-[14px] max-md:pb-2 max-md:pl-2 max-[389px]:gap-y-2 max-[339px]:gap-x-2.5">
            <span class="inline-flex items-center gap-2 whitespace-nowrap max-md:basis-auto max-md:grow-0 max-md:shrink max-md:max-w-full max-md:items-center max-md:whitespace-normal">
              <img src="/images/author-jaaziel.webp" alt="" aria-hidden="true" class="w-5 h-5 rounded-full object-cover object-[center_22%] shrink-0 border border-white/22 max-md:w-[18px] max-md:h-[18px]">
              Author: <span class="hz-bio-wrap group/bio relative inline-flex z-40">
                <span tabindex="0" role="button" class="text-white/74 font-medium cursor-pointer no-underline">Jaaziel Pereira</span>
                <span class="hz-bio-pop fixed left-[var(--hz-left,0px)] top-[var(--hz-top,0px)] z-[2147483000] opacity-0 invisible pointer-events-none translate-y-2 transition-[opacity,transform,visibility] duration-200 ease-out group-data-[open=1]/bio:opacity-100 group-data-[open=1]/bio:visible group-data-[open=1]/bio:pointer-events-auto group-data-[open=1]/bio:translate-y-0 pt-[9px] w-[376px] whitespace-normal max-md:w-[calc(100vw-24px)] max-md:max-w-[344px]"><span aria-hidden="true" class="absolute left-[var(--hz-arrow,22px)] top-1 w-[14px] h-[14px] bg-[#16223A] border-l border-t border-white/10 rounded-tl-[3px] rotate-45 z-[2]"></span>
                  <div class="relative z-[1] [background:linear-gradient(165deg,#16223A_0%,#0D1524_60%,#0A1120_100%)] border border-white/10 border-t-2 border-t-[rgba(90,169,248,.55)] rounded-2xl pt-7 px-7 pb-6 shadow-[0_28px_68px_rgba(3,7,18,.62),0_8px_22px_rgba(3,7,18,.42),inset_0_1px_0_rgba(255,255,255,.06)] backdrop-blur-[10px] text-[14px] leading-[1.7] text-[#C9D1D9]">
                    <div class="flex items-start gap-[22px]">
                      <div aria-hidden="true" class="w-16 h-16 rounded-full shrink-0 border border-white/16 shadow-[0_0_0_3px_rgba(90,169,248,.14),0_4px_14px_rgba(3,7,18,.5)] overflow-hidden"><img class="hz-avatar-zoom w-full h-full object-cover object-[center_22%] rounded-full cursor-pointer" src="/images/author-jaaziel.webp" alt="Jaaziel Pereira" @click="openLightbox('/images/author-jaaziel.webp')"></div>
                      <div class="min-w-0 flex flex-col items-start pt-0.5">
                        <div class="text-[20px] font-semibold text-[#F8FAFC] leading-[1.25] tracking-[-.4px]">Jaaziel Pereira</div>
                        <div class="text-[12px] text-[#96A2AF] mt-1.5 leading-[1.5]">Relocation &amp; Livability Analyst</div>
                        <div class="inline-flex items-center gap-[5px] bg-[rgba(90,169,248,.12)] border border-[rgba(90,169,248,.28)] text-[#8CC3FB] text-[10px] font-medium tracking-[.2px] rounded-full px-[9px] py-0.5 leading-[1.4] mt-3"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#8CC3FB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"></circle><path d="m8.6 12.2 2.3 2.3 4.5-4.6"></path></svg>Author</div>
                      </div>
                    </div>
                    <div class="mt-5 w-full text-left text-[14px] leading-[1.68] tracking-[.05px] text-[#C4CCD6] text-pretty [hyphens:none] break-words">Jaaziel Pereira is a Relocation and Livability Analyst who helps people find places that balance affordability, comfort, and opportunity. He studies market trends, community features, and quality-of-life indicators to guide smarter relocation decisions.</div>
                    <div class="flex flex-wrap gap-2 mt-4">
                      <div class="bg-[rgba(90,169,248,.08)] border border-[rgba(90,169,248,.18)] rounded-full px-3 py-[5px] text-[12px] text-[#B9D6F5] leading-[1.4]">Best Places to Live</div>
                      <div class="bg-[rgba(90,169,248,.08)] border border-[rgba(90,169,248,.18)] rounded-full px-3 py-[5px] text-[12px] text-[#B9D6F5] leading-[1.4]">Safest Places to Live</div>
                    </div>
                    <div class="h-px bg-white/10 mt-[22px]"></div>
                    <div class="flex items-center justify-between mt-[18px]">
                      <div class="flex gap-2.5">
                        <a href="#" aria-label="LinkedIn" class="w-8 h-8 rounded-[9px] border border-white/14 bg-white/4 inline-flex items-center justify-center transition-[background,border-color] duration-150 hover:bg-[rgba(90,169,248,.14)] hover:border-[rgba(90,169,248,.55)]"><svg width="15" height="15" viewBox="0 0 24 24" fill="#C9D1D9" aria-hidden="true"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3zM9 9h3.8v1.7c.6-1 1.8-1.9 3.7-1.9 2.7 0 4.5 1.7 4.5 5.3V21h-4v-6c0-1.6-.6-2.6-2-2.6-1.2 0-1.9.8-2.2 1.6-.1.3-.1.7-.1 1.1V21H9Z"></path></svg></a>
                        <a href="#" aria-label="Email" class="w-8 h-8 rounded-[9px] border border-white/14 bg-white/4 inline-flex items-center justify-center transition-[background,border-color] duration-150 hover:bg-[rgba(90,169,248,.14)] hover:border-[rgba(90,169,248,.55)]"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#C9D1D9" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2.5" y="5" width="19" height="14" rx="2"></rect><path d="m3 7 9 6 9-6"></path></svg></a>
                      </div>
                      <a href="https://www.houzeo.com/blog/author/Jaaziel-Pereira/" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-lg border border-[rgba(90,169,248,.55)] bg-[rgba(90,169,248,.10)] text-[#8CC3FB] font-poppins font-semibold text-[12px] leading-none whitespace-nowrap transition-[background,border-color,color] duration-150 hover:!bg-[rgba(90,169,248,.14)] hover:!border-[#8CC3FB] hover:!text-[#CFE6FE]">View Profile<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"></path></svg></a>
                    </div>
                  </div>
                </span>
              </span>
            </span>
            <span aria-hidden="true" class="w-px h-[14px] bg-white/16 max-md:hidden"></span>
            <span class="inline-flex items-center gap-2 whitespace-nowrap max-md:basis-auto max-md:grow-0 max-md:shrink max-md:max-w-full max-md:items-center max-md:whitespace-normal">
              <img src="/images/reviewer-harshada.webp" alt="" aria-hidden="true" class="w-5 h-5 rounded-full object-cover object-[center_22%] shrink-0 border border-white/22 max-md:w-[18px] max-md:h-[18px]">
              Reviewer: <span class="hz-bio-wrap group/bio relative inline-flex z-40">
                <span tabindex="0" role="button" class="text-white/74 font-medium cursor-pointer no-underline">Harshada Jaybhaye</span>
                <span class="hz-bio-pop fixed left-[var(--hz-left,0px)] top-[var(--hz-top,0px)] z-[2147483000] opacity-0 invisible pointer-events-none translate-y-2 transition-[opacity,transform,visibility] duration-200 ease-out group-data-[open=1]/bio:opacity-100 group-data-[open=1]/bio:visible group-data-[open=1]/bio:pointer-events-auto group-data-[open=1]/bio:translate-y-0 pt-[9px] w-[376px] whitespace-normal max-md:w-[calc(100vw-24px)] max-md:max-w-[344px]"><span aria-hidden="true" class="absolute left-[var(--hz-arrow,22px)] top-1 w-[14px] h-[14px] bg-[#16223A] border-l border-t border-white/10 rounded-tl-[3px] rotate-45 z-[2]"></span>
                  <div class="relative z-[1] [background:linear-gradient(165deg,#16223A_0%,#0D1524_60%,#0A1120_100%)] border border-white/10 border-t-2 border-t-[rgba(52,214,122,.55)] rounded-2xl pt-7 px-7 pb-6 shadow-[0_28px_68px_rgba(3,7,18,.62),0_8px_22px_rgba(3,7,18,.42),inset_0_1px_0_rgba(255,255,255,.06)] backdrop-blur-[10px] text-[14px] leading-[1.7] text-[#C9D1D9]">
                    <div class="flex items-start gap-[22px]">
                      <div aria-hidden="true" class="w-16 h-16 rounded-full shrink-0 border border-white/16 shadow-[0_0_0_3px_rgba(52,214,122,.14),0_4px_14px_rgba(3,7,18,.5)] overflow-hidden"><img class="hz-avatar-zoom w-full h-full object-cover object-[center_22%] rounded-full cursor-pointer" src="/images/reviewer-harshada.webp" alt="Harshada Jaybhaye" @click="openLightbox('/images/reviewer-harshada.webp')"></div>
                      <div class="min-w-0 flex flex-col items-start pt-0.5">
                        <div class="text-[20px] font-semibold text-[#F8FAFC] leading-[1.25] tracking-[-.4px]">Harshada Jaybhaye</div>
                        <div class="text-[12px] text-[#96A2AF] mt-1.5 leading-[1.5]">Relocation &amp; Livability Analyst</div>
                        <div class="inline-flex items-center gap-[5px] bg-[rgba(52,214,122,.12)] border border-[rgba(52,214,122,.28)] text-[#7FE0A6] text-[10px] font-medium tracking-[.2px] rounded-full px-[9px] py-0.5 leading-[1.4] mt-3"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#7FE0A6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21.5s7.5-3.9 7.5-9.6V5.4L12 2.5 4.5 5.4v6.5c0 5.7 7.5 9.6 7.5 9.6Z"></path></svg>Reviewer</div>
                      </div>
                    </div>
                    <div class="mt-5 w-full text-left text-[14px] leading-[1.68] tracking-[.05px] text-[#C4CCD6] text-pretty [hyphens:none] break-words">Harshada Jaybhaye is a Relocation and Livability Analyst who helps people compare places beyond rankings and headlines. She evaluates affordability, safety, quality of life, and local amenities to help readers find places that match their budget, lifestyle, and long-term goals.</div>
                    <div class="flex flex-wrap gap-2 mt-4">
                      <div class="bg-[rgba(52,214,122,.08)] border border-[rgba(52,214,122,.18)] rounded-full px-3 py-[5px] text-[12px] text-[#B9E8C9] leading-[1.4]">Best Places to Live</div>
                      <div class="bg-[rgba(52,214,122,.08)] border border-[rgba(52,214,122,.18)] rounded-full px-3 py-[5px] text-[12px] text-[#B9E8C9] leading-[1.4]">Safest Places to Live</div>
                    </div>
                    <div class="h-px bg-white/10 mt-[22px]"></div>
                    <div class="flex items-center justify-between mt-[18px]">
                      <div class="flex gap-2.5">
                        <a href="#" aria-label="LinkedIn" class="w-8 h-8 rounded-[9px] border border-white/14 bg-white/4 inline-flex items-center justify-center transition-[background,border-color] duration-150 hover:bg-[rgba(90,169,248,.14)] hover:border-[rgba(90,169,248,.55)]"><svg width="15" height="15" viewBox="0 0 24 24" fill="#C9D1D9" aria-hidden="true"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3zM9 9h3.8v1.7c.6-1 1.8-1.9 3.7-1.9 2.7 0 4.5 1.7 4.5 5.3V21h-4v-6c0-1.6-.6-2.6-2-2.6-1.2 0-1.9.8-2.2 1.6-.1.3-.1.7-.1 1.1V21H9Z"></path></svg></a>
                        <a href="#" aria-label="Email" class="w-8 h-8 rounded-[9px] border border-white/14 bg-white/4 inline-flex items-center justify-center transition-[background,border-color] duration-150 hover:bg-[rgba(90,169,248,.14)] hover:border-[rgba(90,169,248,.55)]"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#C9D1D9" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2.5" y="5" width="19" height="14" rx="2"></rect><path d="m3 7 9 6 9-6"></path></svg></a>
                      </div>
                      <a href="https://www.houzeo.com/blog/author/Harshada-Jaybhaye/" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-lg border border-[rgba(90,169,248,.55)] bg-[rgba(90,169,248,.10)] text-[#8CC3FB] font-poppins font-semibold text-[12px] leading-none whitespace-nowrap transition-[background,border-color,color] duration-150 hover:!bg-[rgba(90,169,248,.14)] hover:!border-[#8CC3FB] hover:!text-[#CFE6FE]">View Profile<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"></path></svg></a>
                    </div>
                  </div>
                </span>
              </span>
            </span>
            <span aria-hidden="true" class="w-px h-[11px] bg-white/14 max-md:hidden"></span>
            <span class="inline-flex items-center gap-1.5 whitespace-nowrap max-md:basis-auto max-md:grow-0 max-md:shrink max-md:max-w-full max-md:items-center max-md:whitespace-normal">
              <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.42)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0 max-md:w-[11px] max-md:h-[11px]"><rect x="3" y="5" width="18" height="16" rx="2"></rect><path d="M3 10h18M8 3v4M16 3v4"></path></svg>
              Last Updated: <span class="text-white/74 font-medium">Jul 17, 2026</span>
            </span>
          </div>

          <!-- CTA row -->
          <div class="hz-ctarow grid grid-cols-2 gap-4 w-full max-w-[calc(100%-28px)] grow-0 shrink-0 mt-auto max-md:order-5 max-md:grid-cols-1 max-md:max-w-full max-md:gap-2.5 max-md:mt-0 min-[768px]:max-[1024px]:mt-0 min-[768px]:max-[1024px]:max-w-[420px]">
            <a href="#hz-feed" class="inline-flex items-center justify-center gap-2.5 h-14 px-6 rounded-lg [background:linear-gradient(180deg,#2876C1,#0E5293)] text-white text-[16px] font-semibold shadow-[0_18px_40px_-18px_rgba(40,118,193,.85)] transition-[transform,box-shadow,background-color,border-color,filter] duration-200 ease-[cubic-bezier(.22,.61,.36,1)] hover:-translate-y-[3px] hover:brightness-[1.06] hover:shadow-[0_14px_28px_-10px_rgba(40,118,193,.65)] active:-translate-y-px active:scale-[.99] max-md:h-[50px] max-md:w-full">See the Rankings <span aria-hidden="true">→</span></a>
            <a href="https://www.houzeo.com/methodology/best-places-to-live-rankings" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center h-14 px-6 rounded-lg border-[1.5px] border-white/32 bg-white/6 text-white text-[16px] font-semibold transition-[transform,box-shadow,background-color,border-color,filter] duration-200 ease-[cubic-bezier(.22,.61,.36,1)] hover:-translate-y-[3px] hover:bg-white/12 hover:border-white/50 hover:shadow-[0_14px_30px_-14px_rgba(140,200,255,.55)] active:-translate-y-px active:scale-[.99] max-md:h-[50px] max-md:w-full">How We Rank</a>
          </div>
        </div>

        <!-- photo column -->
        <div class="relative max-md:order-3">
          <div aria-hidden="true" class="absolute left-[6%] right-[-6%] top-[8%] bottom-[2%] rounded-[50%] [background:radial-gradient(closest-side,rgba(90,175,255,.32),transparent_72%)] blur-[48px] pointer-events-none"></div>
          <div aria-hidden="true" class="absolute left-14 right-7 bottom-[-18px] h-16 rounded-[50%] [background:radial-gradient(closest-side,rgba(3,12,24,.72),transparent_78%)] blur-[26px] pointer-events-none"></div>
          <div id="hz-hero-photo-a" class="relative h-[430px] ml-7 rounded-3xl overflow-hidden shadow-[0_0_0_1px_rgba(255,255,255,.12),0_50px_100px_-40px_rgba(0,0,0,.75),0_0_90px_-30px_rgba(90,175,255,.55)] max-md:h-[270px] max-md:ml-0 max-md:rounded-[20px] min-[768px]:max-[1024px]:ml-0"><div class="relative w-full h-full"><img src="/images/hero-naples.webp" alt="Naples, Florida waterfront" class="w-full h-full object-cover block [filter:contrast(1.12)_saturate(1.14)_brightness(1.03)]"></div></div>
          <div aria-hidden="true" class="absolute left-7 right-0 top-0 h-[430px] rounded-3xl pointer-events-none [background:linear-gradient(0deg,rgba(5,15,27,.88)_0%,rgba(5,15,27,.74)_16%,rgba(5,15,27,.44)_32%,rgba(5,15,27,.18)_50%,rgba(5,15,27,.10)_70%,rgba(5,15,27,.14)_100%)] max-md:left-0 max-md:right-0 max-md:h-[270px] max-md:rounded-[20px] max-md:[background:linear-gradient(0deg,rgba(5,15,27,.93)_0%,rgba(5,15,27,.80)_26%,rgba(5,15,27,.34)_56%,rgba(5,15,27,.08)_100%)] min-[768px]:max-[1024px]:left-0"></div>

          <!-- stat cards overlay -->
          <div class="hz-rv opacity-0 [transform:translateY(26px)] transition-[opacity,transform] duration-[750ms] delay-[90ms] ease-[cubic-bezier(.22,1,.36,1)] [&.hz-in]:opacity-100 [&.hz-in]:[transform:none] motion-reduce:!opacity-100 motion-reduce:![transform:none] absolute left-[52px] right-6 bottom-6 grid grid-cols-2 auto-rows-fr gap-4 items-stretch max-md:left-2.5 max-md:right-2.5 max-md:bottom-2.5 max-md:top-auto max-md:auto-rows-auto max-md:gap-[9px] max-md:mt-0 min-[768px]:max-[1024px]:left-6">
            <div class="group/dstat relative isolate flex items-center gap-4 rounded-2xl p-4 min-h-[80px] box-border bg-[rgba(10,24,40,.86)] backdrop-blur-[8px] border border-white/14 shadow-[0_10px_24px_-10px_rgba(0,0,0,.55),0_2px_6px_-2px_rgba(0,0,0,.45)] transition-[transform,box-shadow,background-color,border-color] duration-300 ease-[cubic-bezier(.22,1,.36,1)] hover:-translate-y-2 hover:bg-[rgba(16,37,61,.93)] hover:border-[#2F80ED] hover:shadow-[0_28px_56px_-20px_rgba(0,0,0,.62),0_10px_22px_-12px_rgba(11,90,165,.55),0_2px_5px_-2px_rgba(0,0,0,.4)] after:content-[''] after:absolute after:left-[12%] after:right-[12%] after:-bottom-4 after:h-[34px] after:rounded-[50%] after:[background:radial-gradient(closest-side,rgba(47,128,237,.5),rgba(47,128,237,0)_76%)] after:blur-[12px] after:opacity-0 after:transition-opacity after:duration-300 after:pointer-events-none after:-z-10 hover:after:opacity-100 max-md:gap-2 max-md:px-[9px] max-md:py-[7px] max-md:min-h-0 max-md:rounded-xl max-md:backdrop-blur-none">
              <span class="relative flex items-center justify-center w-11 h-11 shrink-0 !rounded-full [background:linear-gradient(160deg,#3B82F6,#2563EB)] border border-white/26 shadow-[inset_0_1px_0_rgba(255,255,255,.34),inset_0_-6px_12px_-6px_rgba(0,0,0,.4),0_6px_14px_-6px_rgba(37,99,235,.65)] transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(.22,1,.36,1)] group-hover/dstat:scale-[1.06] group-hover/dstat:shadow-[inset_0_1px_0_rgba(255,255,255,.42),inset_0_-6px_12px_-6px_rgba(0,0,0,.36),0_10px_22px_-8px_rgba(37,99,235,.8)] before:content-[''] before:absolute before:-inset-[9px] before:rounded-full before:[background:radial-gradient(closest-side,rgba(59,130,246,.62),rgba(59,130,246,0)_74%)] before:opacity-0 before:transition-opacity before:duration-300 before:pointer-events-none group-hover/dstat:before:opacity-100 max-md:w-7 max-md:h-7 group-hover/dstat:max-md:scale-100"><svg viewBox="0 0 24 24" aria-hidden="true" class="block w-[22px] h-[22px] stroke-white [stroke-width:1.7] [vector-effect:non-scaling-stroke] [stroke-linecap:round] [stroke-linejoin:round] fill-none overflow-visible [shape-rendering:geometricPrecision] max-md:w-5 max-md:h-5 max-md:[stroke-width:1.8]"><path data-ln="1" d="M3.4 10.3 12 3.4l8.6 6.9" class="[stroke-dasharray:1] [stroke-dashoffset:0] group-hover/dstat:animate-ico-draw motion-reduce:animate-none"></path><path data-ln="1" d="M5.2 9.6V19a1.8 1.8 0 0 0 1.8 1.8h10a1.8 1.8 0 0 0 1.8-1.8V9.6" class="[stroke-dasharray:1] [stroke-dashoffset:0] group-hover/dstat:animate-ico-draw motion-reduce:animate-none"></path><path data-ln="1" d="M12 9.6v8.8" class="[stroke-dasharray:1] [stroke-dashoffset:0] group-hover/dstat:animate-ico-draw motion-reduce:animate-none"></path><path data-ln="1" d="M14 11.6a2.2 2.2 0 0 0-2-1.1 1.7 1.7 0 0 0 0 3.4 1.7 1.7 0 0 1 0 3.4 2.2 2.2 0 0 1-2-1.1" class="[stroke-dasharray:1] [stroke-dashoffset:0] group-hover/dstat:animate-ico-draw motion-reduce:animate-none"></path></svg></span>
              <span><span data-count="395798" data-pre="$" class="block text-[20px] font-semibold tracking-[-.4px] text-white leading-[1.2] transition-[transform,opacity] duration-300 ease-[cubic-bezier(.22,1,.36,1)] group-hover/dstat:-translate-y-0.5 max-md:text-[16px] max-md:tracking-[-.2px]">$0</span><span class="block text-[12px] text-white opacity-85 transition-opacity duration-300 group-hover/dstat:opacity-100 max-md:text-[10px] max-md:leading-[1.3]">Median Home Price</span></span>
            </div>
            <div class="group/dstat relative isolate flex items-center gap-4 rounded-2xl p-4 min-h-[80px] box-border bg-[rgba(10,24,40,.86)] backdrop-blur-[8px] border border-white/14 shadow-[0_10px_24px_-10px_rgba(0,0,0,.55),0_2px_6px_-2px_rgba(0,0,0,.45)] transition-[transform,box-shadow,background-color,border-color] duration-300 ease-[cubic-bezier(.22,1,.36,1)] hover:-translate-y-2 hover:bg-[rgba(16,37,61,.93)] hover:border-[#2F80ED] hover:shadow-[0_28px_56px_-20px_rgba(0,0,0,.62),0_10px_22px_-12px_rgba(11,90,165,.55),0_2px_5px_-2px_rgba(0,0,0,.4)] after:content-[''] after:absolute after:left-[12%] after:right-[12%] after:-bottom-4 after:h-[34px] after:rounded-[50%] after:[background:radial-gradient(closest-side,rgba(47,128,237,.5),rgba(47,128,237,0)_76%)] after:blur-[12px] after:opacity-0 after:transition-opacity after:duration-300 after:pointer-events-none after:-z-10 hover:after:opacity-100 max-md:gap-2 max-md:px-[9px] max-md:py-[7px] max-md:min-h-0 max-md:rounded-xl max-md:backdrop-blur-none">
              <span class="relative flex items-center justify-center w-11 h-11 shrink-0 !rounded-full [background:linear-gradient(160deg,#3B82F6,#2563EB)] border border-white/26 shadow-[inset_0_1px_0_rgba(255,255,255,.34),inset_0_-6px_12px_-6px_rgba(0,0,0,.4),0_6px_14px_-6px_rgba(37,99,235,.65)] transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(.22,1,.36,1)] group-hover/dstat:scale-[1.06] group-hover/dstat:shadow-[inset_0_1px_0_rgba(255,255,255,.42),inset_0_-6px_12px_-6px_rgba(0,0,0,.36),0_10px_22px_-8px_rgba(37,99,235,.8)] before:content-[''] before:absolute before:-inset-[9px] before:rounded-full before:[background:radial-gradient(closest-side,rgba(59,130,246,.62),rgba(59,130,246,0)_74%)] before:opacity-0 before:transition-opacity before:duration-300 before:pointer-events-none group-hover/dstat:before:opacity-100 max-md:w-7 max-md:h-7 group-hover/dstat:max-md:scale-100"><svg viewBox="0 0 24 24" aria-hidden="true" class="block w-[22px] h-[22px] stroke-white [stroke-width:1.7] [vector-effect:non-scaling-stroke] [stroke-linecap:round] [stroke-linejoin:round] fill-none overflow-visible [shape-rendering:geometricPrecision] max-md:w-5 max-md:h-5 max-md:[stroke-width:1.8]"><path data-ln="1" d="M12 21.2c4.1-1.8 7-4.9 7-9.3V5.8L12 3.2 5 5.8v6.1c0 4.4 2.9 7.5 7 9.3Z" class="[stroke-dasharray:1] [stroke-dashoffset:0] group-hover/dstat:animate-ico-draw motion-reduce:animate-none"></path><path data-ln="1" d="m8.7 11.9 2.4 2.4 4.2-4.4" class="[stroke-dasharray:1] [stroke-dashoffset:0] group-hover/dstat:animate-ico-draw motion-reduce:animate-none"></path></svg></span>
              <span><span data-count="40" class="block text-[20px] font-semibold tracking-[-.4px] text-white leading-[1.2] transition-[transform,opacity] duration-300 ease-[cubic-bezier(.22,1,.36,1)] group-hover/dstat:-translate-y-0.5 max-md:text-[16px] max-md:tracking-[-.2px]">0</span><span class="block text-[12px] text-white opacity-85 transition-opacity duration-300 group-hover/dstat:opacity-100 max-md:text-[10px] max-md:leading-[1.3]">Safety Score</span></span>
            </div>
            <div class="group/dstat relative isolate flex items-center gap-4 rounded-2xl p-4 min-h-[80px] box-border bg-[rgba(10,24,40,.86)] backdrop-blur-[8px] border border-white/14 shadow-[0_10px_24px_-10px_rgba(0,0,0,.55),0_2px_6px_-2px_rgba(0,0,0,.45)] transition-[transform,box-shadow,background-color,border-color] duration-300 ease-[cubic-bezier(.22,1,.36,1)] hover:-translate-y-2 hover:bg-[rgba(16,37,61,.93)] hover:border-[#2F80ED] hover:shadow-[0_28px_56px_-20px_rgba(0,0,0,.62),0_10px_22px_-12px_rgba(11,90,165,.55),0_2px_5px_-2px_rgba(0,0,0,.4)] after:content-[''] after:absolute after:left-[12%] after:right-[12%] after:-bottom-4 after:h-[34px] after:rounded-[50%] after:[background:radial-gradient(closest-side,rgba(47,128,237,.5),rgba(47,128,237,0)_76%)] after:blur-[12px] after:opacity-0 after:transition-opacity after:duration-300 after:pointer-events-none after:-z-10 hover:after:opacity-100 max-md:gap-2 max-md:px-[9px] max-md:py-[7px] max-md:min-h-0 max-md:rounded-xl max-md:backdrop-blur-none">
              <span class="relative flex items-center justify-center w-11 h-11 shrink-0 !rounded-full [background:linear-gradient(160deg,#3B82F6,#2563EB)] border border-white/26 shadow-[inset_0_1px_0_rgba(255,255,255,.34),inset_0_-6px_12px_-6px_rgba(0,0,0,.4),0_6px_14px_-6px_rgba(37,99,235,.65)] transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(.22,1,.36,1)] group-hover/dstat:scale-[1.06] group-hover/dstat:shadow-[inset_0_1px_0_rgba(255,255,255,.42),inset_0_-6px_12px_-6px_rgba(0,0,0,.36),0_10px_22px_-8px_rgba(37,99,235,.8)] before:content-[''] before:absolute before:-inset-[9px] before:rounded-full before:[background:radial-gradient(closest-side,rgba(59,130,246,.62),rgba(59,130,246,0)_74%)] before:opacity-0 before:transition-opacity before:duration-300 before:pointer-events-none group-hover/dstat:before:opacity-100 max-md:w-7 max-md:h-7 group-hover/dstat:max-md:scale-100"><svg viewBox="0 0 24 24" aria-hidden="true" class="block w-[22px] h-[22px] stroke-white [stroke-width:1.7] [vector-effect:non-scaling-stroke] [stroke-linecap:round] [stroke-linejoin:round] fill-none overflow-visible [shape-rendering:geometricPrecision] max-md:w-5 max-md:h-5 max-md:[stroke-width:1.8]"><circle data-ln="1" cx="15.6" cy="8.4" r="4.4" class="[stroke-dasharray:1] [stroke-dashoffset:0] group-hover/dstat:animate-ico-draw motion-reduce:animate-none"></circle><path data-ln="1" d="M12.5 11.5 3.6 20.4" class="[stroke-dasharray:1] [stroke-dashoffset:0] group-hover/dstat:animate-ico-draw motion-reduce:animate-none"></path><path data-ln="1" d="m6.6 17.4 2.4 2.4" class="[stroke-dasharray:1] [stroke-dashoffset:0] group-hover/dstat:animate-ico-draw motion-reduce:animate-none"></path></svg></span>
              <span><span data-count="2394" data-pre="$" class="block text-[20px] font-semibold tracking-[-.4px] text-white leading-[1.2] transition-[transform,opacity] duration-300 ease-[cubic-bezier(.22,1,.36,1)] group-hover/dstat:-translate-y-0.5 max-md:text-[16px] max-md:tracking-[-.2px]">$0</span><span class="block text-[12px] text-white opacity-85 transition-opacity duration-300 group-hover/dstat:opacity-100 max-md:text-[10px] max-md:leading-[1.3]">Median Home Rent</span></span>
            </div>
            <div class="group/dstat relative isolate flex items-center gap-4 rounded-2xl p-4 min-h-[80px] box-border bg-[rgba(10,24,40,.86)] backdrop-blur-[8px] border border-white/14 shadow-[0_10px_24px_-10px_rgba(0,0,0,.55),0_2px_6px_-2px_rgba(0,0,0,.45)] transition-[transform,box-shadow,background-color,border-color] duration-300 ease-[cubic-bezier(.22,1,.36,1)] hover:-translate-y-2 hover:bg-[rgba(16,37,61,.93)] hover:border-[#2F80ED] hover:shadow-[0_28px_56px_-20px_rgba(0,0,0,.62),0_10px_22px_-12px_rgba(11,90,165,.55),0_2px_5px_-2px_rgba(0,0,0,.4)] after:content-[''] after:absolute after:left-[12%] after:right-[12%] after:-bottom-4 after:h-[34px] after:rounded-[50%] after:[background:radial-gradient(closest-side,rgba(47,128,237,.5),rgba(47,128,237,0)_76%)] after:blur-[12px] after:opacity-0 after:transition-opacity after:duration-300 after:pointer-events-none after:-z-10 hover:after:opacity-100 max-md:gap-2 max-md:px-[9px] max-md:py-[7px] max-md:min-h-0 max-md:rounded-xl max-md:backdrop-blur-none">
              <span class="relative flex items-center justify-center w-11 h-11 shrink-0 !rounded-full [background:linear-gradient(160deg,#3B82F6,#2563EB)] border border-white/26 shadow-[inset_0_1px_0_rgba(255,255,255,.34),inset_0_-6px_12px_-6px_rgba(0,0,0,.4),0_6px_14px_-6px_rgba(37,99,235,.65)] transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(.22,1,.36,1)] group-hover/dstat:scale-[1.06] group-hover/dstat:shadow-[inset_0_1px_0_rgba(255,255,255,.42),inset_0_-6px_12px_-6px_rgba(0,0,0,.36),0_10px_22px_-8px_rgba(37,99,235,.8)] before:content-[''] before:absolute before:-inset-[9px] before:rounded-full before:[background:radial-gradient(closest-side,rgba(59,130,246,.62),rgba(59,130,246,0)_74%)] before:opacity-0 before:transition-opacity before:duration-300 before:pointer-events-none group-hover/dstat:before:opacity-100 max-md:w-7 max-md:h-7 group-hover/dstat:max-md:scale-100"><svg viewBox="0 0 24 24" aria-hidden="true" class="block w-[22px] h-[22px] stroke-white [stroke-width:1.7] [vector-effect:non-scaling-stroke] [stroke-linecap:round] [stroke-linejoin:round] fill-none overflow-visible [shape-rendering:geometricPrecision] max-md:w-5 max-md:h-5 max-md:[stroke-width:1.8]"><path data-ln="1" d="M12.6 20.8V5.4a1.6 1.6 0 0 0-1.6-1.6H5a1.6 1.6 0 0 0-1.6 1.6v15.4" class="[stroke-dasharray:1] [stroke-dashoffset:0] group-hover/dstat:animate-ico-draw motion-reduce:animate-none"></path><path data-ln="1" d="M12.6 10.8h6a1.6 1.6 0 0 1 1.6 1.6v8.4" class="[stroke-dasharray:1] [stroke-dashoffset:0] group-hover/dstat:animate-ico-draw motion-reduce:animate-none"></path><path data-ln="1" d="M2.4 20.8h19.2" class="[stroke-dasharray:1] [stroke-dashoffset:0] group-hover/dstat:animate-ico-draw motion-reduce:animate-none"></path><path data-ln="1" d="M6.8 8.2h2.8" class="[stroke-dasharray:1] [stroke-dashoffset:0] group-hover/dstat:animate-ico-draw motion-reduce:animate-none"></path><path data-ln="1" d="M6.8 12.6h2.8" class="[stroke-dasharray:1] [stroke-dashoffset:0] group-hover/dstat:animate-ico-draw motion-reduce:animate-none"></path><path data-ln="1" d="M6.8 17h2.8" class="[stroke-dasharray:1] [stroke-dashoffset:0] group-hover/dstat:animate-ico-draw motion-reduce:animate-none"></path><path data-ln="1" d="M15.6 15h2" class="[stroke-dasharray:1] [stroke-dashoffset:0] group-hover/dstat:animate-ico-draw motion-reduce:animate-none"></path></svg></span>
              <span><span data-count="220560" class="block text-[20px] font-semibold tracking-[-.4px] text-white leading-[1.2] transition-[transform,opacity] duration-300 ease-[cubic-bezier(.22,1,.36,1)] group-hover/dstat:-translate-y-0.5 max-md:text-[16px] max-md:tracking-[-.2px]">0</span><span class="block text-[12px] text-white opacity-85 transition-opacity duration-300 group-hover/dstat:opacity-100 max-md:text-[10px] max-md:leading-[1.3]">Homes for Sale</span></span>
            </div>
          </div>
        </div>
      </div>

      <!-- live MLS strip -->
      <div class="hz-rv opacity-0 [transform:translateY(26px)] transition-[opacity,transform] duration-[750ms] ease-[cubic-bezier(.22,1,.36,1)] [&.hz-in]:opacity-100 [&.hz-in]:[transform:none] motion-reduce:!opacity-100 motion-reduce:![transform:none] relative z-[4] flex items-center gap-9 mt-[22px] pt-4 border-t border-white/10 max-md:flex-col max-md:items-start max-md:gap-3">
        <span class="inline-flex items-center gap-[11px] shrink-0 grow-0 text-[12px] font-semibold tracking-[.6px] uppercase text-white whitespace-nowrap">
          <span aria-hidden="true" class="relative inline-flex items-center justify-center w-[9px] h-[9px] shrink-0 grow-0">
            <span class="absolute inset-0 rounded-full border border-[rgba(45,200,110,.7)] animate-live-ring motion-reduce:animate-none"></span>
            <span class="absolute inset-0 rounded-full border border-[rgba(45,200,110,.55)] animate-live-ring [animation-delay:1.2s] motion-reduce:animate-none"></span>
            <span class="relative w-[9px] h-[9px] rounded-full bg-[#34D67A] animate-live-core motion-reduce:animate-none"></span>
          </span>
          Live MLS Data
        </span>
        <div class="relative grow shrink basis-auto min-w-0 h-5 overflow-hidden max-md:h-auto max-md:min-h-[40px] max-md:w-full">
          <span class="absolute inset-0 flex items-center justify-center gap-2.5 text-[14px] tracking-[.2px] text-white/92 whitespace-nowrap max-md:static max-md:flex-wrap max-md:whitespace-normal max-md:justify-start max-md:gap-y-1 max-md:leading-[1.5]">
            <span class="font-semibold text-[#5AA9F8]">We update daily</span>
            <span aria-hidden="true" class="text-white/30">•</span>
            <span>Niche &amp; U.S. News update once a year</span>
            <span aria-hidden="true" class="text-white/30">•</span>
            <span><span class="font-semibold text-[#5AA9F8]">1,622,381</span> active homes tracked</span>
          </span>
        </div>
        <div class="flex items-center gap-2 shrink-0 grow-0 max-[900px]:hidden max-md:flex max-md:flex-wrap max-md:gap-y-2 max-md:w-full">
          <span class="text-[12px] font-semibold tracking-[.6px] uppercase text-white whitespace-nowrap">Sources</span>
          <a href="https://www.houzeo.com/homes-for-sale" target="_blank" rel="noopener noreferrer" title="Houzeo MLS" class="inline-flex items-center px-2.5 py-[3px] rounded-full bg-transparent border border-white/16 text-white/72 text-[12px] font-medium tracking-[.2px] no-underline cursor-pointer transition-[transform,box-shadow,background,border-color,color] duration-[180ms] ease-[cubic-bezier(.22,1,.36,1)] hover:-translate-y-0.5 hover:text-white hover:bg-[rgba(120,190,255,.12)] hover:border-[rgba(120,190,255,.45)] hover:shadow-[0_10px_22px_-12px_rgba(0,0,0,.75)] active:translate-y-0 max-md:min-h-[28px]">MLS</a>
          <a href="https://cde.ucr.cjis.gov/LATEST/webapp/#/pages/home" target="_blank" rel="noopener noreferrer" title="FBI Uniform Crime Reporting" class="inline-flex items-center px-2.5 py-[3px] rounded-full bg-transparent border border-white/16 text-white/72 text-[12px] font-medium tracking-[.2px] no-underline cursor-pointer transition-[transform,box-shadow,background,border-color,color] duration-[180ms] ease-[cubic-bezier(.22,1,.36,1)] hover:-translate-y-0.5 hover:text-white hover:bg-[rgba(120,190,255,.12)] hover:border-[rgba(120,190,255,.45)] hover:shadow-[0_10px_22px_-12px_rgba(0,0,0,.75)] active:translate-y-0 max-md:min-h-[28px]">FBI</a>
          <a href="https://www.census.gov/data.html" target="_blank" rel="noopener noreferrer" title="U.S. Census Bureau" class="inline-flex items-center px-2.5 py-[3px] rounded-full bg-transparent border border-white/16 text-white/72 text-[12px] font-medium tracking-[.2px] no-underline cursor-pointer transition-[transform,box-shadow,background,border-color,color] duration-[180ms] ease-[cubic-bezier(.22,1,.36,1)] hover:-translate-y-0.5 hover:text-white hover:bg-[rgba(120,190,255,.12)] hover:border-[rgba(120,190,255,.45)] hover:shadow-[0_10px_22px_-12px_rgba(0,0,0,.75)] active:translate-y-0 max-md:min-h-[28px]">Census</a>
          <a href="https://www.bls.gov/data/" target="_blank" rel="noopener noreferrer" title="Bureau of Labor Statistics" class="inline-flex items-center px-2.5 py-[3px] rounded-full bg-transparent border border-white/16 text-white/72 text-[12px] font-medium tracking-[.2px] no-underline cursor-pointer transition-[transform,box-shadow,background,border-color,color] duration-[180ms] ease-[cubic-bezier(.22,1,.36,1)] hover:-translate-y-0.5 hover:text-white hover:bg-[rgba(120,190,255,.12)] hover:border-[rgba(120,190,255,.45)] hover:shadow-[0_10px_22px_-12px_rgba(0,0,0,.75)] active:translate-y-0 max-md:min-h-[28px]">BLS</a>
        </div>
      </div>
    </div>

    <!-- Avatar lightbox (persistent overlay; opacity/visibility drive the transition) -->
    <div
      class="hz-lightbox fixed inset-0 z-[2147483600] flex items-center justify-center p-[5vw] bg-[rgba(9,15,25,.82)] backdrop-blur-[3px] transition-[opacity,visibility] duration-200 cursor-pointer"
      :class="lightboxOpen ? 'opacity-100 visible' : 'opacity-0 invisible'"
      :aria-hidden="lightboxOpen ? 'false' : 'true'"
      @click.self="closeLightbox"
    >
      <img
        :src="lightboxSrc || ''"
        alt=""
        class="max-w-[min(720px,94vw)] max-h-[92vh] w-auto h-auto rounded-2xl shadow-[0_24px_70px_rgba(0,0,0,.5)] transition-transform duration-[220ms] ease-[cubic-bezier(.22,1,.36,1)]"
        :class="lightboxOpen ? 'scale-100' : 'scale-[.96]'"
      >
      <button
        aria-label="Close"
        @click="closeLightbox"
        class="absolute top-[22px] right-[26px] w-10 h-10 rounded-full border-none bg-white/14 text-white text-[20px] leading-none cursor-pointer flex items-center justify-center"
      >✕</button>
    </div>
  </section>
</template>

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

/* ---- Byline bio popovers: JS-positioned fixed cards (ported behaviour) ---- */
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
  <section ref="root" style="position:relative;padding:34px 0 18px;background-color:#182638;background-image:radial-gradient(1250px 820px at 6% -12%,#1F3652 0%,rgba(31,54,82,0) 60%),radial-gradient(1000px 720px at 88% 2%,#1A3048 0%,rgba(26,48,72,0) 62%),linear-gradient(180deg,#1A3048 0%,#182638 100%)">
    <div aria-hidden="true" style="position: absolute; inset: 0; overflow: hidden; pointer-events: none; background: linear-gradient(180deg, #09264B, #28211a)">
      <div aria-hidden="true" style="position:absolute;left:-6%;top:20%;width:640px;height:420px;border-radius:50%;background:radial-gradient(closest-side,rgba(64,150,230,.20),transparent 72%);filter:blur(30px);pointer-events:none"></div>
      <div aria-hidden="true" style="position:absolute;right:-4%;top:22%;width:720px;height:560px;border-radius:50%;background:radial-gradient(closest-side,rgba(94,180,255,.22),transparent 70%);filter:blur(40px);pointer-events:none"></div>
    </div>
    <div style="position:relative;z-index:1;max-width:1240px;margin:0 auto;padding:0 24px">
      <div class="hz-crumbrow" style="display:flex;align-items:center;justify-content:space-between;gap:20px;flex-wrap:wrap;margin-bottom:16px">
        <nav aria-label="Breadcrumb"><ol style="display:flex;align-items:center;gap:8px;font-size:14px;color:rgba(255,255,255,.65)">
          <li><a href="#" class="hz-dcrumb" style="color:rgba(255,255,255,.65)">Home</a></li>
          <li aria-hidden="true" style="color:rgba(255,255,255,.32)">/</li>
          <li><a href="#" class="hz-dcrumb" style="color:rgba(255,255,255,.65)">Best Places to Live</a></li>
          <li aria-hidden="true" style="color:rgba(255,255,255,.32)">/</li>
          <li aria-current="page" style="color:#fff;font-weight:500">Florida</li>
        </ol></nav>
        <div class="hz-engage" style="display:flex;align-items:center;justify-content:center;gap:18px;font-size:14px;color:rgba(255,255,255,.65);flex:0 0 48%;padding-left:28px">
          <span style="display:inline-flex;align-items:center;gap:7px"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.65)" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="flex-shrink:0;display:block"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg><b style="color:#fff;font-weight:600">14,599</b> reads</span>
          <span aria-hidden="true" style="width:1px;height:16px;background:rgba(255,255,255,.16)"></span>
          <span class="hz-shr-wrap" style="display:inline-flex;align-items:center">
            <button type="button" id="hz-shr-btn" aria-haspopup="true" style="display:inline-flex;align-items:center;gap:7px;background:none;border:none;padding:0;font:inherit;color:inherit;cursor:pointer"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#F2711C" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="display:block"><path d="M21.5 2.5 2.8 9.9c-.7.3-.7 1.2 0 1.5l7.4 2.9c.2.1.4.3.5.5l2.9 7.4c.3.7 1.2.7 1.5 0z"></path><path d="M21.5 2.5 10.7 13.3"></path></svg><b style="color:#fff;font-weight:600">55</b> shares<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-left:1px"><path d="M6 9l6 6 6-6"></path></svg></button>
            <span class="hz-shr-pop">
              <span class="hz-shr-tail" aria-hidden="true"></span>
              <span class="hz-shr-card">
                <button type="button" class="hz-shr-row" id="hz-shr-copy" @click="copyLink"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="display:block;flex:0 0 20px"><path d="M9 17H7A5 5 0 0 1 7 7h2"></path><path d="M15 7h2a5 5 0 1 1 0 10h-2"></path><path d="M8 12h8"></path></svg>Copy Link</button>
                <a class="hz-shr-row" href="https://www.facebook.com/sharer/sharer.php?u=https://www.houzeo.com/best-places-to-live/florida" target="_blank" rel="noopener noreferrer"><svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" style="display:block;flex:0 0 20px"><path fill="#1877F2" d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 3.874 23.1 9.101 24v-8.437H6.627v-3.49h2.474V9.412c0-4.03 1.848-5.9 5.858-5.9.401 0 .955.042 1.468.103.513.06.897.15 1.141.195v3.29a8.6 8.6 0 0 0-.653-.036c-.243-.007-.487-.01-.733-.01-.707 0-1.259.097-1.675.31a1.69 1.69 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.835h3.919l-.386 2.075-.287 1.415h-3.246V24C20.126 23.1 24 18.1 24 12.073Z"></path></svg>Share on Facebook</a>
                <a class="hz-shr-row" href="https://twitter.com/intent/tweet?url=https://www.houzeo.com/best-places-to-live/florida" target="_blank" rel="noopener noreferrer"><svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" style="display:block;flex:0 0 20px"><path fill="#101010" d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"></path></svg>Share on X</a>
                <a class="hz-shr-row" href="https://www.linkedin.com/sharing/share-offsite/?url=https://www.houzeo.com/best-places-to-live/florida" target="_blank" rel="noopener noreferrer"><svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" style="display:block;flex:0 0 20px"><path fill="#0A66C2" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433a2.063 2.063 0 1 1 0-4.126 2.063 2.063 0 0 1 0 4.126Zm1.782 13.019H3.555V9h3.564v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0Z"></path></svg>Share on LinkedIn</a>
                <a class="hz-shr-row" href="https://api.whatsapp.com/send?text=https://www.houzeo.com/best-places-to-live/florida" target="_blank" rel="noopener noreferrer"><svg width="20" height="20" viewBox="0 0 32 32" fill="none" aria-hidden="true" style="display:block;flex:0 0 20px;overflow:visible"><path fill="#25D366" fill-rule="evenodd" clip-rule="evenodd" d="M16.003 0h-.008C7.174 0 .001 7.176.001 16c0 3.5 1.128 6.744 3.046 9.377L1.053 31.32l6.15-1.966A15.87 15.87 0 0 0 16.003 32C24.827 32 32 24.822 32 16S24.827 0 16.003 0Zm9.313 22.594c-.386 1.09-1.918 1.994-3.14 2.258-.836.178-1.928.32-5.603-1.204-4.7-1.947-7.727-6.72-7.963-7.032-.235-.311-1.904-2.53-1.904-4.826 0-2.295 1.166-3.422 1.636-3.902.386-.394.102-.622 1.176-.622.347 0 .522.002.68.01.47.02.706.048.982.708.386.83 1.29 3.052 1.397 3.28.112.228.223.537.068.836-.145.31-.273.448-.501.71-.229.263-.446.464-.674.746-.209.245-.445.508-.181.963.264.446 1.168 1.912 2.497 3.094 1.715 1.527 3.106 2.014 3.608 2.223.374.155.82.118 1.094-.173.347-.374.777-.996 1.214-1.608.31-.44.702-.489 1.113-.334.418.146 3.075 1.46 3.53 1.687.456.229.757.337.868.53.108.191.108 1.097-.278 2.186Z"></path></svg>Share on Whatsapp</a>
              </span>
            </span>
            <span class="hz-shr-toast" id="hz-shr-toast" role="status" :data-on="toastOn ? '1' : null">Copied!</span>
          </span>
          <span aria-hidden="true" style="width:1px;height:16px;background:rgba(255,255,255,.16)"></span>
          <span style="display:inline-flex;align-items:center;gap:9px;background:rgba(242,113,28,.14);border:1px solid rgba(242,113,28,.34);color:#FFB37A;font-size:12px;font-weight:600;letter-spacing:.4px;text-transform:uppercase;padding:5px 13px;border-radius:999px"><span class="hz-glow-hot" style="width:7px;height:7px;border-radius:50%;background:#FF8636"></span>Hot Post · Top 1%</span>
        </div>
      </div>
      <div class="hz-hero-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:56px;align-items:stretch">
        <div style="display:flex;flex-direction:column;justify-content:flex-start;gap:20px;min-width:0;padding-bottom:0">
          <h1 class="hz-rv" style="position:relative;font-size:clamp(24px,3.55vw,48px);line-height:1.05;letter-spacing:-1.4px;margin-bottom:0;flex:0 0 auto;color:#FFFFFF">Best Places to Live in <span style="color:#4C9EE8">Florida</span></h1>
          <p class="hz-rv hz-rv-d1" style="font-size:18px;line-height:30px;color:rgba(255,255,255,.74);max-width:620px;margin:2px 0 0;flex:0 0 auto;letter-spacing:-.1px;text-wrap:pretty;hyphens:none;-webkit-hyphens:none;overflow-wrap:break-word">Life in Florida is usually painted with palm-lined streets, white sand beaches, and warm sunshine. Beyond its well-known tourist destinations, the Sunshine State has bustling places where you can pursue a career, start a family, or lead a relaxed coastal lifestyle. Here are the top 10 places to live in Florida.</p>
          <div class="hz-rv hz-rv-d2" style="display:inline-flex;align-items:center;flex-wrap:nowrap;gap:10px;font-size:12px;font-weight:400;line-height:1.4;color:rgba(255,255,255,.55);flex:0 0 auto;align-self:flex-start;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);border-radius:999px;padding:7px 18px 7px 8px;box-shadow:inset 0 1px 0 rgba(255,255,255,.08);white-space:nowrap;overflow:visible">
            <span style="display:inline-flex;align-items:center;gap:8px;white-space:nowrap">
              <img src="/images/author-jaaziel.webp" alt="" aria-hidden="true" style="width:20px;height:20px;border-radius:50%;object-fit:cover;object-position:center 22%;flex-shrink:0;border:1px solid rgba(255,255,255,.22)">
              Author: <span class="hz-bio-wrap" style="position:relative;display:inline-flex;z-index:40">
                <span tabindex="0" role="button" style="color:rgba(255,255,255,.74);font-weight:500;cursor:pointer;text-decoration:none">Jaaziel Pereira</span>
                <span class="hz-bio-pop" style="position:absolute;left:0;top:100%;padding-top:9px;width:376px;white-space:normal;z-index:60"><span aria-hidden="true" style="position:absolute;left:22px;top:3px;width:12px;height:12px;background:#131D30;border-left:1px solid rgba(255,255,255,.12);border-top:1px solid rgba(255,255,255,.12);transform:rotate(45deg);border-radius:2px 0 0 0"></span>
                  <div style="background:linear-gradient(165deg,#16223A 0%,#0D1524 60%,#0A1120 100%);border:1px solid rgba(255,255,255,.10);border-top:2px solid rgba(90,169,248,.55);border-radius:16px;padding:28px 28px 24px;box-shadow:0 28px 68px rgba(3,7,18,.62),0 8px 22px rgba(3,7,18,.42),inset 0 1px 0 rgba(255,255,255,.06);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);font-size:14px;line-height:1.7;color:#C9D1D9;position:relative">
                    <div style="display:flex;align-items:flex-start;gap:22px">
                      <div aria-hidden="true" style="width:64px;height:64px;border-radius:50%;flex-shrink:0;border:1px solid rgba(255,255,255,.16);box-shadow:0 0 0 3px rgba(90,169,248,.14),0 4px 14px rgba(3,7,18,.5);overflow:hidden"><img class="hz-avatar-zoom" src="/images/author-jaaziel.webp" alt="Jaaziel Pereira" style="width:100%;height:100%;object-fit:cover;object-position:center 22%;border-radius:50%;cursor:pointer" @click="openLightbox('/images/author-jaaziel.webp')"></div>
                      <div style="min-width:0;display:flex;flex-direction:column;align-items:flex-start;padding-top:2px">
                        <div style="font-size:20px;font-weight:600;color:#F8FAFC;line-height:1.25;letter-spacing:-.4px">Jaaziel Pereira</div>
                        <div style="font-size:12px;color:#96A2AF;margin-top:6px;line-height:1.5">Relocation &amp; Livability Analyst</div>
                        <div style="display:inline-flex;align-items:center;gap:5px;background:rgba(90,169,248,.12);border:1px solid rgba(90,169,248,.28);color:#8CC3FB;font-size:10px;font-weight:500;letter-spacing:.2px;border-radius:999px;padding:2px 9px;line-height:1.4;margin-top:12px"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#8CC3FB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"></circle><path d="m8.6 12.2 2.3 2.3 4.5-4.6"></path></svg>Author</div>
                      </div>
                    </div>
                    <div style="margin-top:20px;width:100%;text-align:left;font-size:14px;line-height:1.68;letter-spacing:.05px;color:#C4CCD6;text-wrap:pretty;hyphens:none;overflow-wrap:break-word">Jaaziel Pereira is a Relocation and Livability Analyst who helps people find places that balance affordability, comfort, and opportunity. He studies market trends, community features, and quality-of-life indicators to guide smarter relocation decisions.</div>
                    <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:16px">
                      <div style="background:rgba(90,169,248,.08);border:1px solid rgba(90,169,248,.18);border-radius:999px;padding:5px 12px;font-size:12px;color:#B9D6F5;line-height:1.4">Best Places to Live</div>
                      <div style="background:rgba(90,169,248,.08);border:1px solid rgba(90,169,248,.18);border-radius:999px;padding:5px 12px;font-size:12px;color:#B9D6F5;line-height:1.4">Safest Places to Live</div>
                    </div>
                    <div style="height:1px;background:rgba(255,255,255,.10);margin-top:22px"></div>
                    <div style="display:flex;align-items:center;justify-content:space-between;margin-top:18px">
                      <div style="display:flex;gap:10px">
                        <a href="#" aria-label="LinkedIn" class="hz-bio-ico" style="width:32px;height:32px;border-radius:9px;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.04);display:inline-flex;align-items:center;justify-content:center;transition:background .15s,border-color .15s"><svg width="15" height="15" viewBox="0 0 24 24" fill="#C9D1D9" aria-hidden="true"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3zM9 9h3.8v1.7c.6-1 1.8-1.9 3.7-1.9 2.7 0 4.5 1.7 4.5 5.3V21h-4v-6c0-1.6-.6-2.6-2-2.6-1.2 0-1.9.8-2.2 1.6-.1.3-.1.7-.1 1.1V21H9Z"></path></svg></a>
                        <a href="#" aria-label="Email" class="hz-bio-ico" style="width:32px;height:32px;border-radius:9px;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.04);display:inline-flex;align-items:center;justify-content:center;transition:background .15s,border-color .15s"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#C9D1D9" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2.5" y="5" width="19" height="14" rx="2"></rect><path d="m3 7 9 6 9-6"></path></svg></a>
                      </div>
                      <a href="https://www.houzeo.com/blog/author/Jaaziel-Pereira/" target="_blank" rel="noopener noreferrer" class="hz-viewprofile" style="display:inline-flex;align-items:center;gap:6px;height:32px;padding:0 14px;border-radius:8px;border:1px solid rgba(90,169,248,.55);background:rgba(90,169,248,.10);color:#8CC3FB;font:600 12px/1 Poppins,sans-serif;white-space:nowrap;transition:background .15s ease,border-color .15s ease,color .15s ease">View Profile<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"></path></svg></a>
                    </div>
                  </div>
                </span>
              </span>
            </span>
            <span aria-hidden="true" style="width:1px;height:14px;background:rgba(255,255,255,.16)"></span>
            <span style="display:inline-flex;align-items:center;gap:8px;white-space:nowrap">
              <img src="/images/reviewer-harshada.webp" alt="" aria-hidden="true" style="width:20px;height:20px;border-radius:50%;object-fit:cover;object-position:center 22%;flex-shrink:0;border:1px solid rgba(255,255,255,.22)">
              Reviewer: <span class="hz-bio-wrap" style="position:relative;display:inline-flex;z-index:40">
                <span tabindex="0" role="button" style="color:rgba(255,255,255,.74);font-weight:500;cursor:pointer;text-decoration:none">Harshada Jaybhaye</span>
                <span class="hz-bio-pop" style="position:absolute;left:0;top:100%;padding-top:9px;width:376px;white-space:normal;z-index:60"><span aria-hidden="true" style="position:absolute;left:22px;top:3px;width:12px;height:12px;background:#131D30;border-left:1px solid rgba(255,255,255,.12);border-top:1px solid rgba(255,255,255,.12);transform:rotate(45deg);border-radius:2px 0 0 0"></span>
                  <div style="background:linear-gradient(165deg,#16223A 0%,#0D1524 60%,#0A1120 100%);border:1px solid rgba(255,255,255,.10);border-top:2px solid rgba(52,214,122,.55);border-radius:16px;padding:28px 28px 24px;box-shadow:0 28px 68px rgba(3,7,18,.62),0 8px 22px rgba(3,7,18,.42),inset 0 1px 0 rgba(255,255,255,.06);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);font-size:14px;line-height:1.7;color:#C9D1D9;position:relative">
                    <div style="display:flex;align-items:flex-start;gap:22px">
                      <div aria-hidden="true" style="width:64px;height:64px;border-radius:50%;flex-shrink:0;border:1px solid rgba(255,255,255,.16);box-shadow:0 0 0 3px rgba(52,214,122,.14),0 4px 14px rgba(3,7,18,.5);overflow:hidden"><img class="hz-avatar-zoom" src="/images/reviewer-harshada.webp" alt="Harshada Jaybhaye" style="width:100%;height:100%;object-fit:cover;object-position:center 22%;border-radius:50%;cursor:pointer" @click="openLightbox('/images/reviewer-harshada.webp')"></div>
                      <div style="min-width:0;display:flex;flex-direction:column;align-items:flex-start;padding-top:2px">
                        <div style="font-size:20px;font-weight:600;color:#F8FAFC;line-height:1.25;letter-spacing:-.4px">Harshada Jaybhaye</div>
                        <div style="font-size:12px;color:#96A2AF;margin-top:6px;line-height:1.5">Relocation &amp; Livability Analyst</div>
                        <div style="display:inline-flex;align-items:center;gap:5px;background:rgba(52,214,122,.12);border:1px solid rgba(52,214,122,.28);color:#7FE0A6;font-size:10px;font-weight:500;letter-spacing:.2px;border-radius:999px;padding:2px 9px;line-height:1.4;margin-top:12px"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#7FE0A6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21.5s7.5-3.9 7.5-9.6V5.4L12 2.5 4.5 5.4v6.5c0 5.7 7.5 9.6 7.5 9.6Z"></path></svg>Reviewer</div>
                      </div>
                    </div>
                    <div style="margin-top:20px;width:100%;text-align:left;font-size:14px;line-height:1.68;letter-spacing:.05px;color:#C4CCD6;text-wrap:pretty;hyphens:none;overflow-wrap:break-word">Harshada Jaybhaye is a Relocation and Livability Analyst who helps people compare places beyond rankings and headlines. She evaluates affordability, safety, quality of life, and local amenities to help readers find places that match their budget, lifestyle, and long-term goals.</div>
                    <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:16px">
                      <div style="background:rgba(52,214,122,.08);border:1px solid rgba(52,214,122,.18);border-radius:999px;padding:5px 12px;font-size:12px;color:#B9E8C9;line-height:1.4">Best Places to Live</div>
                      <div style="background:rgba(52,214,122,.08);border:1px solid rgba(52,214,122,.18);border-radius:999px;padding:5px 12px;font-size:12px;color:#B9E8C9;line-height:1.4">Safest Places to Live</div>
                    </div>
                    <div style="height:1px;background:rgba(255,255,255,.10);margin-top:22px"></div>
                    <div style="display:flex;align-items:center;justify-content:space-between;margin-top:18px">
                      <div style="display:flex;gap:10px">
                        <a href="#" aria-label="LinkedIn" class="hz-bio-ico" style="width:32px;height:32px;border-radius:9px;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.04);display:inline-flex;align-items:center;justify-content:center;transition:background .15s,border-color .15s"><svg width="15" height="15" viewBox="0 0 24 24" fill="#C9D1D9" aria-hidden="true"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3zM9 9h3.8v1.7c.6-1 1.8-1.9 3.7-1.9 2.7 0 4.5 1.7 4.5 5.3V21h-4v-6c0-1.6-.6-2.6-2-2.6-1.2 0-1.9.8-2.2 1.6-.1.3-.1.7-.1 1.1V21H9Z"></path></svg></a>
                        <a href="#" aria-label="Email" class="hz-bio-ico" style="width:32px;height:32px;border-radius:9px;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.04);display:inline-flex;align-items:center;justify-content:center;transition:background .15s,border-color .15s"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#C9D1D9" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2.5" y="5" width="19" height="14" rx="2"></rect><path d="m3 7 9 6 9-6"></path></svg></a>
                      </div>
                      <a href="https://www.houzeo.com/blog/author/Harshada-Jaybhaye/" target="_blank" rel="noopener noreferrer" class="hz-viewprofile" style="display:inline-flex;align-items:center;gap:6px;height:32px;padding:0 14px;border-radius:8px;border:1px solid rgba(90,169,248,.55);background:rgba(90,169,248,.10);color:#8CC3FB;font:600 12px/1 Poppins,sans-serif;white-space:nowrap;transition:background .15s ease,border-color .15s ease,color .15s ease">View Profile<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"></path></svg></a>
                    </div>
                  </div>
                </span>
              </span>
            </span>
            <span aria-hidden="true" style="width:1px;height:11px;background:rgba(255,255,255,.14)"></span>
            <span style="display:inline-flex;align-items:center;gap:6px;white-space:nowrap">
              <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.42)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0"><rect x="3" y="5" width="18" height="16" rx="2"></rect><path d="M3 10h18M8 3v4M16 3v4"></path></svg>
              Last Updated: <span style="color:rgba(255,255,255,.74);font-weight:500">Jul 17, 2026</span>
            </span>
          </div>
          <div class="hz-ctarow" style="display:grid;grid-template-columns:1fr 1fr;gap:16px;width:100%;max-width:calc(100% - 28px);flex:0 0 auto;margin-top:auto">
            <a href="#hz-feed" class="hz-fill" style="display:inline-flex;align-items:center;justify-content:center;gap:10px;height:56px;padding:0 24px;border-radius:8px;background:linear-gradient(180deg,#2876C1,#0E5293);color:#fff;font-size:16px;font-weight:600;box-shadow:0 18px 40px -18px rgba(40,118,193,.85)">See the Rankings <span aria-hidden="true">→</span></a>
            <a href="https://www.houzeo.com/methodology/best-places-to-live-rankings" target="_blank" rel="noopener noreferrer" class="hz-dun" style="display:inline-flex;align-items:center;justify-content:center;height:56px;padding:0 24px;border-radius:8px;border:1.5px solid rgba(255,255,255,.32);background:rgba(255,255,255,.06);color:#fff;font-size:16px;font-weight:600">How We Rank</a>
          </div>
        </div>
        <div style="position:relative">
          <div aria-hidden="true" style="position:absolute;left:6%;right:-6%;top:8%;bottom:2%;border-radius:50%;background:radial-gradient(closest-side,rgba(90,175,255,.32),transparent 72%);filter:blur(48px);pointer-events:none"></div>
          <div aria-hidden="true" style="position:absolute;left:56px;right:28px;bottom:-18px;height:64px;border-radius:50%;background:radial-gradient(closest-side,rgba(3,12,24,.72),transparent 78%);filter:blur(26px);pointer-events:none"></div>
          <div id="hz-hero-photo-a" class="hz-dphoto" style="position:relative;height:430px;margin-left:28px;border-radius:24px;overflow:hidden;box-shadow:0 0 0 1px rgba(255,255,255,.12),0 50px 100px -40px rgba(0,0,0,.75),0 0 90px -30px rgba(90,175,255,.55)"><div style="position:relative;width:100%;height:100%"><img src="/images/hero-naples.webp" alt="Naples, Florida waterfront" style="width:100%;height:100%;object-fit:cover;display:block"></div></div>
          <div aria-hidden="true" style="position:absolute;left:28px;right:0;top:0;height:430px;border-radius:24px;pointer-events:none;background:linear-gradient(0deg,rgba(5,15,27,.88) 0%,rgba(5,15,27,.74) 16%,rgba(5,15,27,.44) 32%,rgba(5,15,27,.18) 50%,rgba(5,15,27,.10) 70%,rgba(5,15,27,.14) 100%)"></div>
          <div class="hz-herostats hz-rv hz-rv-d1" style="position:absolute;left:52px;right:24px;bottom:24px;display:grid;grid-template-columns:1fr 1fr;grid-auto-rows:1fr;gap:16px;align-items:stretch">
            <div class="hz-dstat" style="display:flex;align-items:center;gap:16px;border-radius:16px;padding:16px;min-height:80px;box-sizing:border-box">
              <span class="hz-dstat-ico" style="width:44px;height:44px;border-radius:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0"><svg viewBox="0 0 24 24" aria-hidden="true"><path data-ln="1" d="M3.4 10.3 12 3.4l8.6 6.9"></path><path data-ln="1" d="M5.2 9.6V19a1.8 1.8 0 0 0 1.8 1.8h10a1.8 1.8 0 0 0 1.8-1.8V9.6"></path><path data-ln="1" d="M12 9.6v8.8"></path><path data-ln="1" d="M14 11.6a2.2 2.2 0 0 0-2-1.1 1.7 1.7 0 0 0 0 3.4 1.7 1.7 0 0 1 0 3.4 2.2 2.2 0 0 1-2-1.1"></path></svg></span>
              <span><span style="display:block;font-size:20px;font-weight:600;letter-spacing:-.4px;color:#FFFFFF;line-height:1.2" data-count="395798" data-pre="$">$0</span><span class="hz-dstat-label" style="display:block;font-size:12px;color:#FFFFFF">Median Home Price</span></span>
            </div>
            <div class="hz-dstat" style="display:flex;align-items:center;gap:16px;border-radius:16px;padding:16px;min-height:80px;box-sizing:border-box">
              <span class="hz-dstat-ico" style="width:44px;height:44px;border-radius:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0"><svg viewBox="0 0 24 24" aria-hidden="true"><path data-ln="1" d="M12 21.2c4.1-1.8 7-4.9 7-9.3V5.8L12 3.2 5 5.8v6.1c0 4.4 2.9 7.5 7 9.3Z"></path><path data-ln="1" d="m8.7 11.9 2.4 2.4 4.2-4.4"></path></svg></span>
              <span><span style="display:block;font-size:20px;font-weight:600;letter-spacing:-.4px;color:#FFFFFF;line-height:1.2" data-count="40">0</span><span class="hz-dstat-label" style="display:block;font-size:12px;color:#FFFFFF">Safety Score</span></span>
            </div>
            <div class="hz-dstat" style="display:flex;align-items:center;gap:16px;border-radius:16px;padding:16px;min-height:80px;box-sizing:border-box">
              <span class="hz-dstat-ico" style="width:44px;height:44px;border-radius:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0"><svg viewBox="0 0 24 24" aria-hidden="true"><circle data-ln="1" cx="15.6" cy="8.4" r="4.4"></circle><path data-ln="1" d="M12.5 11.5 3.6 20.4"></path><path data-ln="1" d="m6.6 17.4 2.4 2.4"></path></svg></span>
              <span><span style="display:block;font-size:20px;font-weight:600;letter-spacing:-.4px;color:#FFFFFF;line-height:1.2" data-count="2394" data-pre="$">$0</span><span class="hz-dstat-label" style="display:block;font-size:12px;color:#FFFFFF">Median Home Rent</span></span>
            </div>
            <div class="hz-dstat" style="display:flex;align-items:center;gap:16px;border-radius:16px;padding:16px;min-height:80px;box-sizing:border-box">
              <span class="hz-dstat-ico" style="width:44px;height:44px;border-radius:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0"><svg viewBox="0 0 24 24" aria-hidden="true"><path data-ln="1" d="M12.6 20.8V5.4a1.6 1.6 0 0 0-1.6-1.6H5a1.6 1.6 0 0 0-1.6 1.6v15.4"></path><path data-ln="1" d="M12.6 10.8h6a1.6 1.6 0 0 1 1.6 1.6v8.4"></path><path data-ln="1" d="M2.4 20.8h19.2"></path><path data-ln="1" d="M6.8 8.2h2.8"></path><path data-ln="1" d="M6.8 12.6h2.8"></path><path data-ln="1" d="M6.8 17h2.8"></path><path data-ln="1" d="M15.6 15h2"></path></svg></span>
              <span><span style="display:block;font-size:20px;font-weight:600;letter-spacing:-.4px;color:#FFFFFF;line-height:1.2" data-count="220560">0</span><span class="hz-dstat-label" style="display:block;font-size:12px;color:#FFFFFF">Homes for Sale</span></span>
            </div>
          </div>
        </div>
      </div>
      <div id="hz-method" class="hz-rv hz-mlsstrip" style="position:relative;z-index:4;display:flex;align-items:center;gap:36px;margin-top:22px;padding-top:16px;border-top:1px solid rgba(255,255,255,.10)">
        <span style="display:inline-flex;align-items:center;gap:11px;flex:none;font-size:12px;font-weight:600;letter-spacing:.6px;text-transform:uppercase;color:#FFFFFF;white-space:nowrap">
          <span aria-hidden="true" style="position:relative;display:inline-flex;align-items:center;justify-content:center;width:9px;height:9px;flex:none">
            <span class="hz-live-ring" style="position:absolute;inset:0;border-radius:50%;border:1px solid rgba(45,200,110,.7)"></span>
            <span class="hz-live-ring hz-live-ring2" style="position:absolute;inset:0;border-radius:50%;border:1px solid rgba(45,200,110,.55)"></span>
            <span class="hz-live-core" style="position:relative;width:9px;height:9px;border-radius:50%;background:#34D67A"></span>
          </span>
          Live MLS Data
        </span>
        <div class="hz-mrot" style="position:relative;flex:1 1 auto;min-width:0;height:20px;overflow:hidden">
          <span style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;gap:10px;font-size:14px;letter-spacing:.2px;color:rgba(255,255,255,.92);white-space:nowrap">
            <span style="font-weight:600;color:#5AA9F8">We update daily</span>
            <span aria-hidden="true" style="color:rgba(255,255,255,.30)">•</span>
            <span>Niche &amp; U.S. News update once a year</span>
            <span aria-hidden="true" style="color:rgba(255,255,255,.30)">•</span>
            <span><span style="font-weight:600;color:#5AA9F8">1,622,381</span> active homes tracked</span>
          </span>
        </div>
        <div class="hz-srcrow" style="display:flex;align-items:center;gap:8px;flex:none">
          <span style="font-size:12px;font-weight:600;letter-spacing:.6px;text-transform:uppercase;color:#FFFFFF;white-space:nowrap">Sources</span>
          <a class="hz-dpchip" href="https://www.houzeo.com/homes-for-sale" target="_blank" rel="noopener noreferrer" title="Houzeo MLS">MLS</a>
          <a class="hz-dpchip" href="https://cde.ucr.cjis.gov/LATEST/webapp/#/pages/home" target="_blank" rel="noopener noreferrer" title="FBI Uniform Crime Reporting">FBI</a>
          <a class="hz-dpchip" href="https://www.census.gov/data.html" target="_blank" rel="noopener noreferrer" title="U.S. Census Bureau">Census</a>
          <a class="hz-dpchip" href="https://www.bls.gov/data/" target="_blank" rel="noopener noreferrer" title="Bureau of Labor Statistics">BLS</a>
        </div>
      </div>
    </div>

    <!-- Avatar lightbox (persistent overlay; opacity/visibility drive the transition) -->
    <div
      class="hz-lightbox"
      :aria-hidden="lightboxOpen ? 'false' : 'true'"
      @click.self="closeLightbox"
      :style="{
        position: 'fixed', inset: 0, zIndex: 2147483600, display: 'flex',
        alignItems: 'center', justifyContent: 'center', padding: '5vw',
        background: 'rgba(9,15,25,.82)', backdropFilter: 'blur(3px)',
        transition: 'opacity .2s ease, visibility .2s ease', cursor: 'pointer',
        opacity: lightboxOpen ? 1 : 0, visibility: lightboxOpen ? 'visible' : 'hidden'
      }"
    >
      <img
        :src="lightboxSrc || ''"
        alt=""
        :style="{
          maxWidth: 'min(720px,94vw)', maxHeight: '92vh', width: 'auto', height: 'auto',
          borderRadius: '16px', boxShadow: '0 24px 70px rgba(0,0,0,.5)',
          transform: lightboxOpen ? 'scale(1)' : 'scale(.96)',
          transition: 'transform .22s cubic-bezier(.22,1,.36,1)'
        }"
      >
      <button
        aria-label="Close"
        @click="closeLightbox"
        style="position:absolute;top:22px;right:26px;width:40px;height:40px;border-radius:50%;border:none;background:rgba(255,255,255,.14);color:#fff;font-size:20px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center"
      >✕</button>
    </div>
  </section>
</template>

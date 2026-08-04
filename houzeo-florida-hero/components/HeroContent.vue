<script setup>
// Left hero column: headline, intro, byline and the CTA row.
// On mobile the wrapper becomes `contents` so its children reflow as direct
// grid items and interleave with the photo (headline, intro, photo, byline, CTAs).
const { el: h1El, shown: h1Shown } = useReveal()
const { el: pEl, shown: pShown } = useReveal()
</script>

<template>
  <div class="flex flex-col justify-start gap-[20px] min-w-0 pb-0 max-[767px]:contents md:max-[1024px]:pb-[8px]">
    <h1
      ref="h1El"
      class="relative text-[clamp(24px,3.55vw,48px)] leading-[1.05] tracking-[-1.4px] mb-0 flex-none text-white
             transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]
             max-[767px]:order-1 max-[767px]:text-[24px] max-[767px]:leading-[1.07] max-[767px]:tracking-[-1px] max-[767px]:m-0"
      :class="h1Shown ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[26px]'"
    >
      Best Places to Live in <span class="text-[#4C9EE8]">Florida</span>
    </h1>

    <p
      ref="pEl"
      class="text-[18px] leading-[30px] text-[rgba(255,255,255,0.9)] max-w-[620px] mt-[2px] mb-0 flex-none tracking-[-0.1px]
             [text-wrap:pretty] [hyphens:none] [overflow-wrap:break-word]
             transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] delay-[90ms]
             max-[767px]:order-2 max-[767px]:text-[15px] max-[767px]:leading-[1.6] max-[767px]:max-w-full max-[767px]:m-0
             md:max-[1024px]:max-w-[66ch]"
      :class="pShown ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[26px]'"
    >
      Life in Florida is usually painted with palm-lined streets, white sand beaches, and warm
      sunshine. Beyond its well-known tourist destinations, the Sunshine State has bustling places
      where you can pursue a career, start a family, or lead a relaxed coastal lifestyle. Here are
      the top 10 places to live in Florida.
    </p>

    <Byline />

    <div
      class="grid grid-cols-2 gap-[16px] w-full max-w-[calc(100%-28px)] flex-none mt-auto
             max-[767px]:order-5 max-[767px]:grid-cols-1 max-[767px]:max-w-full max-[767px]:gap-[10px] max-[767px]:mt-0
             md:max-[1024px]:mt-0 md:max-[1024px]:max-w-[420px]"
    >
      <a
        href="#hz-feed"
        class="inline-flex items-center justify-center gap-[10px] h-[56px] px-[24px] rounded-[8px]
               [background:linear-gradient(180deg,#2876C1,#0E5293)] text-white text-[16px] font-semibold no-underline
               shadow-[0_18px_40px_-18px_rgba(40,118,193,0.85)]
               transition-[transform,box-shadow,filter] duration-200 ease-[cubic-bezier(0.22,0.61,0.36,1)]
               hover:-translate-y-[3px] hover:brightness-[1.06] hover:shadow-[0_14px_28px_-10px_rgba(40,118,193,0.65)]
               active:-translate-y-[1px] active:scale-[0.99] max-[767px]:h-[50px] max-[767px]:w-full"
      >See the Rankings <span aria-hidden="true">→</span></a>

      <a
        href="https://www.houzeo.com/methodology/best-places-to-live-rankings" target="_blank" rel="noopener noreferrer"
        class="inline-flex items-center justify-center h-[56px] px-[24px] rounded-[8px] no-underline
               border-[1.5px] border-[rgba(255,255,255,0.32)] bg-[rgba(255,255,255,0.06)] text-white text-[16px] font-semibold
               transition-[transform,background-color,border-color,box-shadow] duration-200
               hover:-translate-y-[3px] hover:bg-[rgba(255,255,255,0.12)] hover:border-[rgba(255,255,255,0.5)]
               hover:shadow-[0_14px_30px_-14px_rgba(140,200,255,0.55)] active:-translate-y-[1px] active:scale-[0.99]
               max-[767px]:h-[50px] max-[767px]:w-full"
      >How We Rank</a>
    </div>
  </div>
</template>

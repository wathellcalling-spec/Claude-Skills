<script setup>
// Live-data strip under the hero: pulsing "Live MLS Data" badge, an update
// message, and the source chips. Reveal-on-scroll on the whole strip.
const { el, shown } = useReveal()

const sources = [
  { label: 'MLS', href: 'https://www.houzeo.com/homes-for-sale', title: 'Houzeo MLS' },
  { label: 'FBI', href: 'https://cde.ucr.cjis.gov/LATEST/webapp/#/pages/home', title: 'FBI Uniform Crime Reporting' },
  { label: 'Census', href: 'https://www.census.gov/data.html', title: 'U.S. Census Bureau' },
  { label: 'BLS', href: 'https://www.bls.gov/data/', title: 'Bureau of Labor Statistics' }
]
</script>

<template>
  <div
    ref="el"
    id="hz-method"
    class="relative z-[4] flex items-center gap-[36px] mt-[22px] pt-[16px] border-t border-[rgba(255,255,255,0.10)]
           transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]
           max-[767px]:flex-col max-[767px]:items-start max-[767px]:gap-[12px]"
    :class="shown ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[26px]'"
  >
    <!-- Live MLS Data label -->
    <span class="inline-flex items-center gap-[11px] flex-none text-[12px] font-semibold tracking-[0.6px] uppercase text-white whitespace-nowrap">
      <span aria-hidden="true" class="relative inline-flex items-center justify-center w-[9px] h-[9px] flex-none">
        <span class="absolute inset-0 rounded-full border border-[rgba(45,200,110,0.7)] animate-ping motion-reduce:animate-none" />
        <span class="absolute inset-0 rounded-full border border-[rgba(45,200,110,0.55)] animate-ping [animation-delay:1.2s] motion-reduce:animate-none" />
        <span class="relative w-[9px] h-[9px] rounded-full bg-[#34D67A] shadow-[0_0_8px_2px_rgba(52,214,122,0.45)] animate-pulse motion-reduce:animate-none" />
      </span>
      Live MLS Data
    </span>

    <!-- rotating update message -->
    <div class="relative flex-1 min-w-0 h-[20px] overflow-hidden max-[767px]:h-auto max-[767px]:min-h-[40px] max-[767px]:w-full">
      <span class="absolute inset-0 flex items-center justify-center gap-[10px] text-[14px] tracking-[0.2px] text-[rgba(255,255,255,0.92)] whitespace-nowrap max-[767px]:static max-[767px]:flex-wrap max-[767px]:whitespace-normal max-[767px]:justify-start max-[767px]:gap-y-[4px] max-[767px]:leading-[1.5]">
        <span class="font-semibold text-[#5AA9F8]">We update daily</span>
        <span aria-hidden="true" class="text-[rgba(255,255,255,0.30)]">•</span>
        <span>Niche &amp; U.S. News update once a year</span>
        <span aria-hidden="true" class="text-[rgba(255,255,255,0.30)]">•</span>
        <span><span class="font-semibold text-[#5AA9F8]">1,622,381</span> active homes tracked</span>
      </span>
    </div>

    <!-- sources -->
    <div class="flex items-center gap-[8px] flex-none max-[900px]:hidden max-[767px]:flex max-[767px]:flex-wrap max-[767px]:gap-y-[8px] max-[767px]:w-full">
      <span class="text-[12px] font-semibold tracking-[0.6px] uppercase text-white whitespace-nowrap">Sources</span>
      <a
        v-for="s in sources" :key="s.label"
        :href="s.href" :title="s.title" target="_blank" rel="noopener noreferrer"
        class="inline-flex items-center px-[10px] py-[3px] rounded-full bg-transparent border border-[rgba(255,255,255,0.16)]
               text-[rgba(255,255,255,0.72)] text-[12px] font-medium tracking-[0.2px] no-underline cursor-pointer
               transition-[transform,box-shadow,background,border-color,color] duration-[180ms] ease-[cubic-bezier(0.22,1,0.36,1)]
               hover:-translate-y-[2px] hover:bg-[rgba(120,190,255,0.12)] hover:border-[rgba(120,190,255,0.45)] hover:text-white
               hover:shadow-[0_10px_22px_-12px_rgba(0,0,0,0.75)] active:translate-y-0 max-[767px]:min-h-[28px]"
      >{{ s.label }}</a>
    </div>
  </div>
</template>

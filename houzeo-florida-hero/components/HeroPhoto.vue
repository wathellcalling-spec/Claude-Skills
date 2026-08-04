<script setup>
// Right hero column: the Naples photo with glow/shadow decor, the "Hot Post"
// pill and the reveal-on-scroll stat grid overlaid at the bottom.
const { el: statsEl, shown: statsShown } = useReveal()
</script>

<template>
  <div class="relative max-[767px]:order-3">
    <!-- ambient glow behind the photo -->
    <div
      aria-hidden="true"
      class="absolute left-[6%] right-[-6%] top-[8%] bottom-[2%] rounded-full [background:radial-gradient(closest-side,rgba(90,175,255,0.32),transparent_72%)] blur-[48px] pointer-events-none"
    />
    <!-- grounding shadow -->
    <div
      aria-hidden="true"
      class="absolute left-[56px] right-[28px] bottom-[-18px] h-[64px] rounded-full [background:radial-gradient(closest-side,rgba(3,12,24,0.72),transparent_78%)] blur-[26px] pointer-events-none"
    />

    <!-- photo -->
    <div
      id="hz-hero-photo-a"
      class="relative h-[430px] ml-[28px] rounded-[24px] overflow-hidden
             shadow-[0_0_0_1px_rgba(255,255,255,0.12),0_50px_100px_-40px_rgba(0,0,0,0.75),0_0_90px_-30px_rgba(90,175,255,0.55)]
             md:max-[1024px]:ml-0 max-[767px]:h-[270px] max-[767px]:ml-0 max-[767px]:rounded-[20px]"
    >
      <img
        src="/images/naples-hero.webp"
        alt="Waterfront homes and boat canals in Naples, Florida"
        class="w-full h-full object-cover [filter:contrast(1.12)_saturate(1.14)_brightness(1.03)]"
      >
    </div>

    <!-- top-to-bottom darkening overlay -->
    <div
      aria-hidden="true"
      class="absolute left-[28px] right-0 top-0 h-[430px] rounded-[24px] pointer-events-none
             [background:linear-gradient(0deg,rgba(5,15,27,0.88)_0%,rgba(5,15,27,0.74)_16%,rgba(5,15,27,0.44)_32%,rgba(5,15,27,0.18)_50%,rgba(5,15,27,0.10)_70%,rgba(5,15,27,0.14)_100%)]
             md:max-[1024px]:left-0 max-[767px]:left-0 max-[767px]:right-0 max-[767px]:h-[270px] max-[767px]:rounded-[20px]
             max-[767px]:[background:linear-gradient(0deg,rgba(5,15,27,0.93)_0%,rgba(5,15,27,0.80)_26%,rgba(5,15,27,0.34)_56%,rgba(5,15,27,0.08)_100%)]"
    />

    <!-- hot post pill -->
    <span
      class="absolute top-[16px] right-[16px] z-[6] inline-flex items-center gap-[9px] bg-[rgba(15,26,42,0.62)] backdrop-blur-[10px]
             border border-[rgba(242,113,28,0.44)] text-[#FFB37A] text-[12px] font-semibold tracking-[0.4px] uppercase px-[14px] py-[6px]
             rounded-full shadow-[0_8px_20px_-10px_rgba(0,0,0,0.6)]
             max-[767px]:top-[10px] max-[767px]:right-[10px] max-[767px]:text-[10px] max-[767px]:px-[11px] max-[767px]:py-[5px] max-[767px]:gap-[7px]"
    >
      <span class="w-[7px] h-[7px] rounded-full bg-[#FF8636] shadow-[0_0_12px_3px_rgba(242,113,28,0.75)] animate-pulse motion-reduce:animate-none" />
      Hot Post · Top 1%
    </span>

    <!-- stat cards -->
    <div
      ref="statsEl"
      class="absolute left-[52px] right-[24px] bottom-[24px] grid grid-cols-2 auto-rows-fr gap-[16px] items-stretch
             transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] delay-[90ms]
             md:max-[1024px]:left-[24px]
             max-[767px]:left-[10px] max-[767px]:right-[10px] max-[767px]:bottom-[10px] max-[767px]:top-auto max-[767px]:auto-rows-auto max-[767px]:gap-[9px]"
      :class="statsShown ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[26px]'"
    >
      <HeroStatCard v-for="stat in HERO_STATS" :key="stat.id" :stat="stat" />
    </div>
  </div>
</template>

<script setup>
// The whole hero: dark gradient stage with breadcrumb + engagement row,
// the two-column hero grid (content / photo) and the live-data strip.
</script>

<template>
  <section
    class="relative pt-[34px] pb-[18px] bg-[#182638]
           [background-image:radial-gradient(1250px_820px_at_6%_-12%,#1F3652_0%,rgba(31,54,82,0)_60%),radial-gradient(1000px_720px_at_88%_2%,#1A3048_0%,rgba(26,48,72,0)_62%),linear-gradient(180deg,#1A3048_0%,#182638_100%)]
           max-[767px]:pt-[12px] max-[767px]:pb-[30px]"
  >
    <!-- decorative background layers -->
    <div aria-hidden="true" class="absolute inset-0 overflow-hidden pointer-events-none [background:linear-gradient(180deg,#09264B,#28211a)]">
      <div aria-hidden="true" class="absolute left-[-6%] top-[20%] w-[640px] h-[420px] rounded-full [background:radial-gradient(closest-side,rgba(64,150,230,0.20),transparent_72%)] blur-[30px] pointer-events-none" />
      <div aria-hidden="true" class="absolute right-[-4%] top-[22%] w-[720px] h-[560px] rounded-full [background:radial-gradient(closest-side,rgba(94,180,255,0.22),transparent_70%)] blur-[40px] pointer-events-none" />
    </div>

    <div class="relative z-[1] max-w-[1240px] mx-auto px-[24px]">
      <!-- breadcrumb + engagement -->
      <div class="grid grid-cols-2 items-center gap-[56px] mb-[16px]
                  max-[1080px]:flex max-[1080px]:flex-wrap max-[1080px]:justify-between max-[1080px]:gap-[12px]
                  max-[767px]:flex-col max-[767px]:items-start max-[767px]:gap-[9px] max-[767px]:mb-[12px]">
        <nav aria-label="Breadcrumb">
          <ol class="flex items-center gap-[8px] text-[14px] text-[rgba(255,255,255,0.65)]">
            <li><a href="#" class="text-[rgba(255,255,255,0.65)] no-underline transition-colors duration-[180ms] hover:text-white">Home</a></li>
            <li aria-hidden="true" class="text-[rgba(255,255,255,0.32)]">/</li>
            <li><a href="#" class="text-[rgba(255,255,255,0.65)] no-underline transition-colors duration-[180ms] hover:text-white">Best Places to Live</a></li>
            <li aria-hidden="true" class="text-[rgba(255,255,255,0.32)]">/</li>
            <li aria-current="page" class="text-white font-medium">Florida</li>
          </ol>
        </nav>

        <div class="flex items-center justify-center flex-wrap gap-x-[12px] gap-y-[6px] text-[12px] text-[rgba(255,255,255,0.65)] flex-auto min-w-0 pl-[28px]
                    max-[1080px]:basis-full max-[1080px]:justify-start max-[1080px]:pl-0 max-[1080px]:gap-x-[18px]
                    max-[767px]:w-full max-[767px]:max-w-full">
          <span class="inline-flex items-center gap-[7px]">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.65)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="block shrink-0">
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
              <circle cx="12" cy="12" r="3" />
            </svg><b class="text-white font-semibold">14,599</b> reads
          </span>
          <span aria-hidden="true" class="w-[1px] h-[16px] bg-[rgba(255,255,255,0.16)] max-[1080px]:hidden" />

          <ShareMenu />

          <span aria-hidden="true" class="w-[1px] h-[16px] bg-[rgba(255,255,255,0.16)] max-[1080px]:hidden" />
          <span class="inline-flex items-center gap-[7px] whitespace-nowrap max-[767px]:text-[10px] max-[767px]:p-[5px_8px]">
            <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.5)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0 block">
              <rect x="3" y="5" width="18" height="16" rx="2" />
              <path d="M3 10h18M8 3v4M16 3v4" />
            </svg>Last Updated: <span class="text-white font-semibold">Jul 17, 2026</span>
          </span>
        </div>
      </div>

      <!-- hero grid -->
      <div class="grid grid-cols-2 gap-[56px] items-stretch
                  max-[1024px]:grid-cols-1
                  max-[767px]:flex max-[767px]:flex-col max-[767px]:gap-[12px] max-[767px]:items-stretch">
        <HeroContent />
        <HeroPhoto />
      </div>

      <!-- live-data strip -->
      <MlsStrip />
    </div>
  </section>
</template>

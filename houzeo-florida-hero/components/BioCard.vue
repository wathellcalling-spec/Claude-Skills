<script setup>
import { computed } from 'vue'

// The hover/tap bio popover for a byline contributor. Accent-specific styles
// are held as complete static class strings (so Tailwind's scanner emits them).
const props = defineProps({
  person: { type: Object, required: true },
  open: { type: Boolean, default: false }
})

const { open: openLightbox } = useLightbox()

const ACCENTS = {
  author: {
    borderTop: 'border-t-[rgba(90,169,248,0.55)]',
    avatarShadow: 'shadow-[0_0_0_3px_rgba(90,169,248,0.14),0_4px_14px_rgba(3,7,18,0.5)]',
    badge: 'bg-[rgba(90,169,248,0.12)] border-[rgba(90,169,248,0.28)] text-[#8CC3FB]',
    chip: 'bg-[rgba(90,169,248,0.08)] border-[rgba(90,169,248,0.18)] text-[#B9D6F5]',
    label: 'Author'
  },
  editor: {
    borderTop: 'border-t-[rgba(52,214,122,0.55)]',
    avatarShadow: 'shadow-[0_0_0_3px_rgba(52,214,122,0.14),0_4px_14px_rgba(3,7,18,0.5)]',
    badge: 'bg-[rgba(52,214,122,0.12)] border-[rgba(52,214,122,0.28)] text-[#7FE0A6]',
    chip: 'bg-[rgba(52,214,122,0.08)] border-[rgba(52,214,122,0.18)] text-[#B9E8C9]',
    label: 'Editor'
  }
}

const accent = computed(() => ACCENTS[props.person.accent] || ACCENTS.author)
</script>

<template>
  <span
    class="absolute left-0 top-full pt-[9px] w-[376px] whitespace-normal z-[60]
           transition-[opacity,transform,visibility] duration-200 ease-out
           max-[767px]:fixed max-[767px]:inset-x-[12px] max-[767px]:bottom-[12px] max-[767px]:top-auto
           max-[767px]:w-auto max-[767px]:max-w-[344px] max-[767px]:mx-auto max-[767px]:pt-0 max-[767px]:z-[2147483001]"
    :class="open
      ? 'opacity-100 visible translate-y-0 pointer-events-auto'
      : 'opacity-0 invisible translate-y-[8px] pointer-events-none'"
  >
    <!-- arrow (hidden on the mobile bottom-sheet layout) -->
    <span
      aria-hidden="true"
      class="absolute left-[22px] top-[4px] w-[14px] h-[14px] [background:#16223A] border-l border-t border-[rgba(255,255,255,0.10)] rotate-45 rounded-tl-[3px] z-[2] max-[767px]:hidden"
    />

    <div
      class="relative z-[1] [background:linear-gradient(165deg,#16223A_0%,#0D1524_60%,#0A1120_100%)]
             border border-[rgba(255,255,255,0.10)] border-t-2 rounded-[16px] p-[28px_28px_24px]
             shadow-[0_28px_68px_rgba(3,7,18,0.62),0_8px_22px_rgba(3,7,18,0.42),inset_0_1px_0_rgba(255,255,255,0.06)]
             backdrop-blur-[10px] text-[14px] leading-[1.7] text-[#C9D1D9]"
      :class="accent.borderTop"
    >
      <div class="flex items-start gap-[22px]">
        <div
          class="w-[64px] h-[64px] rounded-full shrink-0 border border-[rgba(255,255,255,0.16)] overflow-hidden"
          :class="accent.avatarShadow"
        >
          <img
            :src="person.avatar" :alt="person.name"
            class="w-full h-full object-cover object-[center_22%] rounded-full cursor-pointer"
            @click="openLightbox(person.avatar)"
          >
        </div>
        <div class="min-w-0 flex flex-col items-start pt-[2px]">
          <div class="text-[20px] font-semibold text-[#F8FAFC] leading-[1.25] tracking-[-0.4px]">{{ person.name }}</div>
          <div class="text-[12px] text-[#96A2AF] mt-[6px] leading-[1.5]">{{ person.title }}</div>
          <div
            class="inline-flex items-center gap-[5px] border text-[10px] font-medium tracking-[0.2px] rounded-full px-[9px] py-[2px] leading-[1.4] mt-[12px]"
            :class="accent.badge"
          >
            <svg v-if="person.accent === 'author'" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#8CC3FB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="9" />
              <path d="m8.6 12.2 2.3 2.3 4.5-4.6" />
            </svg>
            <svg v-else width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#7FE0A6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M12 21.5s7.5-3.9 7.5-9.6V5.4L12 2.5 4.5 5.4v6.5c0 5.7 7.5 9.6 7.5 9.6Z" />
            </svg>
            {{ accent.label }}
          </div>
        </div>
      </div>

      <div class="mt-[20px] w-full text-left text-[14px] leading-[1.68] tracking-[0.05px] text-[#C4CCD6] [overflow-wrap:break-word]">{{ person.bio }}</div>

      <div class="flex flex-wrap gap-[8px] mt-[16px]">
        <div
          v-for="topic in person.topics" :key="topic"
          class="border rounded-full px-[12px] py-[5px] text-[12px] leading-[1.4]"
          :class="accent.chip"
        >{{ topic }}</div>
      </div>

      <div class="h-[1px] bg-[rgba(255,255,255,0.10)] mt-[22px]" />

      <div class="flex items-center justify-between mt-[18px]">
        <div class="flex gap-[10px]">
          <a href="#" aria-label="LinkedIn" class="w-[32px] h-[32px] rounded-[9px] border border-[rgba(255,255,255,0.14)] bg-[rgba(255,255,255,0.04)] inline-flex items-center justify-center transition-[background,border-color] duration-150 hover:bg-[rgba(90,169,248,0.14)] hover:border-[rgba(90,169,248,0.55)]">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="#C9D1D9" aria-hidden="true"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3zM9 9h3.8v1.7c.6-1 1.8-1.9 3.7-1.9 2.7 0 4.5 1.7 4.5 5.3V21h-4v-6c0-1.6-.6-2.6-2-2.6-1.2 0-1.9.8-2.2 1.6-.1.3-.1.7-.1 1.1V21H9Z" /></svg>
          </a>
          <a href="#" aria-label="Email" class="w-[32px] h-[32px] rounded-[9px] border border-[rgba(255,255,255,0.14)] bg-[rgba(255,255,255,0.04)] inline-flex items-center justify-center transition-[background,border-color] duration-150 hover:bg-[rgba(90,169,248,0.14)] hover:border-[rgba(90,169,248,0.55)]">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#C9D1D9" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2.5" y="5" width="19" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>
          </a>
        </div>
        <a
          :href="person.profileUrl" target="_blank" rel="noopener noreferrer"
          class="inline-flex items-center gap-[6px] h-[32px] px-[14px] rounded-[8px] border border-[rgba(90,169,248,0.55)] bg-[rgba(90,169,248,0.10)] text-[#8CC3FB] font-semibold text-[12px] leading-none whitespace-nowrap transition-[background,border-color,color] duration-150 hover:bg-[rgba(90,169,248,0.14)] hover:border-[#8CC3FB] hover:text-[#CFE6FE]"
        >View Profile<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg></a>
      </div>
    </div>
  </span>
</template>

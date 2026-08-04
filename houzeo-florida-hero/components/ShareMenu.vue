<script setup>
import { ref } from 'vue'

// Share popover with clipboard copy + toast, ported from interactions.js.
// The popover shows on hover / focus-within (pure Tailwind state variants);
// the toast is driven by reactive state after a successful copy.
const copied = ref(false)
let toastTimer = null

const copyLink = async () => {
  const url = SHARE_URL + '#'
  try {
    await navigator.clipboard.writeText(url)
  } catch (err) {
    // clipboard API is unavailable over file:// and in older Safari
    const field = document.createElement('textarea')
    field.value = url
    field.style.position = 'fixed'
    field.style.opacity = '0'
    document.body.appendChild(field)
    field.select()
    try {
      document.execCommand('copy')
    } catch (fallbackErr) {
      /* nothing else to try — the toast still confirms the intent */
    }
    field.remove()
  }
  copied.value = true
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    copied.value = false
  }, 1600)
}
</script>

<template>
  <span class="group relative inline-flex items-center">
    <button
      type="button"
      aria-haspopup="true"
      class="inline-flex items-center gap-[7px] bg-transparent border-none p-0 font-inherit text-inherit cursor-pointer"
    >
      <svg
        width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#F2711C"
        stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"
        class="block"
      >
        <path d="M21.5 2.5 2.8 9.9c-.7.3-.7 1.2 0 1.5l7.4 2.9c.2.1.4.3.5.5l2.9 7.4c.3.7 1.2.7 1.5 0z" />
        <path d="M21.5 2.5 10.7 13.3" />
      </svg>
      <b class="text-white font-semibold">55</b> shares
      <svg
        width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="ml-[1px]"
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
    </button>

    <!-- Popover -->
    <span
      class="absolute top-full left-1/2 -translate-x-1/2 pt-[11px] w-[240px] z-[9999]
             opacity-0 invisible translate-y-[-6px] pointer-events-none
             transition-[opacity,transform] duration-[170ms] ease-out
             group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:pointer-events-auto
             group-focus-within:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:pointer-events-auto"
    >
      <span class="relative w-[240px] bg-white border border-[#E6E8EB] rounded-[12px] shadow-[0_12px_32px_rgba(0,0,0,0.18)] flex flex-col overflow-hidden">
        <span aria-hidden="true" class="absolute top-[6px] left-1/2 w-[11px] h-[11px] bg-white border-l border-t border-[#E6E8EB] -translate-x-1/2 rotate-45 rounded-tl-[2px] pointer-events-none" />

        <button
          type="button"
          class="flex items-center gap-[12px] h-[48px] px-[16px] text-left whitespace-nowrap font-medium text-[14px] text-[#333] cursor-pointer transition-colors duration-[130ms] hover:bg-[#EFF4FA] border-none bg-transparent"
          @click="copyLink"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="block shrink-0 basis-[20px]">
            <path d="M9 17H7A5 5 0 0 1 7 7h2" />
            <path d="M15 7h2a5 5 0 1 1 0 10h-2" />
            <path d="M8 12h8" />
          </svg>Copy Link
        </button>

        <a
          class="flex items-center gap-[12px] h-[48px] px-[16px] text-left whitespace-nowrap no-underline font-medium text-[14px] text-[#333] cursor-pointer transition-colors duration-[130ms] hover:bg-[#EFF4FA] border-t border-[#EDEFF2]"
          href="https://www.facebook.com/sharer/sharer.php?u=https://www.houzeo.com/best-places-to-live/florida"
          target="_blank" rel="noopener noreferrer"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" class="block shrink-0 basis-[20px]">
            <path fill="#1877F2" d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 3.874 23.1 9.101 24v-8.437H6.627v-3.49h2.474V9.412c0-4.03 1.848-5.9 5.858-5.9.401 0 .955.042 1.468.103.513.06.897.15 1.141.195v3.29a8.6 8.6 0 0 0-.653-.036c-.243-.007-.487-.01-.733-.01-.707 0-1.259.097-1.675.31a1.69 1.69 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.835h3.919l-.386 2.075-.287 1.415h-3.246V24C20.126 23.1 24 18.1 24 12.073Z" />
          </svg>Share on Facebook
        </a>

        <a
          class="flex items-center gap-[12px] h-[48px] px-[16px] text-left whitespace-nowrap no-underline font-medium text-[14px] text-[#333] cursor-pointer transition-colors duration-[130ms] hover:bg-[#EFF4FA] border-t border-[#EDEFF2]"
          href="https://twitter.com/intent/tweet?url=https://www.houzeo.com/best-places-to-live/florida"
          target="_blank" rel="noopener noreferrer"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" class="block shrink-0 basis-[20px]">
            <path fill="#101010" d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
          </svg>Share on X
        </a>

        <a
          class="flex items-center gap-[12px] h-[48px] px-[16px] text-left whitespace-nowrap no-underline font-medium text-[14px] text-[#333] cursor-pointer transition-colors duration-[130ms] hover:bg-[#EFF4FA] border-t border-[#EDEFF2]"
          href="https://www.linkedin.com/sharing/share-offsite/?url=https://www.houzeo.com/best-places-to-live/florida"
          target="_blank" rel="noopener noreferrer"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" class="block shrink-0 basis-[20px]">
            <path fill="#0A66C2" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433a2.063 2.063 0 1 1 0-4.126 2.063 2.063 0 0 1 0 4.126Zm1.782 13.019H3.555V9h3.564v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0Z" />
          </svg>Share on LinkedIn
        </a>

        <a
          class="flex items-center gap-[12px] h-[48px] px-[16px] text-left whitespace-nowrap no-underline font-medium text-[14px] text-[#333] cursor-pointer transition-colors duration-[130ms] hover:bg-[#EFF4FA] border-t border-[#EDEFF2]"
          href="https://api.whatsapp.com/send?text=https://www.houzeo.com/best-places-to-live/florida"
          target="_blank" rel="noopener noreferrer"
        >
          <svg width="20" height="20" viewBox="0 0 32 32" fill="none" aria-hidden="true" class="block shrink-0 basis-[20px] overflow-visible">
            <path fill="#25D366" fill-rule="evenodd" clip-rule="evenodd" d="M16.003 0h-.008C7.174 0 .001 7.176.001 16c0 3.5 1.128 6.744 3.046 9.377L1.053 31.32l6.15-1.966A15.87 15.87 0 0 0 16.003 32C24.827 32 32 24.822 32 16S24.827 0 16.003 0Zm9.313 22.594c-.386 1.09-1.918 1.994-3.14 2.258-.836.178-1.928.32-5.603-1.204-4.7-1.947-7.727-6.72-7.963-7.032-.235-.311-1.904-2.53-1.904-4.826 0-2.295 1.166-3.422 1.636-3.902.386-.394.102-.622 1.176-.622.347 0 .522.002.68.01.47.02.706.048.982.708.386.83 1.29 3.052 1.397 3.28.112.228.223.537.068.836-.145.31-.273.448-.501.71-.229.263-.446.464-.674.746-.209.245-.445.508-.181.963.264.446 1.168 1.912 2.497 3.094 1.715 1.527 3.106 2.014 3.608 2.223.374.155.82.118 1.094-.173.347-.374.777-.996 1.214-1.608.31-.44.702-.489 1.113-.334.418.146 3.075 1.46 3.53 1.687.456.229.757.337.868.53.108.191.108 1.097-.278 2.186Z" />
          </svg>Share on Whatsapp
        </a>
      </span>
    </span>

    <!-- Copied toast -->
    <span
      role="status"
      class="absolute top-[calc(100%+14px)] left-1/2 -translate-x-1/2 z-[10000] whitespace-nowrap
             bg-[#202020] text-white font-medium text-[12px] px-[12px] py-[7px] rounded-[8px]
             pointer-events-none transition-[opacity,transform] duration-150 ease-out"
      :class="copied ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[4px]'"
    >Copied!</span>
  </span>
</template>

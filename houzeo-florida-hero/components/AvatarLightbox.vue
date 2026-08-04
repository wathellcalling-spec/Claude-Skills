<script setup>
import { onMounted, onBeforeUnmount } from 'vue'

// Full-size avatar lightbox. State is shared via useLightbox so any bio card
// can open it; a single instance lives at the app root.
const { isOpen, src, close } = useLightbox()

const onKeydown = (e) => { if (e.key === 'Escape') close() }
onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <div
    data-lightbox
    :aria-hidden="isOpen ? 'false' : 'true'"
    class="fixed inset-0 z-[2147483600] flex items-center justify-center p-[5vw] bg-[rgba(9,15,25,0.82)] backdrop-blur-[3px]
           cursor-pointer transition-[opacity,visibility] duration-200 ease-out"
    :class="isOpen ? 'opacity-100 visible pointer-events-auto' : 'opacity-0 invisible pointer-events-none'"
    @click="close"
  >
    <img
      :src="src" alt=""
      class="max-w-[min(720px,94vw)] max-h-[92vh] w-auto h-auto rounded-[16px] shadow-[0_24px_70px_rgba(0,0,0,0.5)]
             transition-transform duration-[220ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
      :class="isOpen ? 'scale-100' : 'scale-[0.96]'"
      @click.stop
    >
    <button
      type="button" aria-label="Close"
      class="absolute top-[22px] right-[26px] w-[40px] h-[40px] rounded-full border-none bg-[rgba(255,255,255,0.14)] text-white text-[20px] leading-none cursor-pointer flex items-center justify-center"
      @click.stop="close"
    >✕</button>
  </div>
</template>

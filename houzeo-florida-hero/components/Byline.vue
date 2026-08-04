<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

// Byline pill: author / editor (with hover-tap bio popovers) + reviewer label.
// Reveal-on-scroll (delay 2) is applied to the container.
const { el, shown } = useReveal()

// Compact display: first name whole, following names initialled, 15ch ellipsis.
const compact = (full) => {
  const parts = full.trim().split(/\s+/)
  if (parts.length <= 1) return full
  return parts[0] + ' ' + parts.slice(1).map((p) => p[0].toUpperCase() + '.').join(' ')
}

// One bio card open at a time, with a 150ms grace period on leave.
const openKey = ref(null)
// Pointer type: on hover devices we open on hover; on touch we toggle on tap.
const coarse = ref(false)
let timer = null
const cancel = () => {
  if (timer) { clearTimeout(timer); timer = null }
}
const open = (key) => { cancel(); openKey.value = key }
const scheduleClose = () => {
  cancel()
  timer = setTimeout(() => { openKey.value = null; timer = null }, 150)
}
const toggle = (key) => { openKey.value === key ? (openKey.value = null) : open(key) }

// Hover handlers apply only on pointer devices; tap toggles on touch devices.
const onEnter = (key) => { if (!coarse.value) open(key) }
const onLeave = () => { if (!coarse.value) scheduleClose() }
const onClick = (key) => { if (coarse.value) toggle(key) }
// Focus opens only on hover devices (keyboard); on touch, tap handles it so
// focus must not fight the click toggle.
const onFocus = (key) => { if (!coarse.value) open(key) }
const onBlur = () => { if (!coarse.value) scheduleClose() }

const onKeydown = (e) => { if (e.key === 'Escape') openKey.value = null }
const onDocClick = (e) => {
  if (!e.target.closest('[data-bio-wrap]') && !e.target.closest('[data-lightbox]')) {
    openKey.value = null
  }
}
onMounted(() => {
  coarse.value = window.matchMedia('(hover:none),(pointer:coarse)').matches
  document.addEventListener('keydown', onKeydown)
  document.addEventListener('click', onDocClick)
})
onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown)
  document.removeEventListener('click', onDocClick)
})
</script>

<template>
  <div
    ref="el"
    class="inline-flex items-center flex-wrap gap-x-[10px] gap-y-[7px] max-w-full min-w-0 text-[12px] font-normal leading-[1.4]
           text-[rgba(255,255,255,0.55)] flex-none self-start bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.12)]
           rounded-full py-[7px] pr-[18px] pl-[8px] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] whitespace-nowrap overflow-visible
           transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] delay-[180ms]
           max-[767px]:order-4 max-[767px]:flex max-[767px]:flex-wrap max-[767px]:justify-start max-[767px]:items-center
           max-[767px]:whitespace-normal max-[767px]:gap-x-[10px] max-[767px]:gap-y-[8px] max-[767px]:w-auto max-[767px]:max-w-full
           max-[767px]:leading-[1.5] max-[767px]:rounded-[20px] max-[767px]:p-[8px_14px_8px_8px]"
    :class="shown ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[26px]'"
  >
    <template v-for="(person, i) in CONTRIBUTORS" :key="person.name">
      <span
        v-if="i > 0" aria-hidden="true"
        class="w-[1px] h-[14px] bg-[rgba(255,255,255,0.16)] max-[767px]:hidden"
      />

      <!-- Author / Editor: avatar + name that opens a bio card -->
      <span
        v-if="person.card"
        class="inline-flex items-center gap-[8px] whitespace-nowrap max-[767px]:whitespace-normal max-[767px]:max-w-full"
      >
        <img
          :src="person.avatar" alt="" aria-hidden="true"
          class="w-[20px] h-[20px] rounded-full object-cover object-[center_22%] shrink-0 border border-[rgba(255,255,255,0.22)] max-[767px]:w-[18px] max-[767px]:h-[18px]"
        >
        {{ person.role }}:
        <span
          data-bio-wrap
          class="relative inline-flex z-[40]"
          @mouseenter="onEnter(person.name)"
          @mouseleave="onLeave"
        >
          <span
            tabindex="0" role="button" :title="person.name"
            class="inline-block max-w-[15ch] overflow-hidden text-ellipsis whitespace-nowrap align-bottom text-[rgba(255,255,255,0.74)] font-medium cursor-pointer"
            @click="onClick(person.name)"
            @focus="onFocus(person.name)"
            @blur="onBlur"
            @keydown.enter.prevent="toggle(person.name)"
            @keydown.space.prevent="toggle(person.name)"
          >{{ compact(person.name) }}</span>
          <BioCard :person="person" :open="openKey === person.name" />
        </span>
      </span>

      <!-- Reviewer: label only -->
      <span
        v-else
        class="inline-flex items-center gap-[8px] whitespace-nowrap max-[767px]:whitespace-normal max-[767px]:max-w-full"
      >
        <span
          aria-hidden="true"
          class="w-[20px] h-[20px] rounded-full shrink-0 border border-[rgba(255,255,255,0.22)] bg-[rgba(255,255,255,0.10)] inline-flex items-center justify-center text-[9px] font-semibold text-[rgba(255,255,255,0.6)]"
        >{{ person.name.charAt(0) }}</span>
        {{ person.role }}:
        <span
          :title="person.name"
          class="inline-block max-w-[15ch] overflow-hidden text-ellipsis whitespace-nowrap align-bottom text-[rgba(255,255,255,0.74)] font-medium"
        >{{ compact(person.name) }}</span>
      </span>
    </template>
  </div>
</template>

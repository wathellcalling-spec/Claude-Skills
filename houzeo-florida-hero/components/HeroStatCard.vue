<script setup>
// A single hero stat card: gradient icon, count-up figure and label.
const props = defineProps({
  stat: { type: Object, required: true }
})

const { el, display } = useCountUp(props.stat.value, { prefix: props.stat.prefix })
</script>

<template>
  <div
    class="group/stat relative isolate flex items-center gap-[16px] rounded-[16px] p-[16px] min-h-[80px] box-border
           bg-[rgba(10,24,40,0.86)] backdrop-blur-[8px] border border-[rgba(255,255,255,0.14)]
           shadow-[0_10px_24px_-10px_rgba(0,0,0,0.55),0_2px_6px_-2px_rgba(0,0,0,0.45)]
           transition-[transform,box-shadow,background-color,border-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]
           hover:-translate-y-[8px] hover:bg-[rgba(16,37,61,0.93)] hover:border-[#2F80ED]
           hover:shadow-[0_28px_56px_-20px_rgba(0,0,0,0.62),0_10px_22px_-12px_rgba(11,90,165,0.55),0_2px_5px_-2px_rgba(0,0,0,0.4)]
           after:content-[''] after:absolute after:left-[12%] after:right-[12%] after:bottom-[-16px] after:h-[34px] after:rounded-full
           after:[background:radial-gradient(closest-side,rgba(47,128,237,0.5),rgba(47,128,237,0)_76%)] after:blur-[12px]
           after:opacity-0 after:transition-opacity after:duration-300 after:pointer-events-none after:-z-[1] hover:after:opacity-100
           max-[767px]:gap-[8px] max-[767px]:p-[7px_9px] max-[767px]:min-h-0 max-[767px]:rounded-[12px] max-[767px]:backdrop-blur-none"
  >
    <span
      class="relative w-[44px] h-[44px] rounded-full flex items-center justify-center shrink-0
             [background:linear-gradient(160deg,#3B82F6,#2563EB)] border border-[rgba(255,255,255,0.26)]
             shadow-[inset_0_1px_0_rgba(255,255,255,0.34),inset_0_-6px_12px_-6px_rgba(0,0,0,0.4),0_6px_14px_-6px_rgba(37,99,235,0.65)]
             transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/stat:scale-[1.06]
             max-[767px]:w-[28px] max-[767px]:h-[28px]"
    >
      <svg
        viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="1.7"
        stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"
        class="block w-[22px] h-[22px] overflow-visible [vector-effect:non-scaling-stroke] max-[767px]:w-[20px] max-[767px]:h-[20px]"
      >
        <template v-if="stat.icon === 'home'">
          <path d="M3.4 10.3 12 3.4l8.6 6.9" />
          <path d="M5.2 9.6V19a1.8 1.8 0 0 0 1.8 1.8h10a1.8 1.8 0 0 0 1.8-1.8V9.6" />
          <path d="M12 9.6v8.8" />
          <path d="M14 11.6a2.2 2.2 0 0 0-2-1.1 1.7 1.7 0 0 0 0 3.4 1.7 1.7 0 0 1 0 3.4 2.2 2.2 0 0 1-2-1.1" />
        </template>
        <template v-else-if="stat.icon === 'shield'">
          <path d="M12 21.2c4.1-1.8 7-4.9 7-9.3V5.8L12 3.2 5 5.8v6.1c0 4.4 2.9 7.5 7 9.3Z" />
          <path d="m8.7 11.9 2.4 2.4 4.2-4.4" />
        </template>
        <template v-else-if="stat.icon === 'rent'">
          <circle cx="15.6" cy="8.4" r="4.4" />
          <path d="M12.5 11.5 3.6 20.4" />
          <path d="m6.6 17.4 2.4 2.4" />
        </template>
        <template v-else-if="stat.icon === 'list'">
          <path d="M12.6 20.8V5.4a1.6 1.6 0 0 0-1.6-1.6H5a1.6 1.6 0 0 0-1.6 1.6v15.4" />
          <path d="M12.6 10.8h6a1.6 1.6 0 0 1 1.6 1.6v8.4" />
          <path d="M2.4 20.8h19.2" />
          <path d="M6.8 8.2h2.8" />
          <path d="M6.8 12.6h2.8" />
          <path d="M6.8 17h2.8" />
          <path d="M15.6 15h2" />
        </template>
      </svg>
    </span>
    <span>
      <span
        ref="el"
        class="block text-[20px] font-semibold tracking-[-0.4px] text-white leading-[1.2]
               transition-[transform,opacity] duration-300 group-hover/stat:-translate-y-[2px]
               max-[767px]:text-[16px] max-[767px]:tracking-[-0.2px]"
      >{{ display }}</span>
      <span
        class="block text-[12px] text-white opacity-[0.85] transition-opacity duration-300 group-hover/stat:opacity-100
               max-[767px]:text-[10px] max-[767px]:leading-[1.3]"
      >{{ stat.label }}</span>
    </span>
  </div>
</template>

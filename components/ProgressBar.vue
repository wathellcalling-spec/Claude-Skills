<script setup>
/* Progress bar (% complete) */
defineProps({
  pct: { type: Number, default: 0 },
  label: { type: String, default: "Complete Your Offer" },
});
</script>

<template>
  <div class="row" style="align-items: center; gap: 18px; flex: 1">
    <div class="col grow" style="gap: 8px">
      <span style="font-weight: 800; font-size: 14.5px; color: var(--navy)">{{ label }}</span>
      <div style="height: 8px; border-radius: 6px; background: #e3e8f0; overflow: hidden">
        <div
          :style="{
            height: '100%',
            width: `${pct}%`,
            background: 'linear-gradient(90deg, #1dbb5a, #16a34a)',
            borderRadius: '6px',
            transition: 'width .45s cubic-bezier(.4,0,.1,1)',
          }"
        />
      </div>
    </div>
    <div class="col" style="align-items: flex-end; line-height: 1; min-width: 58px">
      <span style="font-weight: 800; font-size: 22px; color: var(--navy)">{{ pct }}%</span>
      <span style="font-size: 9.5px; font-weight: 800; letter-spacing: 1px; color: var(--muted)"
        >COMPLETE</span
      >
    </div>
  </div>
</template>

<script setup>
defineProps({
  pct: { type: Number, default: 0 },
  onClose: Function,
  first: Boolean,
});
</script>

<template>
  <div
    style="
      flex-shrink: 0;
      padding: 16px 22px 14px;
      border-bottom: 1px solid var(--line-soft);
      position: relative;
    "
  >
    <div class="col" style="gap: 2px; margin-bottom: 12px">
      <span style="font-weight: 800; font-size: 20px; color: var(--navy); letter-spacing: -0.2px">Submit an Offer</span>
      <span v-if="first" style="font-size: 13px; color: var(--muted); font-weight: 500"
        >Submit your offer in a few easy steps</span
      >
    </div>
    <ProgressBar :pct="pct" />
  </div>
</template>

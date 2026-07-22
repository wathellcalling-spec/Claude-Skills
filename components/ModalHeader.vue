<script setup>
/* Header with title + sub */
defineProps({
  title: String,
  sub: String,
  center: Boolean,
  chip: Boolean,
});
</script>

<template>
  <div
    :style="{
      flexShrink: 0,
      padding: '18px 22px 14px',
      borderBottom: chip ? 'none' : '1px solid var(--line-soft)',
      textAlign: center ? 'center' : 'left',
    }"
  >
    <div style="font-weight: 800; font-size: 20px; color: var(--navy); letter-spacing: -0.2px">
      {{ title }}
    </div>
    <div
      v-if="sub"
      style="font-size: 13.5px; color: var(--muted); margin-top: 3px; font-weight: 500"
    >
      {{ sub }}
    </div>
  </div>
</template>

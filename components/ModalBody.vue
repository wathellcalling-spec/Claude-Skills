<script setup>
/* Scrollable body */
defineProps({
  bg: { type: String, default: "var(--canvas)" },
  pad: { type: String, default: "20px 22px" },
});
</script>

<template>
  <div
    :style="{
      flex: 1,
      overflowY: 'auto',
      background: bg,
      padding: pad,
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      minHeight: 0,
    }"
  >
    <slot />
  </div>
</template>

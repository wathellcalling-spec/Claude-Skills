<script setup>
defineProps({ size: { type: Number, default: 52 }, border: { type: Number, default: 4 } });
</script>

<template>
  <div
    :style="{
      width: size + 'px',
      height: size + 'px',
      borderRadius: '50%',
      flexShrink: 0,
      border: `${border}px solid #e0e7f0`,
      borderTopColor: 'var(--accent)',
      animation: 'spin .8s linear infinite',
    }"
  />
</template>

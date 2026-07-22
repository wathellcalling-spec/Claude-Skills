<script setup>
/* "G" monogram placeholder */
defineProps({ size: { type: Number, default: 18 } });
</script>

<template>
  <span
    :style="{
      width: size + 'px',
      height: size + 'px',
      borderRadius: '50%',
      flexShrink: 0,
      background: '#fff',
      border: '1px solid #e4e7ec',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 800,
      fontSize: size * 0.72 + 'px',
      lineHeight: 1,
      color: '#4285F4',
      fontFamily: 'Arial, sans-serif',
    }"
    >G</span
  >
</template>

<script setup>
/* Houzeo logo */
defineProps({ size: { type: Number, default: 26 } });
</script>

<template>
  <img
    src="/assets/houzeo-logo.svg"
    alt="Houzeo"
    :style="{ height: size + 4 + 'px', width: 'auto', display: 'inline-block' }"
  />
</template>

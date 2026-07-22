<script setup>
/* Inline modal-card frame (no overlay) for matrix snapshots */
defineProps({ height: [Number, String] });
</script>

<template>
  <div
    :style="{
      background: '#fff',
      borderRadius: 'var(--r-lg)',
      boxShadow: 'var(--sh-pop)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      border: '1px solid var(--line-soft)',
      height: height ? height + 'px' : undefined,
      position: 'relative',
    }"
  >
    <slot />
  </div>
</template>

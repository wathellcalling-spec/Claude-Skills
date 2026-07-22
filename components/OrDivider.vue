<script setup>
/* Divider with centered label */
defineProps({ label: { type: String, default: "or" } });
</script>

<template>
  <div style="display: flex; align-items: center; gap: 12px">
    <span style="flex: 1; height: 1px; background: var(--line-soft)" />
    <span style="font-size: 11.5px; font-weight: 700; color: var(--muted-2)">{{ label }}</span>
    <span style="flex: 1; height: 1px; background: var(--line-soft)" />
  </div>
</template>

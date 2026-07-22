<script setup>
defineProps({ icon: String, label: String });
</script>

<template>
  <div class="row" style="align-items: center; gap: 11px">
    <Icon :name="icon" :size="22" color="var(--ink-2)" :stroke="1.6" />
    <span style="font-size: 14px; font-weight: 600; color: var(--ink-2)">{{ label }}</span>
  </div>
</template>

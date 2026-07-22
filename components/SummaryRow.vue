<script setup>
defineProps({ label: String, value: [String, Number] });
</script>

<template>
  <div
    style="
      display: flex;
      justify-content: space-between;
      gap: 16px;
      padding: 9px 0;
      border-bottom: 1px solid var(--line-soft);
    "
  >
    <span style="font-size: 12.5px; color: var(--muted); font-weight: 600">{{ label }}</span>
    <span style="font-size: 13px; color: var(--navy); font-weight: 700; text-align: right">{{ value }}</span>
  </div>
</template>

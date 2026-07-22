<script setup>
defineProps({ icon: String, value: [String, Number], unit: String });
</script>

<template>
  <div class="row" style="align-items: center; gap: 8px">
    <Icon :name="icon" :size="22" color="var(--muted)" :stroke="1.7" />
    <span style="font-weight: 800; font-size: 17px; color: var(--navy)">
      {{ value }}
      <span style="font-weight: 600; font-size: 13.5px; color: var(--muted)">{{ unit }}</span>
    </span>
  </div>
</template>

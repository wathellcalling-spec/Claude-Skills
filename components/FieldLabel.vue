<script setup>
defineProps({ hint: String });
</script>

<template>
  <div class="row" style="justify-content: space-between; align-items: baseline">
    <span style="font-size: 13px; font-weight: 800; color: var(--navy); padding: 0px; margin: 0px">
      <slot />
    </span>
    <span v-if="hint" style="font-size: 11.5px; color: var(--muted); font-weight: 600">{{ hint }}</span>
  </div>
</template>

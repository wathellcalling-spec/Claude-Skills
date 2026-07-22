<script setup>
defineProps({ dir: String, disabled: Boolean });
defineEmits(["click"]);
</script>

<template>
  <button
    :disabled="disabled"
    :style="{
      width: '32px',
      flexShrink: 0,
      border: '1.5px solid var(--line)',
      borderRadius: 'var(--r-sm)',
      background: '#fff',
      color: disabled ? 'var(--field-line)' : 'var(--ink-2)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: disabled ? 'default' : 'pointer',
      opacity: disabled ? 0.55 : 1,
    }"
    @click="$emit('click')"
  >
    <Icon :name="dir === 'L' ? 'chevL' : 'chevR'" :size="17" :stroke="2.4" />
  </button>
</template>

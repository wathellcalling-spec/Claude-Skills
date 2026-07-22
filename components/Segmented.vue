<script setup>
/* Segmented control (modern outlined pills) */
const props = defineProps({
  options: { type: Array, required: true },
  value: { type: [String, Number, null], default: null },
  columns: Number,
});
const emit = defineEmits(["change"]);

const cols = computed(() => props.columns || props.options.length);
</script>

<template>
  <div
    class="segmented"
    :style="{
      display: 'grid',
      gridTemplateColumns: `repeat(${cols}, 1fr)`,
      gap: '8px',
      padding: '0px 0px 4px',
      margin: '2px 0px 0px',
    }"
  >
    <button
      v-for="o in options"
      :key="o.value"
      :class="'seg-cell' + (o.value === value ? ' on' : '')"
      style="font-size: 16px; padding: 8px; margin: 0px"
      @click="emit('change', o.value)"
    >
      <span v-if="o.sub" class="seg-sub">{{ o.sub }}</span>
      <span class="seg-label">{{ o.label }}</span>
    </button>
  </div>
</template>

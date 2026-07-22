<script setup>
/* Simple select styled like a field */
defineProps({ label: String, value: String, options: { type: Array, default: () => [] } });
const emit = defineEmits(["change"]);
</script>

<template>
  <div class="fl filled" style="position: relative">
    <select
      :value="value || ''"
      style="
        width: 100%;
        height: var(--field-h);
        border: 1.5px solid var(--field-line);
        border-radius: var(--r-sm);
        background: #fff;
        padding: 16px 36px 0 13px;
        font-size: 15px;
        font-weight: 600;
        appearance: none;
        outline: none;
        cursor: pointer;
      "
      :style="{ color: value ? 'var(--ink)' : 'var(--muted-2)' }"
      @change="emit('change', $event.target.value)"
    >
      <option value="" disabled>Select…</option>
      <option v-for="o in options" :key="o" :value="o">{{ o }}</option>
    </select>
    <label
      style="
        top: 0;
        transform: translateY(-50%);
        font-size: 11.5px;
        font-weight: 700;
        color: var(--navy);
        letter-spacing: 0.2px;
      "
      >{{ label }}</label
    >
    <span
      style="
        position: absolute;
        right: 12px;
        top: 50%;
        transform: translateY(-50%);
        pointer-events: none;
        color: var(--muted);
      "
    >
      <Icon name="chevD" :size="16" :stroke="2.2" />
    </span>
  </div>
</template>

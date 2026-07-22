<script setup>
/* Compact inline Yes/No segmented (for dense forms) */
const props = defineProps({
  label: String,
  value: [String, null],
  fieldAlign: Boolean,
  error: [String, Boolean],
});
const emit = defineEmits(["change"]);
const OPTS = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];
</script>

<template>
  <!-- Field-style variant -->
  <div v-if="fieldAlign" class="col" style="gap: 0">
    <div
      :class="'fl filled' + (error ? ' error' : '')"
      style="position: relative; margin: -14px 0px 0px"
    >
      <div
        :style="{
          height: 'var(--field-h)',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '4px',
          padding: '5px',
          background: '#eef2f8',
          border: `1.5px solid ${error ? 'var(--error-line)' : 'var(--field-line)'}`,
          boxShadow: error ? '0 0 0 3.5px rgba(217,45,32,.10)' : 'none',
          borderRadius: 'var(--r-sm)',
          margin: '14px 0px 0px',
        }"
      >
        <button
          v-for="o in OPTS"
          :key="o.value"
          :style="{
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            background: o.value === value ? '#fff' : 'transparent',
            boxShadow: o.value === value ? '0 1px 3px rgba(11,28,58,.16)' : 'none',
            color: o.value === value ? 'var(--navy)' : 'var(--muted)',
            fontWeight: o.value === value ? 800 : 600,
            fontSize: '13.5px',
            transition: 'all .16s ease',
          }"
          @click="emit('change', o.value)"
        >
          {{ o.label }}
        </button>
      </div>
      <label
        :style="{
          top: 0,
          transform: 'translateY(-50%)',
          background: '#fff',
          fontSize: '11.5px',
          fontWeight: 700,
          color: error ? 'var(--error)' : 'var(--navy)',
          letterSpacing: '.2px',
        }"
        >{{ label }}</label
      >
    </div>
    <div v-if="error" class="fl-msg">
      <Icon name="alert" :size="13" :stroke="2.2" /> {{ error }}
    </div>
  </div>

  <!-- Default variant -->
  <div v-else class="col grow" style="gap: 8px">
    <FieldLabel>{{ label }}</FieldLabel>
    <Segmented :options="OPTS" :value="value" @change="emit('change', $event)" />
  </div>
</template>

<script setup>
/* Selectable choice card (radio top-right) */
const props = defineProps({
  icon: String,
  title: String,
  desc: String,
  selected: Boolean,
  accent: { type: String, default: "var(--accent)" },
  error: [String, Boolean],
  compact: Boolean,
});
const emit = defineEmits(["click"]);

const cardStyle = computed(() => ({
  position: "relative",
  textAlign: "left",
  background: props.selected ? "#f3f8ff" : "#fff",
  border: `1.5px solid ${
    props.error ? "var(--error-line)" : props.selected ? props.accent : "var(--line)"
  }`,
  borderRadius: "var(--r-md)",
  boxShadow: props.selected ? `0 0 0 3px ${props.accent}22` : "var(--sh-card)",
  padding: props.compact ? "14px 16px" : "18px 18px",
  display: "flex",
  flexDirection: props.compact ? "row" : "column",
  alignItems: props.compact ? "center" : "flex-start",
  gap: props.compact ? "13px" : "12px",
  transition: "border-color .15s, box-shadow .15s, background .15s",
  width: "100%",
}));
</script>

<template>
  <button class="choice-card" :style="cardStyle" @click="emit('click')">
    <span
      :style="{
        position: 'absolute',
        top: '14px',
        right: '14px',
        width: '19px',
        height: '19px',
        borderRadius: '50%',
        border: `2px solid ${selected ? accent : 'var(--field-line)'}`,
        background: selected ? accent : '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all .15s',
      }"
    >
      <Icon v-if="selected" name="check" :size="11" :stroke="3" color="#fff" />
    </span>
    <span
      v-if="icon"
      :style="{
        width: compact ? '38px' : '44px',
        height: compact ? '38px' : '44px',
        flexShrink: 0,
        borderRadius: '9px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: selected ? accent : '#eef2f8',
        color: selected ? '#fff' : 'var(--ink-2)',
        transition: 'all .15s',
      }"
    >
      <Icon :name="icon" :size="compact ? 20 : 22" :stroke="1.9" />
    </span>
    <span class="col" :style="{ gap: '2px', paddingRight: compact ? '22px' : '0' }">
      <span style="font-weight: 800; font-size: 15px; color: var(--navy)">{{ title }}</span>
      <span
        v-if="desc"
        style="font-size: 12.5px; color: var(--muted); font-weight: 500; line-height: 1.4"
        >{{ desc }}</span
      >
    </span>
  </button>
</template>

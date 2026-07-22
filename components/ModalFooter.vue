<script setup>
/* Footer with Back + primary action */
const props = defineProps({
  onBack: Function,
  primary: String,
  onPrimary: Function,
  primaryDisabled: Boolean,
  primaryIcon: { type: String, default: "arrowR" },
  green: Boolean,
  busy: Boolean,
  align: { type: String, default: "between" },
});
</script>

<template>
  <div
    :style="{
      flexShrink: 0,
      padding: '14px 22px 16px',
      borderTop: '1px solid var(--line-soft)',
      background: 'var(--surface)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: align === 'between' ? 'space-between' : 'flex-end',
      gap: '12px',
    }"
  >
    <template v-if="align === 'between'">
      <button v-if="onBack" class="btn-ghost" @click="onBack">
        <Icon name="chevL" :size="16" :stroke="2.4" /> Back
      </button>
      <span v-else />
    </template>
    <slot />
    <button
      v-if="primary"
      :class="`btn-primary${green ? ' btn-green' : ''}`"
      :disabled="primaryDisabled || busy"
      style="min-width: 150px"
      @click="onPrimary"
    >
      {{ busy ? "Please wait…" : primary }}
      <Icon v-if="!busy && primaryIcon" :name="primaryIcon" :size="17" :stroke="2.4" />
    </button>
  </div>
</template>

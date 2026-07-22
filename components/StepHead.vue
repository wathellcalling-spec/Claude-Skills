<script setup>
/* Step heading inside a flow body */
defineProps({
  index: [Number, String],
  total: [Number, String],
  title: String,
  hint: String,
});
</script>

<template>
  <div class="col" style="gap: 5px">
    <span
      v-if="index != null"
      style="
        font-size: 11.5px;
        font-weight: 800;
        letter-spacing: 0.6px;
        color: var(--muted);
        text-transform: uppercase;
      "
    >
      Step {{ index }} of {{ total }}
    </span>
    <div
      style="
        font-weight: 800;
        font-size: 19px;
        color: var(--navy);
        letter-spacing: -0.3px;
        line-height: 1.2;
      "
    >
      <slot name="title">{{ title }}</slot>
    </div>
    <div
      v-if="hint"
      style="font-size: 13px; color: var(--muted); font-weight: 500; padding: 0px 0px 4px"
    >
      {{ hint }}
    </div>
  </div>
</template>

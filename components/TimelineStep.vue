<script setup>
/* Single-question timeline step (card grid, click-to-advance) */
defineProps({ value: String, error: [String, Boolean] });
const emit = defineEmits(["change"]);

const ICONS = { immediate: "bolt", "3 months": "clock", "6 months": "calendar", "over the years": "eye" };
const DESC = {
  immediate: "Ready to buy right away.",
  "3 months": "Looking to move soon.",
  "6 months": "Planning a few months out.",
  "over the years": "Exploring my options.",
};
</script>

<template>
  <div class="col" style="gap: 18px">
    <StepHead
      title="What's your buying timeline?"
      hint="This helps your agent prioritize the right homes for you."
    />
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px">
      <ChoiceCard
        v-for="o in TIMELINE_OPTS"
        :key="o.value"
        :icon="ICONS[o.value]"
        :title="o.label"
        :desc="DESC[o.value]"
        :selected="value === o.value"
        :error="error"
        @click="emit('change', o.value)"
      />
    </div>
    <div v-if="error" class="fl-msg">
      <Icon name="alert" :size="13" :stroke="2.2" /> {{ error }}
    </div>
  </div>
</template>

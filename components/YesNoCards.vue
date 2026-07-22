<script setup>
/* Big Yes/No choice step (cards) */
defineProps({
  title: String,
  hint: String,
  value: [String, null],
  yesText: String,
  noText: String,
  yesIcon: { type: String, default: "check" },
  noIcon: { type: String, default: "close" },
  error: [String, Boolean],
  step: [Number, String],
  total: [Number, String],
});
const emit = defineEmits(["change"]);
</script>

<template>
  <div class="col" style="gap: 18px">
    <StepHead :index="step" :total="total" :title="title" :hint="hint">
      <template v-if="$slots.title" #title><slot name="title" /></template>
    </StepHead>
    <div class="row" style="gap: 14px">
      <div class="grow">
        <ChoiceCard
          :icon="yesIcon"
          title="Yes"
          :desc="yesText"
          :selected="value === 'yes'"
          :error="error"
          @click="emit('change', 'yes')"
        />
      </div>
      <div class="grow">
        <ChoiceCard
          :icon="noIcon"
          title="No"
          :desc="noText"
          :selected="value === 'no'"
          :error="error"
          @click="emit('change', 'no')"
        />
      </div>
    </div>
    <div v-if="error" class="fl-msg">
      <Icon name="alert" :size="13" :stroke="2.2" /> {{ error }}
    </div>
  </div>
</template>

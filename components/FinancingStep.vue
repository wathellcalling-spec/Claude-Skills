<script setup>
/* Financing choice (All Cash / Mortgage) */
defineProps({ value: [String, null], step: [Number, String], total: [Number, String] });
const emit = defineEmits(["change"]);
</script>

<template>
  <div class="col" style="gap: 18px">
    <StepHead :index="step" :total="total" title="How will you finance this purchase?" />
    <div class="row" style="gap: 14px">
      <div class="grow">
        <ChoiceCard
          icon="cash"
          title="All Cash"
          desc="No mortgage — strongest, fastest close."
          :selected="value === 'cash'"
          @click="emit('change', 'cash')"
        />
      </div>
      <div class="grow">
        <ChoiceCard
          icon="bank"
          title="Mortgage"
          desc="Financing through a lender."
          :selected="value === 'mortgage'"
          @click="emit('change', 'mortgage')"
        />
      </div>
    </div>
  </div>
</template>

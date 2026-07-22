<script setup>
/* GPA: are you pre-approved? */
defineProps({ value: [String, null] });
const emit = defineEmits(["change"]);
</script>

<template>
  <div class="col" style="gap: 18px">
    <StepHead
      title="Are you already pre-approved?"
      hint="A pre-approval letter strengthens every offer you make."
    />
    <div class="row" style="gap: 14px">
      <div class="grow">
        <ChoiceCard
          icon="shield"
          title="Yes, I'm pre-approved"
          desc="I have a letter from a lender."
          :selected="value === 'yes'"
          @click="emit('change', 'yes')"
        />
      </div>
      <div class="grow">
        <ChoiceCard
          icon="doc"
          title="No, not yet"
          desc="Help me get pre-approved."
          :selected="value === 'no'"
          @click="emit('change', 'no')"
        />
      </div>
    </div>
  </div>
</template>

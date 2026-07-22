<script setup>
/* Three qualifying questions (timeline + agency + finance) */
defineProps({
  v: { type: Object, required: true },
  set: { type: Function, required: true },
  emptyMode: Boolean,
  hideInlineQ: Boolean,
  hideAgency: Boolean,
  hideFinance: Boolean,
});
const YESNO = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];
</script>

<template>
  <div class="qual-panel" style="width: 578px; max-width: 100%">
    <div class="qual-q">
      <FieldLabel>What's your buying timeline?</FieldLabel>
      <Segmented
        :options="TIMELINE_OPTS"
        :value="emptyMode ? null : v.timeline"
        @change="set('timeline', $event)"
      />
    </div>
    <template v-if="!hideInlineQ">
      <div v-if="!hideAgency" class="qual-row" style="gap: 39px; padding: 10px 0px 0px">
        <span class="qual-prompt"
          >Have you signed an <AgencyTerm>Exclusive Agreement</AgencyTerm> with an agent?</span
        >
        <div class="qual-ctl">
          <Segmented
            :columns="2"
            :options="YESNO"
            :value="emptyMode ? null : v.exclusiveAgency"
            @change="set('exclusiveAgency', $event)"
          />
        </div>
      </div>
      <div v-if="!hideFinance" class="qual-row" style="padding: 1px 0px 0px">
        <span class="qual-prompt">Are you pre-approved for a mortgage?</span>
        <div class="qual-ctl">
          <Segmented
            :columns="2"
            :options="YESNO"
            :value="emptyMode ? null : v.financeStatus"
            @change="set('financeStatus', $event)"
          />
        </div>
      </div>
    </template>
  </div>
</template>

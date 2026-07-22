<script setup>
/* GPA dense pre-approval form */
const props = defineProps({
  v: { type: Object, required: true },
  set: { type: Function, required: true },
  errors: { type: Object, default: () => ({}) },
  emptyMode: Boolean,
});
const g = (k) => (props.emptyMode ? "" : props.v[k]);
</script>

<template>
  <div class="col" style="gap: 16px">
    <StepHead
      title="Pre-approval details"
      hint="A few financials let our lending partner size your buying power. Soft check only — no score impact."
    />

    <FormSection title="Loan basics" icon="home">
      <div class="grid-2">
        <Field
          label="Target purchase price"
          :value="g('purchasePrice')"
          :error="errors.purchasePrice"
          @change="set('purchasePrice', $event)"
        />
        <Field
          label="Down payment"
          :value="g('downPayment')"
          :error="errors.downPayment"
          @change="set('downPayment', $event)"
        />
      </div>
      <div class="grid-2">
        <SelectField
          label="Loan type"
          :value="g('loanType')"
          :options="LOAN_TYPES"
          @change="set('loanType', $event)"
        />
        <SelectField
          label="Property use"
          :value="g('propertyUse')"
          :options="['Primary Residence', 'Second Home', 'Investment']"
          @change="set('propertyUse', $event)"
        />
      </div>
    </FormSection>

    <FormSection title="Income & employment" icon="briefcase">
      <div class="grid-2">
        <Field
          label="Gross annual income"
          :value="g('annualIncome')"
          :error="errors.annualIncome"
          @change="set('annualIncome', $event)"
        />
        <SelectField
          label="Employment status"
          :value="g('employment')"
          :options="EMPLOYMENT"
          @change="set('employment', $event)"
        />
      </div>
      <div class="grid-2">
        <Field
          label="Monthly debt payments"
          :value="g('monthlyDebts')"
          @change="set('monthlyDebts', $event)"
        />
        <Field
          label="Liquid assets / savings"
          :value="g('assets')"
          @change="set('assets', $event)"
        />
      </div>
    </FormSection>

    <FormSection title="Credit & co-borrower" icon="card">
      <div class="grid-2">
        <SelectField
          label="Estimated credit score"
          :value="g('creditBand')"
          :options="CREDIT_BANDS"
          @change="set('creditBand', $event)"
        />
        <YesNoInline
          label="Adding a co-borrower?"
          field-align
          :value="emptyMode ? null : v.coBorrower"
          :error="errors.coBorrower"
          @change="set('coBorrower', $event)"
        />
      </div>
    </FormSection>
  </div>
</template>

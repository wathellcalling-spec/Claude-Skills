<script setup>
/* GET PRE-APPROVAL — ask → (dense form) → contact */
const props = defineProps({ onClose: Function, onLaunch: Function });

const preApproved = ref(null);
const step = ref(0); // 0 ask, 1 form(if no), 2 contact
const v = reactive({ ...LEAD, ...GPA, coBorrower: null });
const set = (k, x) => (v[k] = x);
const errors = ref({});
const done = ref(false);
const submitting = ref(false);
const sub = useSubmit(() => (done.value = true));

const steps = computed(() =>
  preApproved.value === "no" ? ["ask", "form", "contact"] : ["ask", "contact"]
);
const key = computed(() => steps.value[step.value]);

const next = () => {
  const k = key.value;
  if (k === "ask") {
    if (!preApproved.value) { errors.value = { ask: "Please choose one" }; return; }
    errors.value = {}; step.value = 1; return;
  }
  if (k === "form") {
    const e = {};
    if (!req(v.purchasePrice)) e.purchasePrice = "Required";
    if (!req(v.downPayment)) e.downPayment = "Required";
    if (!req(v.annualIncome)) e.annualIncome = "Required";
    if (!req(v.coBorrower)) e.coBorrower = "Please choose one";
    errors.value = e;
    if (Object.keys(e).length) return;
    step.value++; return;
  }
  if (k === "contact") {
    const e = contactErrors(v);
    errors.value = e;
    if (Object.keys(e).length) return;
    submitting.value = true;
  }
};
const back = () => (step.value === 0 ? props.onClose() : step.value--);

const pickAsk = (val) => {
  preApproved.value = val;
  errors.value = {};
  setTimeout(() => (step.value = 1), 260);
};

const summary = computed(() =>
  preApproved.value === "no"
    ? [
        { label: "Target price", value: v.purchasePrice },
        { label: "Down payment", value: v.downPayment },
        { label: "Loan type", value: v.loanType },
        { label: "Credit band", value: v.creditBand },
      ]
    : [
        { label: "Status", value: "Already pre-approved" },
        { label: "Name", value: `${v.firstName} ${v.lastName}` },
      ]
);

const primaryLabel = computed(() =>
  key.value === "contact" ? "Submit for Pre-approval" : "Continue"
);
</script>

<template>
  <ModalShell v-if="submitting" :on-close="onClose" :width="640">
    <VerifyingJourney
      :v="v"
      flow="GPA"
      :on-launch="onLaunch"
      :on-done="() => { submitting = false; done = true; }"
    />
  </ModalShell>

  <ModalShell v-else-if="done" :on-close="onClose" :width="640">
    <SuccessScreen kind="GPA" :data="{ summary }" :on-close="onClose" />
  </ModalShell>

  <ModalShell v-else :on-close="onClose" :width="640">
    <div style="position: relative; display: flex; flex-direction: column; min-height: 0; flex: 1">
      <LoadingOverlay
        v-if="sub.busy.value"
        label="Submitting your pre-approval…"
        sub="Securely sending to our lending partner"
      />
      <ModalHeader
        title="Get Pre-approved"
        sub="Rates starting from 6.8% · Soft check, no score impact"
        center
      />
      <ModalBody>
        <ErrorBanner v-if="sub.error.value" :on-retry="next">{{ sub.error.value }}</ErrorBanner>
        <div :key="key" style="animation: step-in 0.25s ease">
          <PreApprovedAsk v-if="key === 'ask'" :value="preApproved" @change="pickAsk" />
          <GPAForm v-else-if="key === 'form'" :v="v" :set="set" :errors="errors" />
          <template v-else-if="key === 'contact'">
            <StepHead
              title="Almost done — your contact details"
              hint="So our lending partner can send your letter."
            />
            <ContactForm :v="v" :set="set" :errors="errors" hide-finance />
          </template>
        </div>
        <div v-if="key === 'ask' && errors.ask" class="fl-msg">
          <Icon name="alert" :size="13" :stroke="2.2" /> {{ errors.ask }}
        </div>
      </ModalBody>
      <ModalFooter
        :on-back="back"
        :primary="primaryLabel"
        :on-primary="next"
        :busy="sub.busy.value"
        primary-icon="arrowR"
      />
    </div>
  </ModalShell>
</template>

<script setup>
/* CONTACT AGENT — single dense screen (classic variant) */
const props = defineProps({ onClose: Function });

const v = reactive({ ...LEAD });
const set = (k, x) => (v[k] = x);
const errors = ref({});
const step = ref(0); // 0 = contact details, 1 = qualifying questions
const done = ref(false);
const sub = useSubmit(() => (done.value = true), { failFirst: false });

const next = () => {
  const e = contactErrors(v);
  if (!req(v.message)) e.message = "Tell the agent what you'd like to know";
  errors.value = e;
  if (Object.keys(e).length === 0) {
    errors.value = {};
    step.value = 1;
  }
};
const submit = () => sub.run();

const summary = computed(() => [
  { label: "Name", value: `${v.firstName} ${v.lastName}` },
  { label: "Contact", value: v.phone },
  { label: "Buying timeline", value: cap(v.timeline) },
  { label: "Has agent agreement", value: cap(v.exclusiveAgency) },
]);
</script>

<template>
  <ModalShell v-if="done" :on-close="onClose" :width="620">
    <SuccessScreen kind="CA" :data="{ summary }" :on-close="onClose" />
  </ModalShell>

  <ModalShell v-else :on-close="onClose" :width="620" accent-bar :bar-pct="((step + 1) / 2) * 100">
    <div style="position: relative; display: flex; flex-direction: column; min-height: 0; flex: 1">
      <LoadingOverlay
        v-if="sub.busy.value"
        label="Sending your enquiry…"
        sub="Connecting you with your local agent"
      />
      <ModalHeader
        title="Contact Agent"
        :sub="step === 0 ? 'Provide your details to get assistance' : 'A few quick questions about your search'"
        center
      />
      <ModalBody>
        <ErrorBanner v-if="sub.error.value" :on-retry="submit">{{ sub.error.value }}</ErrorBanner>
        <div :key="step" style="animation: step-in 0.25s ease">
          <ContactForm v-if="step === 0" :v="v" :set="set" :errors="errors" hide-qual />
          <QualQuestions v-else :v="v" :set="set" />
        </div>
      </ModalBody>
      <div
        style="
          flex-shrink: 0;
          padding: 14px 22px 16px;
          border-top: 1px solid var(--line-soft);
          background: #fff;
          display: flex;
          flex-direction: column;
          gap: 12px;
        "
      >
        <button
          v-if="step === 0"
          class="btn-primary"
          :disabled="sub.busy.value"
          style="width: 100%; padding: 15px"
          @click="next"
        >
          Continue <Icon name="arrowR" :size="17" :stroke="2.4" />
        </button>
        <div v-else class="row" style="gap: 10px">
          <button class="btn-ghost" :disabled="sub.busy.value" @click="step = 0">
            <Icon name="chevL" :size="16" :stroke="2.4" /> Back
          </button>
          <button class="btn-primary grow" :disabled="sub.busy.value" style="padding: 15px" @click="submit">
            <Icon name="send" :size="17" /> Send Enquiry
          </button>
        </div>
        <Consent verb="Send Enquiry" />
      </div>
    </div>
  </ModalShell>
</template>

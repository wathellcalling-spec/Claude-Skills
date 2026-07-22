<script setup>
/* SCHEDULE A SHOWING — calendar → agency → contact */
const props = defineProps({ onClose: Function, onLaunch: Function, google: Boolean });

const STEPS = ["calendar", "agency", "contact"];
const step = ref(0);
const v = reactive({
  ...LEAD,
  date: 0,
  dateObj: { day: "03", mon: "Jun", dow: "Wed" },
  time: "11:00 AM",
  exclusiveAgency: null,
});
const set = (k, x) => (v[k] = x);
const errors = ref({});
const done = ref(false);
const verifying = ref(false);
const submitting = ref(false);
const represented = ref(false);
const sub = useSubmit(() => (done.value = true));

const key = computed(() => STEPS[step.value]);
const barPct = computed(() => ((step.value + 1) / STEPS.length) * 100);

const next = () => {
  const k = key.value;
  if (k === "calendar") {
    if (v.time == null || v.date == null) { errors.value = { cal: "Pick a date and time" }; return; }
  }
  if (k === "agency") {
    if (!v.exclusiveAgency) { errors.value = { agency: "Please choose one" }; return; }
    if (v.exclusiveAgency === "yes") { represented.value = true; return; }
  }
  if (k === "contact") {
    const e = contactErrors(v);
    errors.value = e;
    if (Object.keys(e).length) return;
    if (v.exclusiveAgency === "yes") { represented.value = true; return; }
    verifying.value = true;
    return;
  }
  errors.value = {};
  step.value++;
};
const back = () => (step.value === 0 ? props.onClose() : step.value--);

const pickAgency = (val) => {
  set("exclusiveAgency", val);
  errors.value = {};
  setTimeout(() => {
    if (val === "yes") represented.value = true;
    else step.value++;
  }, 260);
};

const onDate = (d) => {
  set("date", d.key);
  set("dateObj", { day: d.day, mon: d.mon, dow: d.dow });
};

const primaryLabel = computed(() =>
  key.value === "agency" ? "Continue" : key.value === "contact" ? "Schedule Showing" : "Next"
);
</script>

<template>
  <ModalShell v-if="done" :on-close="onClose" :width="620">
    <SASSuccessPremium :v="v" :on-close="onClose" :on-launch="onLaunch" />
  </ModalShell>

  <ModalShell v-else-if="represented" :on-close="onClose" :width="620">
    <RepresentedDeadEnd flow="SAS" :on-close="onClose" />
  </ModalShell>

  <ModalShell v-else-if="submitting" :on-close="onClose" :width="620">
    <VerifyingJourney
      :v="v"
      flow="SAS"
      :on-launch="onLaunch"
      :on-done="() => { submitting = false; done = true; }"
    />
  </ModalShell>

  <ModalShell v-else-if="verifying" :on-close="onClose" :width="460">
    <VerifyScreen
      :phone="v.phone"
      :email="v.email"
      verb="Schedule Showing"
      :email-verified="v.googleVerified"
      @verified="verifying = false; submitting = true"
      @back="verifying = false"
    />
  </ModalShell>

  <ModalShell v-else :on-close="onClose" :width="620" accent-bar :bar-pct="barPct">
    <div style="position: relative; display: flex; flex-direction: column; min-height: 0; flex: 1">
      <LoadingOverlay
        v-if="sub.busy.value"
        label="Requesting your showing…"
        sub="Checking the seller's availability"
      />
      <ModalHeader title="Houzeo's 1-Minute Showing Request" />
      <ModalBody>
        <ErrorBanner v-if="sub.error.value" :on-retry="next">{{ sub.error.value }}</ErrorBanner>
        <div :key="key" style="animation: step-in 0.25s ease">
          <template v-if="key === 'calendar'">
            <StepHead :index="1" :total="3" title="Select a date & time for your showing" />
            <CalendarStep
              :date="v.date"
              :time="v.time"
              :error="errors.cal"
              :title="null"
              @date="onDate"
              @time="set('time', $event)"
            />
          </template>
          <YesNoCards
            v-else-if="key === 'agency'"
            :step="2"
            :total="3"
            :value="v.exclusiveAgency"
            yes-text="Yes, I'm represented by an agent."
            no-text="No, I haven't signed with an agent."
            yes-icon="doc"
            no-icon="user"
            :error="errors.agency"
            @change="pickAgency"
          >
            <template #title>Do you have a signed <AgencyTerm /> with an agent?</template>
          </YesNoCards>
          <template v-else-if="key === 'contact'">
            <StepHead :index="3" :total="3" title="Where should we send the confirmation?" />
            <ContactForm
              :v="v"
              :set="set"
              :errors="errors"
              hide-agency
              :google="google"
              :on-google="() => signInGoogle(set)"
            />
            <Consent verb="Schedule Showing" />
          </template>
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

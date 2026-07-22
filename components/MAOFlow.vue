<script setup>
/* MAKE AN OFFER — price → view → [calendar] → agency → finance → contact */
const props = defineProps({ onClose: Function, onLaunch: Function, google: Boolean });

const v = reactive({
  ...LEAD,
  price: PROPERTY.priceNum,
  viewed: null,
  exclusiveAgency: null,
  financing: null,
  date: 0,
  dateObj: { day: "03", mon: "Jun", dow: "Wed" },
  time: "11:00 AM",
});
const set = (k, x) => (v[k] = x);
const step = ref(0);
const errors = ref({});
const done = ref(false);
const verifying = ref(false);
const submitting = ref(false);
const represented = ref(false);
const sub = useSubmit(() => (done.value = true));

const steps = computed(() => {
  const base = ["price", "view"];
  if (v.viewed === "no") base.push("calendar");
  base.push("agency", "finance", "financeStatus", "contact");
  return base;
});
const key = computed(() => steps.value[step.value]);
const pct = computed(() => Math.round((step.value / (steps.value.length - 1)) * 100));

const AUTO_STEPS = ["view", "agency", "finance", "financeStatus"];

const next = () => {
  const k = key.value;
  if (k === "view" && !v.viewed) { errors.value = { view: "Please choose one" }; return; }
  if (k === "calendar" && v.time == null) { errors.value = { cal: "Pick a date and time" }; return; }
  if (k === "agency") {
    if (!v.exclusiveAgency) { errors.value = { agency: "Please choose one" }; return; }
    if (v.exclusiveAgency === "yes") { represented.value = true; return; }
  }
  if (k === "finance" && !v.financing) { errors.value = { fin: "Please choose one" }; return; }
  if (k === "financeStatus" && !v.financeStatus) { errors.value = { finStatus: "Please choose one" }; return; }
  if (k === "contact") {
    const e = contactErrors(v);
    errors.value = e;
    if (Object.keys(e).length) return;
    verifying.value = true;
    return;
  }
  errors.value = {};
  step.value = Math.min(step.value + 1, steps.value.length - 1);
};
const back = () => (step.value === 0 ? props.onClose() : (step.value = Math.max(0, step.value - 1)));
const skip = () => {
  errors.value = {};
  step.value = Math.min(step.value + 1, steps.value.length - 1);
};

const pick = (field, val, representedOnYes) => {
  set(field, val);
  errors.value = {};
  setTimeout(() => {
    if (representedOnYes && val === "yes") { represented.value = true; return; }
    step.value++;
  }, 260);
};

const onDate = (d) => {
  set("date", d.key);
  set("dateObj", { day: d.day, mon: d.mon, dow: d.dow });
};

const primaryLabel = computed(() =>
  AUTO_STEPS.includes(key.value)
    ? "Continue"
    : key.value === "contact"
    ? "Submit Offer"
    : key.value === "price"
    ? "Confirm Offer"
    : "Next"
);
</script>

<template>
  <ModalShell v-if="done" :on-close="onClose" :width="660">
    <MAOSuccessPremium :v="v" :on-close="onClose" :on-launch="onLaunch" />
  </ModalShell>

  <ModalShell v-else-if="represented" :on-close="onClose" :width="660">
    <RepresentedDeadEnd flow="MAO" :on-close="onClose" />
  </ModalShell>

  <ModalShell v-else-if="submitting" :on-close="onClose" :width="660">
    <VerifyingJourney
      :v="v"
      flow="MAO"
      :on-launch="onLaunch"
      :on-done="() => { submitting = false; done = true; }"
    />
  </ModalShell>

  <ModalShell v-else-if="verifying" :on-close="onClose" :width="460">
    <VerifyScreen
      :phone="v.phone"
      :email="v.email"
      verb="Submit Offer"
      :email-verified="v.googleVerified"
      @verified="verifying = false; submitting = true"
      @back="verifying = false"
    />
  </ModalShell>

  <ModalShell v-else :on-close="onClose" :width="660">
    <div style="position: relative; display: flex; flex-direction: column; min-height: 0; flex: 1">
      <LoadingOverlay
        v-if="sub.busy.value"
        label="Submitting your offer…"
        sub="Delivering securely to the listing team"
      />
      <OfferHeader :pct="pct" :on-close="onClose" :first="step === 0" />
      <ModalBody>
        <ErrorBanner v-if="sub.error.value" :on-retry="next">{{ sub.error.value }}</ErrorBanner>
        <div :key="key" style="animation: step-in 0.25s ease">
          <PriceStep
            v-if="key === 'price'"
            :value="v.price"
            :listing="PROPERTY.priceNum"
            @change="set('price', $event)"
          />
          <YesNoCards
            v-else-if="key === 'view'"
            title="Have you seen this property in person?"
            hint="If not, we'll help you book a tour first."
            :value="v.viewed"
            yes-text="Yes, I've toured it."
            no-text="Not yet — show me available times."
            yes-icon="check"
            no-icon="calendar"
            :error="errors.view"
            @change="pick('viewed', $event)"
          />
          <template v-else-if="key === 'calendar'">
            <StepHead
              title="Let's get you in to see it first"
              hint="A quick tour strengthens your offer. Pick a time below."
            />
            <CalendarStep
              :date="v.date"
              :time="v.time"
              :error="errors.cal"
              @date="onDate"
              @time="set('time', $event)"
            />
          </template>
          <YesNoCards
            v-else-if="key === 'agency'"
            :value="v.exclusiveAgency"
            yes-text="Yes, I'm represented."
            no-text="No, not yet."
            yes-icon="doc"
            no-icon="user"
            :error="errors.agency"
            @change="pick('exclusiveAgency', $event, true)"
          >
            <template #title>Have you signed an <AgencyTerm />?</template>
          </YesNoCards>
          <FinancingStep
            v-else-if="key === 'finance'"
            :value="v.financing"
            @change="pick('financing', $event)"
          />
          <YesNoCards
            v-else-if="key === 'financeStatus'"
            title="Are you pre-approved or financed?"
            hint="It helps the seller take your offer seriously."
            :value="v.financeStatus"
            yes-text="Yes, I'm pre-approved / funds ready."
            no-text="Not yet — I'd like help with financing."
            yes-icon="shield"
            no-icon="dollar"
            :error="errors.finStatus"
            @change="pick('financeStatus', $event)"
          />
          <template v-else-if="key === 'contact'">
            <StepHead
              title="Last step — your contact details"
              hint="So your agent can finalize the offer with you."
            />
            <ContactForm
              :v="v"
              :set="set"
              :errors="errors"
              hide-inline-q
              :google="google"
              :on-google="() => signInGoogle(set)"
            />
            <Consent verb="Submit Offer" />
          </template>
        </div>
      </ModalBody>
      <ModalFooter
        :on-back="back"
        :primary="primaryLabel"
        :on-primary="next"
        :busy="sub.busy.value"
        primary-icon="arrowR"
      >
        <button
          v-if="key === 'calendar'"
          class="btn-skip"
          style="margin: 0px -100px 0px 175px"
          @click="skip"
        >
          Skip for now <Icon name="arrowR" :size="14" :stroke="2.4" />
        </button>
      </ModalFooter>
    </div>
  </ModalShell>
</template>

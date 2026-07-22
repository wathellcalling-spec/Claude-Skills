<script setup>
/* CONTACT AGENT — premium high-conversion variant */
const props = defineProps({ onClose: Function, onLaunch: Function, google: Boolean });

const v = reactive({
  ...LEAD,
  viewed: null,
  date: 0,
  dateObj: { day: "03", mon: "Jun", dow: "Wed" },
  time: "11:00 AM",
});
const set = (k, x) => (v[k] = x);
const errors = ref({});
const step = ref(0);
const done = ref(false);
const verifying = ref(false);
const submitting = ref(false);
const represented = ref(false);
const sub = useSubmit(() => (done.value = true));

const firstName = "your local agent";

const steps = computed(() => {
  const base = ["contact", "timeline", "agency", "finance", "view"];
  if (v.viewed === "no") base.push("calendar");
  return base;
});
const key = computed(() => steps.value[step.value]);
const barPct = computed(() => ((step.value + 1) / steps.value.length) * 100);

const submit = () => {
  if (v.exclusiveAgency === "yes") {
    represented.value = true;
    return;
  }
  verifying.value = true;
};

const next = () => {
  const k = key.value;
  if (k === "contact") {
    const e = contactErrors(v);
    if (!req(v.message)) e.message = "Tell the agent what you'd like to know";
    errors.value = e;
    if (Object.keys(e).length > 0) return;
    errors.value = {};
    step.value = 1;
    return;
  }
  if (k === "timeline") {
    if (!v.timeline) { errors.value = { timeline: "Please choose one" }; return; }
    errors.value = {}; step.value++; return;
  }
  if (k === "agency") {
    if (!v.exclusiveAgency) { errors.value = { agency: "Please choose one" }; return; }
    if (v.exclusiveAgency === "yes") { represented.value = true; return; }
    errors.value = {}; step.value++; return;
  }
  if (k === "finance") {
    if (!v.financeStatus) { errors.value = { finance: "Please choose one" }; return; }
    errors.value = {}; step.value++; return;
  }
  if (k === "view") {
    if (!v.viewed) { errors.value = { view: "Please choose one" }; return; }
    if (v.viewed === "yes") { submit(); return; }
    errors.value = {}; step.value++; return;
  }
  if (k === "calendar") {
    submit();
  }
};

const pick = (field, val, representedOnYes) => {
  set(field, val);
  errors.value = {};
  setTimeout(() => {
    if (representedOnYes && val === "yes") { represented.value = true; return; }
    step.value++;
  }, 260);
};

const pickView = (val) => {
  set("viewed", val);
  errors.value = {};
  setTimeout(() => {
    if (val === "yes") submit();
    else step.value++;
  }, 260);
};

const back = () => (step.value === 0 ? props.onClose() : (step.value = Math.max(0, step.value - 1)));

const onDate = (d) => {
  set("date", d.key);
  set("dateObj", { day: d.day, mon: d.mon, dow: d.dow });
};
</script>

<template>
  <ModalShell v-if="done" :on-close="onClose" :width="620">
    <CASuccessPremium :v="v" :on-close="onClose" :on-launch="onLaunch" />
  </ModalShell>

  <ModalShell v-else-if="represented" :on-close="onClose" :width="620">
    <RepresentedDeadEnd flow="CA" :on-close="onClose" />
  </ModalShell>

  <ModalShell v-else-if="submitting" :on-close="onClose" :width="620">
    <VerifyingJourney
      :v="v"
      flow="CA"
      :on-launch="onLaunch"
      :on-done="() => { submitting = false; done = true; }"
    />
  </ModalShell>

  <ModalShell v-else-if="verifying" :on-close="onClose" :width="460">
    <VerifyScreen
      :phone="v.phone"
      :email="v.email"
      verb="Send Enquiry"
      :email-verified="v.googleVerified"
      @verified="verifying = false; submitting = true"
      @back="verifying = false"
    />
  </ModalShell>

  <ModalShell v-else :on-close="onClose" :width="620" accent-bar :bar-pct="barPct">
    <div style="position: relative; display: flex; flex-direction: column; min-height: 0; flex: 1">
      <LoadingOverlay
        v-if="sub.busy.value"
        label="Sending your enquiry…"
        sub="Connecting you with your local agent"
      />

      <!-- WHITE HEADER -->
      <div
        style="
          flex-shrink: 0;
          position: relative;
          padding: 16px 22px 14px;
          background: #fff;
          border-bottom: 1px solid var(--line-soft);
          text-align: center;
        "
      >
        <div style="font-size: 22px; font-weight: 800; letter-spacing: -0.3px; line-height: 1.2; color: var(--navy)">
          Contact Agent
        </div>
        <div style="font-size: 13.5px; color: var(--muted); font-weight: 500; margin-top: 5px">
          <template v-if="key === 'contact'"
            >Provide your details and local expert will personally walk you through {{ PROPERTY.address }}.</template
          >
          <template v-else-if="key === 'timeline' || key === 'agency' || key === 'finance'"
            >A few quick questions help your local agent tailor the right homes and next steps for you.</template
          >
          <template v-else-if="key === 'view'"
            >Let {{ firstName }} know if you've already toured {{ PROPERTY.address }}.</template
          >
          <template v-else>Pick a time and {{ firstName }} will arrange a tour of {{ PROPERTY.address }} for you.</template>
        </div>
      </div>

      <!-- BODY -->
      <ModalBody pad="16px 22px">
        <ErrorBanner v-if="sub.error.value" :on-retry="submit">{{ sub.error.value }}</ErrorBanner>

        <div :key="step" style="animation: step-in 0.25s ease">
          <ContactForm
            v-if="key === 'contact'"
            :v="v"
            :set="set"
            :errors="errors"
            hide-qual
            :google="google"
            :on-google="() => signInGoogle(set)"
          />
          <TimelineStep
            v-else-if="key === 'timeline'"
            :value="v.timeline"
            :error="errors.timeline"
            @change="pick('timeline', $event)"
          />
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
            <template #title>Have you signed an <AgencyTerm /> with an agent?</template>
          </YesNoCards>
          <YesNoCards
            v-else-if="key === 'finance'"
            title="Are you pre-approved for a mortgage?"
            hint="A pre-approval lets the agent move faster on your behalf."
            :value="v.financeStatus"
            yes-text="Yes, I'm pre-approved."
            no-text="Not yet — I'd like help with financing."
            yes-icon="shield"
            no-icon="dollar"
            :error="errors.finance"
            @change="pick('financeStatus', $event)"
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
            @change="pickView"
          />
          <template v-else-if="key === 'calendar'">
            <StepHead
              title="Let's get you in to see it first"
              hint="A quick tour helps you decide. Pick a time below."
            />
            <CalendarStep
              :date="v.date"
              :time="v.time"
              :error="errors.cal"
              @date="onDate"
              @time="set('time', $event)"
            />
          </template>
        </div>
      </ModalBody>

      <!-- FOOTER -->
      <div
        v-if="key === 'contact'"
        style="
          flex-shrink: 0;
          padding: 14px 22px 16px;
          border-top: 1px solid var(--line-soft);
          background: #fff;
          display: flex;
          flex-direction: column;
          gap: 9px;
        "
      >
        <button
          class="btn-primary cta-pulse-blue"
          :disabled="sub.busy.value"
          style="width: 100%; padding: 16px; font-size: 16px"
          @click="next"
        >
          Send Inquiry <Icon name="arrowR" :size="18" :stroke="2.4" />
        </button>
        <div
          class="row"
          style="align-items: center; justify-content: center; gap: 7px; color: var(--muted); font-size: 12px; font-weight: 700"
        >
          <Icon name="lock" :size="13" :stroke="2" /> Free · No obligation · Your details stay private
        </div>
        <Consent verb="Continue" />
      </div>

      <div
        v-else-if="key === 'timeline' || key === 'agency' || key === 'finance' || key === 'view'"
        style="
          flex-shrink: 0;
          padding: 14px 22px 16px;
          border-top: 1px solid var(--line-soft);
          background: #fff;
          display: flex;
          flex-direction: column;
          gap: 9px;
        "
      >
        <div class="row" style="align-items: center; justify-content: space-between; gap: 10px">
          <button
            class="btn-ghost"
            :disabled="sub.busy.value"
            style="padding: 8px 0px; border-style: solid; border-width: 0px"
            @click="back"
          >
            <Icon name="chevL" :size="16" :stroke="2.4" /> Back
          </button>
          <button class="btn-primary" :disabled="sub.busy.value" style="min-width: 150px" @click="next">
            Continue <Icon name="arrowR" :size="17" :stroke="2.4" />
          </button>
        </div>
      </div>

      <div
        v-else
        style="
          flex-shrink: 0;
          padding: 14px 22px 16px;
          border-top: 1px solid var(--line-soft);
          background: #fff;
          display: flex;
          flex-direction: column;
          gap: 9px;
        "
      >
        <div class="row" style="gap: 10px">
          <button class="btn-ghost" :disabled="sub.busy.value" @click="back">
            <Icon name="chevL" :size="16" :stroke="2.4" /> Back
          </button>
          <button
            class="btn-primary cta-pulse-blue grow"
            :disabled="sub.busy.value"
            style="padding: 16px; font-size: 16px"
            @click="submit"
          >
            <Icon name="send" :size="18" /> <span>Send Message to {{ firstName }}</span>
          </button>
        </div>
      </div>
    </div>
  </ModalShell>
</template>

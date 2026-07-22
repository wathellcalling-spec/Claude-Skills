<script setup>
/* 9-state visual matrix board */
const emit = defineEmits(["back"]);
const noop = () => {};
const noSet = () => {};

const sampleLead = {
  firstName: "John",
  lastName: "Smith",
  email: "john.smith@gmail.com",
  phone: "(302) 401-9224",
  message: "I'm very interested — please reach out about waterfront access and HOA amenities.",
  timeline: "3 months",
  exclusiveAgency: "no",
  financeStatus: "yes",
};

const maoSummary = [
  { label: "Offer price", value: "$3,150,000" },
  { label: "Seen in person", value: "Yes" },
  { label: "Financing", value: "Mortgage" },
  { label: "Has agent agreement", value: "No" },
];
</script>

<template>
  <div style="min-height: 100%; background: #eef1f6">
    <header
      style="
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 14px 26px;
        border-bottom: 1px solid var(--line);
        background: #fff;
        position: sticky;
        top: 0;
        z-index: 5;
      "
    >
      <button class="btn-ghost" @click="emit('back')">
        <Icon name="chevL" :size="17" :stroke="2.4" /> Back to listing
      </button>
      <div class="col" style="align-items: center; gap: 0">
        <span style="font-weight: 800; font-size: 16px; color: var(--navy)">Lead Flow — State Matrix</span>
        <span style="font-size: 12px; color: var(--muted); font-weight: 600"
          >9 canonical states across the modular flows</span
        >
      </div>
      <Logo :size="20" />
    </header>

    <div style="max-width: 1320px; margin: 0 auto; padding: 26px 26px 70px">
      <div
        style="
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
          gap: 30px 24px;
          align-items: start;
        "
      >
        <!-- 1 — Default / launch -->
        <MatrixTile n="1" title="Default — Launch state" desc="Make an Offer, step 1. Clean entry point.">
          <MatrixFrame>
            <OfferHeader :pct="0" first :on-close="noop" />
            <div style="background: var(--canvas); padding: 18px 20px">
              <PriceStep :value="PROPERTY.priceNum" :listing="PROPERTY.priceNum" @change="noop" />
            </div>
            <ModalFooter primary="Confirm Offer" :on-primary="noop" />
          </MatrixFrame>
        </MatrixTile>

        <!-- 2 — High-density full form -->
        <MatrixTile n="2" title="High-density data state" desc="Full Contact Agent form, all fields populated.">
          <MatrixFrame>
            <ModalHeader title="Contact Agent" sub="Provide your details to get assistance" center />
            <div style="background: var(--canvas); padding: 18px 20px">
              <ContactForm :v="sampleLead" :set="noSet" :errors="{}" />
            </div>
            <div style="padding: 14px 20px; border-top: 1px solid var(--line-soft)">
              <button class="btn-primary" style="width: 100%; padding: 14px">
                <Icon name="send" :size="16" /> Send Enquiry
              </button>
            </div>
          </MatrixFrame>
        </MatrixTile>

        <!-- 3 — Focused field -->
        <MatrixTile n="3" title="Focused field state" desc="Active input — accent ring + lifted floating label.">
          <MatrixFrame>
            <ModalHeader title="Where should we reach you?" />
            <div style="background: var(--canvas); padding: 20px; display: flex; flex-direction: column; gap: 14px">
              <div class="row">
                <div class="grow"><Field label="First Name" value="John" /></div>
                <div class="grow"><Field label="Last Name" value="Smith" /></div>
              </div>
              <Field label="Email" value="john.smith@gmail.com" force-focus />
              <Field label="Phone" value="(302) 401-9224" />
            </div>
          </MatrixFrame>
        </MatrixTile>

        <!-- 4 — Field-level validation error -->
        <MatrixTile n="4" title="Field-level validation error" desc="Inline error messaging on the offending field.">
          <MatrixFrame>
            <ModalHeader title="Where should we reach you?" />
            <div style="background: var(--canvas); padding: 20px; display: flex; flex-direction: column; gap: 14px">
              <div class="row">
                <div class="grow"><Field label="First Name" value="John" /></div>
                <div class="grow"><Field label="Last Name" value="" error="Required" /></div>
              </div>
              <Field label="Email" value="john.smith@gmail" error="Enter a valid email address" />
              <Field label="Phone" value="(302)" error="Enter a valid 10-digit number" />
            </div>
          </MatrixFrame>
        </MatrixTile>

        <!-- 5 — Modal-level error -->
        <MatrixTile n="5" title="Modal-level general error" desc="Server / connection failure with retry affordance.">
          <MatrixFrame>
            <ModalHeader title="Houzeo's 1-Minute Showing Request" />
            <div style="background: var(--canvas); padding: 18px 20px; display: flex; flex-direction: column; gap: 16px">
              <ErrorBanner :on-retry="noop"
                >We couldn't reach the listing server. Please check your connection and try again.</ErrorBanner
              >
              <YesNoCards
                value="no"
                yes-text="Yes, I'm represented."
                no-text="No, not yet."
                yes-icon="doc"
                no-icon="user"
                @change="noop"
              >
                <template #title>Have you signed an <AgencyTerm />?</template>
              </YesNoCards>
            </div>
            <ModalFooter :on-back="noop" primary="Next" :on-primary="noop" />
          </MatrixFrame>
        </MatrixTile>

        <!-- 6 — Loading overlay -->
        <MatrixTile n="6" title="Loading / processing overlay" desc="Blocking overlay during secure submission.">
          <MatrixFrame :height="420">
            <OfferHeader :pct="100" :on-close="noop" />
            <div style="background: var(--canvas); padding: 18px 20px; flex: 1">
              <FinancingStep value="mortgage" @change="noop" />
            </div>
            <ModalFooter :on-back="noop" primary="Submit Offer" :on-primary="noop" />
            <LoadingOverlay label="Submitting your offer…" sub="Delivering securely to the listing team" />
          </MatrixFrame>
        </MatrixTile>

        <!-- 7 — Success -->
        <MatrixTile
          n="7"
          title="Comprehensive success screen"
          desc="Confirmation, reference, summary, agent & next steps."
          :span="2"
        >
          <MatrixFrame :height="560">
            <OfferHeader :pct="100" />
            <SuccessScreen kind="MAO" :data="{ summary: maoSummary }" :on-close="noop" />
          </MatrixFrame>
        </MatrixTile>

        <!-- 8 — Empty / placeholder -->
        <MatrixTile n="8" title="Empty / placeholder input" desc="Pristine form — placeholders, no selections made.">
          <MatrixFrame>
            <ModalHeader title="Contact Agent" sub="Provide your details to get assistance" center />
            <div style="background: var(--canvas); padding: 18px 20px">
              <ContactForm :v="{}" :set="noSet" :errors="{}" empty-mode />
            </div>
          </MatrixFrame>
        </MatrixTile>

        <!-- 9 — Disabled primary -->
        <MatrixTile n="9" title="Disabled primary action" desc="Primary CTA blocked until requirements are met.">
          <MatrixFrame>
            <ModalHeader title="How will you finance this purchase?" />
            <div style="background: var(--canvas); padding: 18px 20px">
              <div class="row" style="gap: 14px">
                <div class="grow">
                  <ChoiceCard
                    icon="cash"
                    title="All Cash"
                    desc="No mortgage — strongest, fastest close."
                    :selected="false"
                  />
                </div>
                <div class="grow">
                  <ChoiceCard
                    icon="bank"
                    title="Mortgage"
                    desc="Financing through a lender."
                    :selected="false"
                  />
                </div>
              </div>
            </div>
            <ModalFooter :on-back="noop" primary="Submit Offer" primary-disabled :on-primary="noop" />
          </MatrixFrame>
        </MatrixTile>
      </div>
    </div>
  </div>
</template>

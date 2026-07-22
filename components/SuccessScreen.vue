<script setup>
/* Comprehensive success screen — shared by simple flows */
const props = defineProps({
  kind: String,
  data: { type: Object, default: () => ({}) },
  onClose: Function,
});

const ref_ = computed(
  () => "HZ-" + (props.kind || "LD").toUpperCase().slice(0, 3) + "-842190"
);

const cfg = computed(
  () =>
    ({
      CA: {
        title: "Enquiry sent",
        line: "Your message is on its way. Your assigned agent will reach out within 1 business hour.",
      },
      SAS: {
        title: "Showing requested",
        line: "Your private tour request has been sent. You'll get a confirmation once the seller's agent approves the time.",
      },
      GPA: {
        title: "Pre-approval started",
        line: "Your information has been securely sent to our lending partner. Expect your pre-approval letter shortly.",
      },
      MAO: {
        title: "Offer submitted",
        line: "Your offer has been delivered to the listing team. Your agent will guide you through the next steps.",
      },
    }[props.kind] || {})
);

const steps = computed(
  () =>
    ({
      CA: ["Agent reviews your enquiry", "You receive a call or text within 1 hour", "Tour & financing options discussed"],
      SAS: ["Seller's agent confirms availability", "You get a calendar invite + reminder", "Meet your agent at the property"],
      GPA: ["Lender verifies the details provided", "Soft credit check (no score impact)", "Pre-approval letter emailed to you"],
      MAO: ["Listing team reviews your offer", "Agent prepares the purchase contract", "Negotiation & acceptance"],
    }[props.kind] || [])
);
</script>

<template>
  <div style="flex: 1; display: flex; flex-direction: column; min-height: 0">
    <div style="flex: 1; overflow-y: auto; background: var(--canvas); min-height: 0">
      <div
        style="
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 26px 26px 22px;
          background: #fff;
          border-bottom: 1px solid var(--line-soft);
          text-align: center;
        "
      >
        <div
          style="
            width: 64px;
            height: 64px;
            border-radius: 50%;
            background: linear-gradient(135deg, #1dbb5a, #15803d);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 8px 22px rgba(21, 128, 61, 0.35);
            animation: check-pop 0.5s cubic-bezier(0.2, 0.9, 0.3, 1.3);
          "
        >
          <Icon name="check" :size="32" :stroke="3" color="#fff" />
        </div>
        <h2 style="margin: 16px 0 0; font-size: 24px; font-weight: 800; color: var(--navy); letter-spacing: -0.4px">
          {{ cfg.title }}
        </h2>
        <p
          style="
            margin: 8px 0 0;
            font-size: 14px;
            color: var(--muted);
            max-width: 420px;
            line-height: 1.5;
            font-weight: 500;
          "
        >
          {{ cfg.line }}
        </p>
        <div
          style="
            margin-top: 14px;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: #eef3fa;
            border: 1px solid var(--chip-line);
            border-radius: 999px;
            padding: 7px 14px;
          "
        >
          <span style="font-size: 11.5px; color: var(--muted); font-weight: 700">Reference</span>
          <span style="font-size: 13px; color: var(--navy); font-weight: 800; letter-spacing: 0.5px">{{ ref_ }}</span>
        </div>
      </div>

      <div style="padding: 18px 26px 18px; display: flex; flex-direction: column; gap: 16px">
        <!-- Booking highlight for showings -->
        <div
          v-if="kind === 'SAS' && data?.day"
          style="
            display: flex;
            align-items: center;
            gap: 14px;
            background: #fff;
            border: 1.5px solid var(--accent);
            border-radius: var(--r-md);
            padding: 16px;
            box-shadow: 0 0 0 3px rgba(31, 111, 214, 0.1);
          "
        >
          <div style="width: 54px; text-align: center; flex-shrink: 0">
            <div style="font-size: 10.5px; font-weight: 800; color: var(--accent); text-transform: uppercase; letter-spacing: 0.5px">{{ data.mon }}</div>
            <div style="font-size: 28px; font-weight: 800; color: var(--navy); line-height: 1">{{ data.day }}</div>
          </div>
          <div style="width: 1px; height: 40px; background: var(--line)" />
          <div class="col grow" style="gap: 3px">
            <span style="font-weight: 800; font-size: 15px; color: var(--navy)">{{ data.time }}</span>
            <span style="font-size: 12.5px; color: var(--muted); font-weight: 600">Tour in person · {{ PROPERTY.address }}</span>
          </div>
          <button class="btn-ghost" style="flex-shrink: 0; color: var(--accent)">
            <Icon name="calendar" :size="16" /> Add to calendar
          </button>
        </div>

        <!-- Summary of submitted data -->
        <div
          v-if="data?.summary && data.summary.length > 0"
          style="
            background: #fff;
            border: 1px solid var(--line);
            border-radius: var(--r-md);
            padding: 6px 16px 10px;
            box-shadow: var(--sh-card);
          "
        >
          <div
            style="
              font-size: 11.5px;
              font-weight: 800;
              letter-spacing: 0.5px;
              color: var(--muted);
              text-transform: uppercase;
              padding: 12px 0 4px;
            "
          >
            What you submitted
          </div>
          <SummaryRow v-for="s in data.summary" :key="s.label" :label="s.label" :value="s.value" />
        </div>

        <!-- Assigned agent -->
        <div class="col" style="gap: 8px">
          <span
            style="
              font-size: 11.5px;
              font-weight: 800;
              letter-spacing: 0.5px;
              color: var(--muted);
              text-transform: uppercase;
            "
            >Your assigned agent</span
          >
          <AgentCard show-call />
        </div>

        <!-- Next steps -->
        <div class="col" style="gap: 10px">
          <span
            style="
              font-size: 11.5px;
              font-weight: 800;
              letter-spacing: 0.5px;
              color: var(--muted);
              text-transform: uppercase;
            "
            >What happens next</span
          >
          <div class="col" style="gap: 0">
            <div
              v-for="(s, i) in steps"
              :key="i"
              :style="{
                display: 'flex',
                gap: '12px',
                alignItems: 'flex-start',
                paddingBottom: i < steps.length - 1 ? '14px' : '0',
                position: 'relative',
              }"
            >
              <div style="position: relative; display: flex; flex-direction: column; align-items: center">
                <span
                  :style="{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    flexShrink: 0,
                    background: i === 0 ? 'var(--green)' : '#fff',
                    border: `2px solid ${i === 0 ? 'var(--green)' : 'var(--field-line)'}`,
                    color: i === 0 ? '#fff' : 'var(--muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontWeight: 800,
                  }"
                >
                  <Icon v-if="i === 0" name="check" :size="12" :stroke="3" />
                  <template v-else>{{ i + 1 }}</template>
                </span>
                <span
                  v-if="i < steps.length - 1"
                  style="width: 2px; flex: 1; min-height: 16px; background: var(--line); position: absolute; top: 24px"
                />
              </div>
              <span style="font-size: 13.5px; color: var(--ink-2); font-weight: 600; padding-top: 2px">{{ s }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      style="
        flex-shrink: 0;
        padding: 14px 26px 16px;
        border-top: 1px solid var(--line-soft);
        background: #fff;
        display: flex;
        gap: 12px;
      "
    >
      <button class="btn-ghost" style="flex: 0 0 auto" @click="onClose">Back to listing</button>
      <button class="btn-primary grow" @click="onClose">Done</button>
    </div>
  </div>
</template>

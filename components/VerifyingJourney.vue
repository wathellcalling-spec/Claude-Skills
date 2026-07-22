<script setup>
/* Staged interstitial shown while the enquiry is verified & sent. */
const props = defineProps({
  v: { type: Object, required: true },
  flow: { type: String, default: "CA" },
  onLaunch: Function,
  onDone: Function,
});

const JOURNEY = {
  CA: {
    send: "Sending your enquiry…",
    sendSub: "Connecting you with your local agent",
    near: "Almost there…",
    nearSub: "Your agent is being notified",
    cards: () => [
      { icon: "calendar", color: "var(--blue)", title: "Schedule a Showing", sub: "Book your private tour", flow: "SAS" },
      { icon: "dollar", color: "var(--orange)", title: "Submit an Offer", sub: "Get your offer in fast", flow: "MAO" },
    ],
  },
  SAS: {
    send: "Requesting your showing…",
    sendSub: "Checking the seller's availability",
    near: "Almost there…",
    nearSub: "Locking in your tour slot",
    cards: () => [
      { icon: "dollar", color: "var(--orange)", title: "Submit an Offer", sub: "Be first with your offer", flow: "MAO" },
      { icon: "doc", color: "var(--purple)", title: "Get Pre-approved", sub: "Strengthen your position", flow: "GPA" },
    ],
  },
  GPA: {
    send: "Submitting your pre-approval…",
    sendSub: "Securely sending to our lending partner",
    near: "Almost there…",
    nearSub: "Your lending partner is being notified",
    cards: () => [
      { icon: "calendar", color: "var(--blue)", title: "Schedule a Showing", sub: "Tour homes you love", flow: "SAS" },
      { icon: "dollar", color: "var(--orange)", title: "Submit an Offer", sub: "Make your move", flow: "MAO" },
    ],
  },
  MAO: {
    send: "Submitting your offer…",
    sendSub: "Delivering securely to the listing team",
    near: "Almost there…",
    nearSub: "The listing team is being notified",
    cards: (v) =>
      v.financeStatus === "yes"
        ? []
        : [{ icon: "doc", color: "var(--purple)", title: "Get Pre-approved", sub: "Strengthen your offer", flow: "GPA" }],
  },
};

const cfg = computed(() => JOURNEY[props.flow] || JOURNEY.CA);
const cards = computed(() => (cfg.value.cards(props.v) || []).filter((c) => c.flow !== props.flow));
const phase = ref(0); // 0 spinner only · 1 keep moving · 2 get the app

let t1, t2, t3;
onMounted(() => {
  t1 = setTimeout(() => (phase.value = 1), 1500);
  t2 = setTimeout(() => (phase.value = 2), 7000);
  t3 = setTimeout(() => props.onDone && props.onDone(), 13000);
});
onBeforeUnmount(() => {
  clearTimeout(t1);
  clearTimeout(t2);
  clearTimeout(t3);
});

const label = computed(() =>
  phase.value === 0 ? "Verifying your details…" : phase.value === 1 ? cfg.value.send : cfg.value.near
);
const sub = computed(() =>
  phase.value === 0
    ? "Securing your spot with a verified profile"
    : phase.value === 1
    ? cfg.value.sendSub
    : cfg.value.nearSub
);
</script>

<template>
  <div
    style="
      position: relative;
      display: flex;
      flex-direction: column;
      min-height: 0;
      flex: 1;
      background: var(--canvas);
    "
  >
    <div style="flex: 1; overflow-y: auto; min-height: 0; display: flex; flex-direction: column">
      <!-- loading band — always present -->
      <div
        :style="{
          background: '#fff',
          borderBottom: phase === 0 ? 'none' : '1px solid var(--line-soft)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: phase === 0 ? '18px' : '12px',
          padding: phase === 0 ? '110px 26px' : '26px 26px 22px',
          flex: phase === 0 ? 1 : '0 0 auto',
          transition: 'padding .35s ease',
        }"
      >
        <SpinnerRing :size="phase === 0 ? 52 : 38" :border="4" />
        <div class="col" style="align-items: center; gap: 4px; text-align: center">
          <span :style="{ fontWeight: 800, fontSize: phase === 0 ? '16px' : '15px', color: 'var(--navy)' }">{{ label }}</span>
          <span style="font-size: 13px; color: var(--muted); font-weight: 500">{{ sub }}</span>
        </div>
      </div>

      <!-- phase 1 — while you wait, keep moving -->
      <div v-if="phase === 1 && cards.length > 0" class="reveal" style="padding: 20px 26px 26px">
        <div
          style="
            font-size: 11.5px;
            font-weight: 800;
            letter-spacing: 0.5px;
            color: var(--muted);
            text-transform: uppercase;
            margin-bottom: 11px;
          "
        >
          While you wait, keep moving
        </div>
        <div class="row" style="gap: 12px; flex-wrap: wrap">
          <NextActionCard
            v-for="c in cards"
            :key="c.title"
            :icon="c.icon"
            :color="c.color"
            :title="c.title"
            :sub="c.sub"
            @click="onLaunch && onLaunch(c.flow)"
          />
        </div>
      </div>

      <!-- phase 2 — download the app -->
      <div v-if="phase === 2" class="reveal" style="padding: 20px 26px 26px">
        <AppWidget :phone="v.phone" />
      </div>
    </div>
  </div>
</template>

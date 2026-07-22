<script setup>
/* Make an Offer success */
const props = defineProps({ v: Object, onClose: Function, onLaunch: Function });
const first = computed(() => (props.v.firstName || "there").split(" ")[0]);
const actions = computed(() => {
  const a = [];
  if (props.v.financeStatus !== "yes") {
    a.push({
      icon: "doc",
      color: "var(--purple)",
      title: "Get Pre-approved",
      sub: "Strengthen your offer · rates from 6.8%",
      onClick: () => props.onLaunch && props.onLaunch("GPA"),
    });
  }
  return a;
});
const booking = computed(() =>
  props.v.viewed === "no"
    ? { mon: props.v.dateObj?.mon, day: props.v.dateObj?.day, time: props.v.time }
    : null
);
</script>

<template>
  <PremiumSuccess
    :v="v"
    :on-close="onClose"
    status-label="Offer submitted"
    :headline="`${first}, your offer is on its way`"
    :booking="booking"
    actions-heading="Strengthen your offer"
    :actions="actions"
  >
    <template #message>
      Your offer of <b style="color: var(--navy)">{{ fmtMoney(v.price) }}</b> has been delivered to
      the listing team. Our concierge partners, <b style="color: var(--navy)">eXp Realty</b> and
      <b style="color: var(--navy)">Clever Real Estate</b>, will call you on
      <b style="color: var(--navy)">{{ v.phone }}</b> to finalize the next steps.
    </template>
  </PremiumSuccess>
</template>

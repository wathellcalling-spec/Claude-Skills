<script setup>
/* Schedule a Showing success */
const props = defineProps({ v: Object, onClose: Function, onLaunch: Function });
const first = computed(() => (props.v.firstName || "there").split(" ")[0]);
const booking = computed(() => ({
  mon: props.v.dateObj?.mon,
  day: props.v.dateObj?.day,
  time: props.v.time,
}));
const actions = computed(() => [
  { icon: "dollar", color: "var(--orange)", title: "Submit an Offer", sub: "Be first with your offer", onClick: () => props.onLaunch && props.onLaunch("MAO") },
  { icon: "doc", color: "var(--purple)", title: "Get Pre-approved", sub: "Strengthen your position", onClick: () => props.onLaunch && props.onLaunch("GPA") },
]);
</script>

<template>
  <PremiumSuccess
    :v="v"
    :on-close="onClose"
    status-label="Showing requested"
    :headline="`${first}, your private tour is requested`"
    :booking="booking"
    actions-heading="Love it? Make your move"
    :actions="actions"
  >
    <template #message>
      Your tour request is in. Our concierge partners, <b style="color: var(--navy)">eXp Realty</b>
      and <b style="color: var(--navy)">Clever Real Estate</b>, will call you on
      <b style="color: var(--navy)">{{ v.phone }}</b> to confirm your showing.
    </template>
  </PremiumSuccess>
</template>

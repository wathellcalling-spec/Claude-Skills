<script setup>
/* Contact Agent success */
const props = defineProps({ v: Object, onClose: Function, onLaunch: Function });
const first = computed(() => (props.v.firstName || "there").split(" ")[0]);
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
    status-label="Enquiry sent successfully"
    :headline="`${first}, you can expect a call in 90 seconds`"
    :booking="booking"
    :show-app="true"
  >
    <template #message>
      Our concierge partners, <b style="color: var(--navy)">eXp Realty</b> and
      <b style="color: var(--navy)">Clever Real Estate</b>, will call you on
      <b style="color: var(--navy)">{{ v.phone }}</b> to get you started on your home buying journey.
    </template>
  </PremiumSuccess>
</template>

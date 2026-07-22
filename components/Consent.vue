<script setup>
/* Consent fine print */
defineProps({ verb: { type: String, default: "Send Enquiry" } });
</script>

<template>
  <p style="font-size: 11px; line-height: 1.55; color: var(--muted); margin: 0; padding: 5px 0px 0px">
    By clicking “{{ verb }},” you are electronically signing and acknowledge that a Houzeo account will be
    created for you and that you agree to our <a href="#">Terms of Use</a>, <a href="#">Privacy Policy</a>,
    and <a href="#">Consent to Contact</a>. You provide express written consent for Houzeo and its
    affiliated professionals to contact you at the number provided, including by automated means. Consent
    is not a condition of purchase. Msg &amp; data rates may apply.
    <span
      style="
        display: inline-flex;
        align-items: center;
        gap: 4px;
        font-weight: 700;
        color: var(--ink-2);
        margin-top: 6px;
      "
    >
      <Icon name="lock" :size="12" :stroke="2" /> <a href="#">Encrypted by 256-bit SSL</a>
    </span>
  </p>
</template>

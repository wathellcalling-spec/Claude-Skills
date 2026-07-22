<script setup>
/* Partner logo row (Houzeo live; Clever / eXp partner slots) */
</script>

<template>
  <div
    style="
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 18px;
      padding-right: 30px;
    "
  >
    <span
      style="
        font-size: 11.5px;
        font-weight: 800;
        letter-spacing: 0.5px;
        color: var(--muted);
        text-transform: uppercase;
      "
      >Next step</span
    >
    <div style="display: flex; align-items: center; gap: 12px">
      <Logo :size="17" />
      <span style="width: 1px; height: 20px; background: var(--line)" />
      <img src="/assets/clever-logo.svg" alt="Clever Real Estate" style="height: 20px; width: auto; display: block" />
      <span style="width: 1px; height: 20px; background: var(--line)" />
      <img src="/assets/exp-logo.svg" alt="eXp Realty" style="height: 22px; width: auto; display: block" />
    </div>
  </div>
</template>

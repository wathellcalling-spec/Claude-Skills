<script setup>
/* "Continue with Google" button */
defineProps({ label: { type: String, default: "Continue with Google" } });
defineEmits(["click"]);
</script>

<template>
  <button
    style="
      width: 100%;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 11px;
      background: #fff;
      border: 1.5px solid var(--field-line);
      border-radius: var(--r-sm);
      font-weight: 700;
      font-size: 14.5px;
      color: var(--ink);
      box-shadow: 0 1px 2px rgba(16, 32, 64, 0.05);
      transition: background 0.15s, box-shadow 0.15s;
    "
    @click="$emit('click')"
    @mouseenter="(e) => (e.currentTarget.style.background = '#f7f9fc')"
    @mouseleave="(e) => (e.currentTarget.style.background = '#fff')"
  >
    <GMark :size="18" /> {{ label }}
  </button>
</template>

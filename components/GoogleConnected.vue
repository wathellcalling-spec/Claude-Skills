<script setup>
/* Connected-account chip shown once signed in with Google */
defineProps({ name: String, email: String });
</script>

<template>
  <div
    style="
      display: flex;
      align-items: center;
      gap: 12px;
      background: #f3f8ff;
      border: 1.5px solid #cfe1fb;
      border-radius: var(--r-md);
      padding: 11px 13px;
    "
  >
    <GMark :size="26" />
    <div class="col grow" style="gap: 1px; min-width: 0">
      <span style="font-weight: 800; font-size: 14px; color: var(--navy)">{{ name }}</span>
      <span
        style="
          font-size: 12.5px;
          color: var(--ink-2);
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        "
        >{{ email }}</span
      >
    </div>
    <span
      style="
        display: inline-flex;
        align-items: center;
        gap: 5px;
        flex-shrink: 0;
        background: #eafaf0;
        border: 1px solid #c2ecd1;
        border-radius: 999px;
        padding: 3px 9px;
        font-size: 11px;
        font-weight: 800;
        color: var(--green-ink);
      "
    >
      <Icon name="check" :size="11" :stroke="3" /> Email verified
    </span>
  </div>
</template>

<script setup>
defineProps({ title: String, icon: String });
</script>

<template>
  <div
    style="
      background: #fff;
      border: 1px solid var(--line);
      border-radius: var(--r-md);
      padding: 16px;
      box-shadow: var(--sh-card);
    "
  >
    <div class="row" style="align-items: center; gap: 8px; margin-bottom: 13px">
      <Icon :name="icon" :size="16" color="var(--accent)" />
      <span
        style="
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.4px;
          color: var(--navy);
          text-transform: uppercase;
        "
        >{{ title }}</span
      >
    </div>
    <div class="col" style="gap: 12px"><slot /></div>
  </div>
</template>

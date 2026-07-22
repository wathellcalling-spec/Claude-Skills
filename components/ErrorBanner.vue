<script setup>
/* Modal-level error banner */
defineProps({ onRetry: Function });
</script>

<template>
  <div
    style="
      display: flex;
      align-items: flex-start;
      gap: 11px;
      background: var(--error-bg);
      border: 1px solid var(--error-line);
      border-radius: var(--r-sm);
      padding: 12px 14px;
      color: #912018;
    "
  >
    <Icon
      name="alert"
      :size="18"
      :stroke="2"
      color="var(--error)"
      :style="{ flexShrink: 0, marginTop: '1px' }"
    />
    <div class="col grow" style="gap: 2px">
      <span style="font-weight: 800; font-size: 13.5px">Something went wrong</span>
      <span style="font-size: 12.5px; font-weight: 500; line-height: 1.45"><slot /></span>
    </div>
    <button
      v-if="onRetry"
      style="
        background: #fff;
        border: 1px solid var(--error-line);
        color: var(--error);
        font-weight: 800;
        font-size: 12.5px;
        border-radius: 6px;
        padding: 7px 12px;
        flex-shrink: 0;
      "
      @click="onRetry"
    >
      Retry
    </button>
  </div>
</template>

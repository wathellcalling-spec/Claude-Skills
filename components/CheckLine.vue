<script setup></script>

<template>
  <div style="display: flex; align-items: center; gap: 9px">
    <span
      style="
        width: 18px;
        height: 18px;
        border-radius: 50%;
        flex-shrink: 0;
        background: #eafaf0;
        border: 1px solid #c2ecd1;
        display: flex;
        align-items: center;
        justify-content: center;
      "
    >
      <Icon name="check" :size="11" :stroke="3" color="var(--green-ink)" />
    </span>
    <span style="font-size: 13.5px; color: var(--ink-2); font-weight: 600"><slot /></span>
  </div>
</template>

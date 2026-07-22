<script setup>
defineProps({ n: [Number, String], title: String, desc: String, span: [Number, String] });
</script>

<template>
  <div class="col" :style="{ gap: '11px', gridColumn: span ? `span ${span}` : 'auto' }">
    <div class="row" style="align-items: baseline; gap: 9px">
      <span
        style="
          width: 24px;
          height: 24px;
          border-radius: 7px;
          background: var(--navy);
          color: #fff;
          font-weight: 800;
          font-size: 12.5px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        "
        >{{ n }}</span
      >
      <div class="col" style="gap: 1px">
        <span style="font-weight: 800; font-size: 15px; color: var(--navy); letter-spacing: -0.2px">{{ title }}</span>
        <span style="font-size: 12px; color: var(--muted); font-weight: 500">{{ desc }}</span>
      </div>
    </div>
    <div style="pointer-events: none; user-select: none">
      <slot />
    </div>
  </div>
</template>

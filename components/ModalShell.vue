<script setup>
/* Modal shell used by all flows */
const props = defineProps({
  onClose: Function,
  width: { type: Number, default: 600 },
  accentBar: Boolean,
  accentColor: { type: String, default: "var(--accent)" },
  barPct: Number,
});

const onKey = (e) => {
  if (e.key === "Escape" && props.onClose) props.onClose();
};
onMounted(() => window.addEventListener("keydown", onKey));
onBeforeUnmount(() => window.removeEventListener("keydown", onKey));

const overlayDown = (e) => {
  if (e.target === e.currentTarget && props.onClose) props.onClose();
};
</script>

<template>
  <div
    class="modal-overlay"
    style="
      position: fixed;
      inset: 0;
      z-index: 60;
      background: rgba(20, 32, 52, 0.55);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      animation: overlay-in 0.18s ease;
    "
    @mousedown="overlayDown"
  >
    <div
      class="modal-positioner"
      :style="{
        position: 'relative',
        width: '100%',
        maxWidth: width + 'px',
        maxHeight: 'calc(100% - 16px)',
        display: 'flex',
      }"
    >
      <button v-if="onClose" aria-label="Close" class="modal-x" @click="onClose">
        <Icon name="close" :size="20" :stroke="2.4" />
      </button>
      <div
        class="modal-card"
        style="
          position: relative;
          width: 100%;
          max-height: 100%;
          background: var(--surface);
          border-radius: var(--r-xl);
          box-shadow: var(--sh-modal);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          animation: pop-in 0.26s cubic-bezier(0.2, 0.8, 0.25, 1);
        "
      >
        <div v-if="accentBar" style="height: 4px; background: #e3e8f0; flex-shrink: 0">
          <div
            :style="{
              height: '100%',
              width: `${barPct ?? 30}%`,
              background: accentColor,
              transition: 'width .4s ease',
            }"
          />
        </div>
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
/* Loading overlay */
defineProps({
  label: { type: String, default: "Submitting your request…" },
  sub: { type: String, default: "Securely sending to the listing team" },
});
</script>

<template>
  <div
    style="
      position: absolute;
      inset: 0;
      background: rgba(247, 249, 252, 0.92);
      backdrop-filter: blur(3px);
      z-index: 40;
      border-radius: inherit;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 18px;
      animation: overlay-in 0.2s ease;
    "
  >
    <div style="position: relative; width: 52px; height: 52px">
      <div
        style="
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 4px solid #e0e7f0;
          border-top-color: var(--accent);
          animation: spin 0.8s linear infinite;
        "
      />
    </div>
    <div class="col" style="align-items: center; gap: 4px">
      <span style="font-weight: 800; font-size: 16px; color: var(--navy)">{{ label }}</span>
      <span style="font-size: 13px; color: var(--muted)">{{ sub }}</span>
    </div>
  </div>
</template>

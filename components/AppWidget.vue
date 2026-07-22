<script setup>
/* App-download widget (text-me-the-link + QR) */
const props = defineProps({ phone: String });
const appPhone = ref(props.phone || "");
const sent = ref(false);
</script>

<template>
  <div
    style="
      background: #fff;
      border: 1px solid var(--line);
      border-radius: var(--r-lg);
      box-shadow: var(--sh-card);
      padding: 18px;
      display: flex;
      gap: 18px;
      align-items: center;
      flex-wrap: wrap;
    "
  >
    <div class="col grow" style="gap: 12px; min-width: 230px">
      <div>
        <div style="font-weight: 800; font-size: 16px; color: var(--navy)">Download the Houzeo Mobile App</div>
        <div style="font-size: 12.5px; color: var(--muted); font-weight: 600; margin-top: 2px">
          Track your enquiry &amp; tours on the go.
        </div>
      </div>
      <div
        v-if="sent"
        style="
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: var(--green-ink);
          font-weight: 800;
          font-size: 13.5px;
        "
      >
        <Icon name="check" :size="16" :stroke="2.6" /> Link sent to {{ appPhone }}
      </div>
      <div v-else style="display: flex; gap: 8px">
        <input
          v-model="appPhone"
          inputmode="tel"
          placeholder="(000) 000-0000"
          style="
            flex: 1;
            min-width: 0;
            height: 44px;
            border: 1.5px solid var(--field-line);
            border-radius: var(--r-sm);
            padding: 0 14px;
            font-size: 14.5px;
            font-weight: 600;
            color: var(--ink);
            outline: none;
          "
        />
        <button
          class="btn-primary"
          style="flex-shrink: 0; padding: 0 18px"
          @click="appPhone.trim() && (sent = true)"
        >
          Text Link
        </button>
      </div>
    </div>
    <div style="width: 1px; align-self: stretch; background: var(--line-soft)" />
    <div class="col" style="align-items: center; gap: 9px">
      <span style="font-size: 11.5px; font-weight: 700; color: var(--muted)">Scan to download</span>
      <QRBlock />
      <div class="row" style="gap: 6px">
        <StoreBadge store="apple" />
        <StoreBadge store="google" />
      </div>
    </div>
  </div>
</template>

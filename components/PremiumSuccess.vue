<script setup>
/* Premium success shell — shared by CA / SAS / MAO */
defineProps({
  v: { type: Object, required: true },
  statusLabel: String,
  headline: String,
  booking: { type: Object, default: null },
  actions: { type: Array, default: () => [] },
  actionsHeading: { type: String, default: "What's next?" },
  showApp: { type: Boolean, default: true },
  onClose: Function,
});
</script>

<template>
  <div style="position: relative; display: flex; flex-direction: column; min-height: 0; flex: 1">
    <div style="flex: 1; overflow-y: auto; background: var(--canvas); min-height: 0">
      <!-- confirmation + expectation -->
      <div style="background: #fff; border-bottom: 1px solid var(--line-soft); padding: 20px 26px 22px">
        <div class="reveal" style="animation-delay: 0.04s">
          <PartnerRow />
        </div>

        <div class="reveal" style="animation-delay: 0.12s">
          <span
            style="
              display: inline-flex;
              align-items: center;
              gap: 7px;
              background: #eafaf0;
              border: 1px solid #c2ecd1;
              border-radius: 999px;
              padding: 5px 12px;
              margin-bottom: 16px;
            "
          >
            <span
              style="
                width: 18px;
                height: 18px;
                border-radius: 50%;
                background: linear-gradient(135deg, #1dbb5a, #15803d);
                display: flex;
                align-items: center;
                justify-content: center;
                animation: check-pop 0.5s 0.2s both;
              "
            >
              <Icon name="check" :size="11" :stroke="3" color="#fff" />
            </span>
            <span style="font-size: 12px; font-weight: 800; color: var(--green-ink); letter-spacing: 0.2px">{{ statusLabel }}</span>
          </span>

          <h2
            style="
              margin: 0;
              font-size: 24px;
              font-weight: 800;
              color: var(--navy);
              letter-spacing: -0.4px;
              line-height: 1.2;
              text-wrap: pretty;
            "
          >
            {{ headline }}
          </h2>
          <p
            style="
              margin: 8px 0 0;
              font-size: 14px;
              color: var(--ink-2);
              font-weight: 500;
              line-height: 1.55;
              max-width: 480px;
            "
          >
            <slot name="message" />
          </p>
        </div>

        <div class="reveal" style="margin-top: 16px; animation-delay: 0.26s">
          <div
            style="
              font-size: 11.5px;
              font-weight: 800;
              letter-spacing: 0.5px;
              color: var(--muted);
              text-transform: uppercase;
              margin-bottom: 11px;
            "
          >
            Our partner agents are
          </div>
          <div class="col" style="gap: 9px">
            <CheckLine>Top local agents</CheckLine>
            <CheckLine>Expert negotiators</CheckLine>
            <CheckLine>Rated 4.5 stars or higher by hundreds of home buyers &amp; sellers</CheckLine>
          </div>
        </div>
      </div>

      <!-- booking detail (showing) -->
      <div v-if="booking" class="reveal" style="padding: 18px 26px 0; animation-delay: 0.38s">
        <div
          style="
            display: flex;
            align-items: center;
            gap: 14px;
            background: #fff;
            border: 1.5px solid var(--accent);
            border-radius: var(--r-md);
            padding: 16px;
            box-shadow: 0 0 0 3px rgba(31, 111, 214, 0.1);
          "
        >
          <div style="width: 54px; text-align: center; flex-shrink: 0">
            <div style="font-size: 10.5px; font-weight: 800; color: var(--accent); text-transform: uppercase; letter-spacing: 0.5px">{{ booking.mon }}</div>
            <div style="font-size: 28px; font-weight: 800; color: var(--navy); line-height: 1">{{ booking.day }}</div>
          </div>
          <div style="width: 1px; height: 40px; background: var(--line)" />
          <div class="col grow" style="gap: 3px; min-width: 0">
            <span style="font-weight: 800; font-size: 15px; color: var(--navy)">{{ booking.time }}</span>
            <span style="font-size: 12.5px; color: var(--muted); font-weight: 600">Tour in person · {{ PROPERTY.address }}</span>
          </div>
          <button class="btn-ghost" style="flex-shrink: 0; color: var(--accent)">
            <Icon name="calendar" :size="16" /> Add to calendar
          </button>
        </div>
      </div>

      <!-- next action -->
      <div v-if="actions && actions.length > 0" class="reveal" style="padding: 18px 26px 0; animation-delay: 0.48s">
        <div
          style="
            font-size: 11.5px;
            font-weight: 800;
            letter-spacing: 0.5px;
            color: var(--muted);
            text-transform: uppercase;
            margin-bottom: 11px;
          "
        >
          {{ actionsHeading }}
        </div>
        <div class="row" style="gap: 12px; flex-wrap: wrap">
          <NextActionCard
            v-for="a in actions"
            :key="a.title"
            :icon="a.icon"
            :color="a.color"
            :title="a.title"
            :sub="a.sub"
            @click="a.onClick && a.onClick()"
          />
        </div>
      </div>

      <!-- get the app -->
      <div v-if="showApp" style="padding: 18px 26px">
        <AppWidget :phone="v.phone" />
      </div>
    </div>

    <!-- footer -->
    <div
      class="reveal"
      style="
        flex-shrink: 0;
        padding: 14px 26px 16px;
        border-top: 1px solid var(--line-soft);
        background: #fff;
        display: flex;
        gap: 12px;
        animation-delay: 0.66s;
      "
    >
      <button class="btn-ghost" style="flex: 0 0 auto" @click="onClose">Back to listing</button>
      <button class="btn-primary grow" @click="onClose">Done</button>
    </div>
  </div>
</template>

<script setup>
/* Already-represented dead-end */
const props = defineProps({ flow: String, onClose: Function });

const agentEmail = ref("");
const sent = ref(false);
const copied = ref(false);
const ctx = computed(
  () =>
    ({
      CA: "speak with the listing agent",
      SAS: "book this private tour",
      MAO: "prepare and submit your offer",
    }[props.flow] || "help you with this home")
);
</script>

<template>
  <div style="position: relative; display: flex; flex-direction: column; min-height: 0; flex: 1">
    <div style="flex: 1; overflow-y: auto; background: var(--canvas); min-height: 0">
      <div
        style="
          background: #fff;
          border-bottom: 1px solid var(--line-soft);
          padding: 30px 26px 24px;
          text-align: center;
        "
      >
        <div
          style="
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: #eef3fa;
            border: 1px solid var(--chip-line);
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 16px;
          "
        >
          <Icon name="user" :size="28" :stroke="1.8" color="var(--blue)" />
        </div>
        <h2 style="margin: 0; font-size: 23px; font-weight: 800; color: var(--navy); letter-spacing: -0.3px">
          You're already represented
        </h2>
        <p
          style="
            margin: 9px auto 0;
            font-size: 14px;
            color: var(--ink-2);
            font-weight: 500;
            line-height: 1.55;
            max-width: 420px;
          "
        >
          Since you've signed a buyer agency agreement, your agent can {{ ctx }} for you. Share this
          listing with them and they'll take it from here.
        </p>
      </div>

      <div style="padding: 20px 26px 26px; display: flex; flex-direction: column; gap: 14px">
        <!-- property reminder -->
        <div
          style="
            display: flex;
            align-items: center;
            gap: 12px;
            background: var(--chip-bg);
            border: 1px solid var(--chip-line);
            border-radius: var(--r-md);
            padding: 9px 12px;
          "
        >
          <div
            style="
              position: relative;
              width: 52px;
              height: 44px;
              border-radius: 6px;
              overflow: hidden;
              flex-shrink: 0;
              background: #cdd6e2;
            "
          >
            <img :src="IMG.thumb" alt="" style="width: 100%; height: 100%; object-fit: cover" />
          </div>
          <div class="col grow" style="gap: 1px; min-width: 0">
            <span style="font-weight: 800; font-size: 14px; color: var(--navy)">{{ PROPERTY.address }}</span>
            <span style="font-size: 12px; color: var(--muted); font-weight: 600">{{ PROPERTY.city }}</span>
          </div>
          <span style="font-weight: 800; font-size: 15px; color: var(--navy); flex-shrink: 0">{{ PROPERTY.price }}</span>
        </div>

        <!-- share with agent -->
        <div
          style="
            background: #fff;
            border: 1px solid var(--line);
            border-radius: var(--r-lg);
            box-shadow: var(--sh-card);
            padding: 18px;
          "
        >
          <div style="font-weight: 800; font-size: 15px; color: var(--navy); margin-bottom: 3px">
            Share this listing with your agent
          </div>
          <div style="font-size: 12.5px; color: var(--muted); font-weight: 600; margin-bottom: 13px">
            We'll email them the full listing details and your interest.
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
            <Icon name="check" :size="16" :stroke="2.6" /> Listing sent to {{ agentEmail }}
          </div>
          <div v-else style="display: flex; gap: 8px">
            <input
              v-model="agentEmail"
              type="email"
              placeholder="Your agent's email"
              style="
                flex: 1;
                min-width: 0;
                height: 46px;
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
              @click="agentEmail.trim() && (sent = true)"
            >
              <Icon name="send" :size="16" /> Send
            </button>
          </div>
          <div style="display: flex; align-items: center; gap: 12px; margin: 14px 0">
            <span style="flex: 1; height: 1px; background: var(--line-soft)" />
            <span style="font-size: 11.5px; font-weight: 700; color: var(--muted-2)">or</span>
            <span style="flex: 1; height: 1px; background: var(--line-soft)" />
          </div>
          <button
            :style="{
              width: '100%',
              height: '46px',
              border: '1.5px solid var(--line)',
              background: copied ? '#eafaf0' : '#fff',
              borderRadius: 'var(--r-sm)',
              fontWeight: 800,
              fontSize: '14px',
              color: copied ? 'var(--green-ink)' : 'var(--navy)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }"
            @click="copied = true"
          >
            <Icon :name="copied ? 'check' : 'send'" :size="16" :stroke="2.2" />
            {{ copied ? "Listing link copied" : "Copy listing link" }}
          </button>
        </div>
      </div>
    </div>

    <div
      style="
        flex-shrink: 0;
        padding: 14px 26px 16px;
        border-top: 1px solid var(--line-soft);
        background: #fff;
      "
    >
      <button class="btn-primary grow" style="width: 100%" @click="onClose">Done</button>
    </div>
  </div>
</template>

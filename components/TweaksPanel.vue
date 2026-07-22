<script setup>
/* Floating tweaks panel — controls prototype variants (CA style, sign-in, accent). */
const props = defineProps({
  caStyle: String,
  auth: String,
  accent: String,
});
const emit = defineEmits(["update", "previewCA"]);

const open = ref(false);
const ACCENTS = ["#1f6fd6", "#0b2e63", "#16a34a", "#6d28d9"];

const isLight = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  return r * 299 + g * 587 + b * 114 > 148000;
};
</script>

<template>
  <div>
    <!-- toggle -->
    <button
      class="twk-fab"
      :aria-label="open ? 'Close tweaks' : 'Open tweaks'"
      @click="open = !open"
    >
      <Icon :name="open ? 'close' : 'sparkle'" :size="19" :stroke="2" />
    </button>

    <transition name="twk">
      <div v-if="open" class="twk-panel">
        <div class="twk-hd">
          <b>Tweaks</b>
          <button class="twk-x" aria-label="Close tweaks" @click="open = false">✕</button>
        </div>
        <div class="twk-body">
          <div class="twk-sect">Contact Agent pop-up</div>
          <div class="twk-row">
            <div class="twk-lbl"><span>Style</span></div>
            <div class="twk-seg">
              <button
                v-for="o in ['classic', 'premium']"
                :key="o"
                :class="{ on: caStyle === o }"
                @click="emit('update', 'caStyle', o)"
              >
                {{ o }}
              </button>
            </div>
          </div>
          <button class="twk-btn" @click="emit('previewCA')">Preview Contact Agent</button>

          <div class="twk-sect">Sign-in</div>
          <div class="twk-row">
            <div class="twk-lbl"><span>Identity</span></div>
            <div class="twk-seg">
              <button
                v-for="o in ['standard', 'google']"
                :key="o"
                :class="{ on: auth === o }"
                @click="emit('update', 'auth', o)"
              >
                {{ o }}
              </button>
            </div>
          </div>

          <div class="twk-sect">Theme</div>
          <div class="twk-row">
            <div class="twk-lbl"><span>Accent</span></div>
            <div class="twk-chips">
              <button
                v-for="c in ACCENTS"
                :key="c"
                class="twk-chip"
                :data-on="accent === c ? '1' : '0'"
                :style="{ background: c }"
                :aria-label="c"
                @click="emit('update', 'accent', c)"
              >
                <svg v-if="accent === c" viewBox="0 0 14 14" aria-hidden="true">
                  <path
                    d="M3 7.2 5.8 10 11 4.2"
                    fill="none"
                    stroke-width="2.2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    :stroke="isLight(c) ? 'rgba(0,0,0,.78)' : '#fff'"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.twk-fab {
  position: fixed;
  right: 18px;
  bottom: 18px;
  z-index: 2147483645;
  width: 46px;
  height: 46px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, #2f7fe0, #16407f);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(11, 28, 58, 0.32);
  transition: transform 0.12s ease, box-shadow 0.15s ease;
}
.twk-fab:hover {
  transform: translateY(-1px);
  box-shadow: 0 12px 30px rgba(11, 28, 58, 0.4);
}
.twk-fab:active {
  transform: scale(0.94);
}

.twk-panel {
  position: fixed;
  right: 18px;
  bottom: 74px;
  z-index: 2147483646;
  width: 264px;
  background: rgba(250, 251, 253, 0.82);
  color: #29261b;
  -webkit-backdrop-filter: blur(24px) saturate(160%);
  backdrop-filter: blur(24px) saturate(160%);
  border: 0.5px solid rgba(255, 255, 255, 0.6);
  border-radius: 14px;
  box-shadow: 0 1px 0 rgba(255, 255, 255, 0.5) inset, 0 16px 44px rgba(9, 22, 48, 0.24);
  font: 11.5px/1.4 var(--font);
  overflow: hidden;
}
.twk-hd {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 11px 10px 10px 14px;
}
.twk-hd b {
  font-size: 12.5px;
  font-weight: 700;
  color: var(--navy);
}
.twk-x {
  border: 0;
  background: transparent;
  color: rgba(41, 38, 27, 0.5);
  width: 22px;
  height: 22px;
  border-radius: 6px;
  font-size: 13px;
}
.twk-x:hover {
  background: rgba(0, 0, 0, 0.06);
  color: #29261b;
}
.twk-body {
  padding: 2px 14px 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.twk-sect {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: rgba(41, 38, 27, 0.45);
  padding: 8px 0 0;
}
.twk-row {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.twk-lbl > span {
  font-weight: 600;
  color: rgba(41, 38, 27, 0.72);
}
.twk-seg {
  display: flex;
  padding: 2px;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.06);
}
.twk-seg button {
  flex: 1;
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  font-weight: 500;
  min-height: 24px;
  border-radius: 6px;
  text-transform: capitalize;
}
.twk-seg button.on {
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.12);
  font-weight: 700;
  color: var(--navy);
}
.twk-btn {
  height: 28px;
  border: 0;
  border-radius: 7px;
  background: rgba(0, 0, 0, 0.78);
  color: #fff;
  font: inherit;
  font-weight: 600;
}
.twk-btn:hover {
  background: rgba(0, 0, 0, 0.88);
}
.twk-chips {
  display: flex;
  gap: 6px;
}
.twk-chip {
  position: relative;
  flex: 1;
  height: 34px;
  border: 0;
  border-radius: 6px;
  box-shadow: 0 0 0 0.5px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.06);
  transition: transform 0.12s ease;
}
.twk-chip:hover {
  transform: translateY(-1px);
}
.twk-chip[data-on="1"] {
  box-shadow: 0 0 0 1.5px rgba(0, 0, 0, 0.85), 0 2px 6px rgba(0, 0, 0, 0.15);
}
.twk-chip svg {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 14px;
  height: 14px;
  transform: translate(-50%, -50%);
}

.twk-enter-active,
.twk-leave-active {
  transition: opacity 0.16s ease, transform 0.16s ease;
}
.twk-enter-from,
.twk-leave-to {
  opacity: 0;
  transform: translateY(8px) scale(0.98);
}
</style>

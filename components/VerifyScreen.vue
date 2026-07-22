<script setup>
/* Inline phone verification (OTP) */
const props = defineProps({
  phone: String,
  email: String,
  verb: { type: String, default: "Continue" },
  busy: Boolean,
  emailVerified: Boolean,
});
const emit = defineEmits(["verified", "back", "close"]);

const code = ref(["", "", "", "", "", ""]);
const focusedIdx = ref(-1);
const error = ref(false);
const secs = ref(30);
const changeHover = ref(false);
const editing = ref(false);
const phoneVal = ref(props.phone);
const draft = ref(props.phone);
const refs = ref([]);
const setRef = (el, i) => {
  if (el) refs.value[i] = el;
};

let timer = null;
const tick = () => {
  if (secs.value <= 0) return;
  timer = setTimeout(() => {
    secs.value -= 1;
    tick();
  }, 1000);
};
onMounted(tick);
onBeforeUnmount(() => clearTimeout(timer));
watch(secs, (s) => {
  if (s === 30) {
    clearTimeout(timer);
    tick();
  }
});

const full = computed(() => code.value.every((d) => d !== ""));
const resendReady = computed(() => secs.value <= 0);
const timerStr = computed(() => `0:${String(Math.max(secs.value, 0)).padStart(2, "0")}`);

const setDigit = (i, val) => {
  const d = (val || "").replace(/\D/g, "");
  if (error.value) error.value = false;
  const nx = [...code.value];
  nx[i] = d === "" ? "" : d[d.length - 1];
  code.value = nx;
  if (d !== "" && i < 5 && refs.value[i + 1]) refs.value[i + 1].focus();
};
const onKey = (i, e) => {
  if (e.key === "Backspace" && code.value[i] === "" && i > 0 && refs.value[i - 1])
    refs.value[i - 1].focus();
};
const onPaste = (e) => {
  const t = (e.clipboardData.getData("text") || "").replace(/\D/g, "").slice(0, 6);
  if (!t) return;
  e.preventDefault();
  if (error.value) error.value = false;
  const nx = ["", "", "", "", "", ""];
  for (let j = 0; j < t.length; j++) nx[j] = t[j];
  code.value = nx;
  const last = Math.min(t.length, 6) - 1;
  if (refs.value[last]) refs.value[last].focus();
};

const submit = () => {
  if (!full.value || props.busy) return;
  if (code.value.join("") === "000000") {
    error.value = true;
    if (refs.value[0]) refs.value[0].focus();
    return;
  }
  emit("verified");
};

const saveNumber = () => {
  const v = draft.value.trim();
  if (!v) return;
  phoneVal.value = v;
  editing.value = false;
  code.value = ["", "", "", "", "", ""];
  error.value = false;
  secs.value = 30;
  nextTick(() => {
    if (refs.value[0]) refs.value[0].focus();
  });
};

const boxBorder = (i) =>
  error.value
    ? "var(--error)"
    : full.value
    ? "var(--green)"
    : focusedIdx.value === i || code.value[i]
    ? "var(--accent)"
    : "var(--field-line)";
const boxRing = (i) =>
  error.value
    ? "0 0 0 3px rgba(217,45,32,.15)"
    : full.value
    ? "0 0 0 3px rgba(22,163,74,.15)"
    : focusedIdx.value === i
    ? "0 0 0 3px rgba(31,111,214,.15)"
    : "none";
</script>

<template>
  <div
    style="
      position: relative;
      display: flex;
      flex-direction: column;
      min-height: 0;
      flex: 1;
      background: #fff;
      padding: 32px 32px 24px;
      text-align: center;
      overflow-y: auto;
    "
  >
    <LoadingOverlay
      v-if="busy"
      label="Verifying your details…"
      sub="Securing your spot with a verified profile"
    />

    <div
      style="
        width: 56px;
        height: 56px;
        border-radius: 50%;
        background: #eaf1fd;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 16px;
      "
    >
      <Icon name="shield" :size="28" :stroke="2" color="var(--accent)" />
    </div>

    <div style="font-size: 22px; font-weight: 700; color: var(--navy); letter-spacing: -0.2px">
      Verify your phone number
    </div>
    <div style="font-size: 15px; color: var(--muted); font-weight: 500; margin-top: 8px; line-height: 1.5">
      Enter the 6-digit code we sent to
      <b style="color: var(--navy); font-weight: 700">{{ phoneVal }}</b>
    </div>

    <!-- editing number -->
    <div v-if="editing" style="margin-top: 22px">
      <div
        style="
          font-size: 12px;
          font-weight: 800;
          color: var(--muted-2);
          text-align: left;
          margin-bottom: 7px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        "
      >
        Mobile number
      </div>
      <input
        v-model="draft"
        inputmode="tel"
        autofocus
        placeholder="Enter mobile number"
        style="
          width: 100%;
          height: 52px;
          border: 1.5px solid var(--accent);
          border-radius: 12px;
          padding: 0 16px;
          font-size: 17px;
          font-weight: 700;
          color: var(--navy);
          outline: none;
          box-sizing: border-box;
          box-shadow: 0 0 0 3px rgba(31, 111, 214, 0.15);
        "
        @keydown.enter="saveNumber"
      />
      <div style="display: flex; gap: 10px; margin-top: 14px">
        <button
          style="
            flex: 0 0 auto;
            height: 48px;
            padding: 0 20px;
            border: 1.5px solid var(--line);
            background: #fff;
            border-radius: 12px;
            font-weight: 800;
            font-size: 14.5px;
            color: var(--navy);
            cursor: pointer;
          "
          @click="editing = false"
        >
          Cancel
        </button>
        <button
          class="btn-primary"
          :disabled="!draft.trim()"
          style="flex: 1; height: 48px; border-radius: 12px; font-size: 14.5px"
          @click="saveNumber"
        >
          <Icon name="refresh" :size="16" :stroke="2.4" /> Send code
        </button>
      </div>
    </div>

    <template v-else>
      <!-- OTP boxes -->
      <div
        :style="{
          display: 'flex',
          gap: '12px',
          justifyContent: 'center',
          marginTop: '24px',
          animation: error ? 'otp-shake .4s cubic-bezier(.36,.07,.19,.97)' : 'none',
        }"
        @paste="onPaste"
      >
        <input
          v-for="(d, i) in code"
          :key="i"
          :ref="(el) => setRef(el, i)"
          :value="d"
          inputmode="numeric"
          maxlength="1"
          :style="{
            width: '48px',
            height: '52px',
            textAlign: 'center',
            fontSize: '22px',
            fontWeight: 700,
            color: 'var(--navy)',
            border: `1.5px solid ${boxBorder(i)}`,
            borderRadius: '12px',
            background: '#fff',
            outline: 'none',
            caretColor: 'var(--accent)',
            boxShadow: boxRing(i),
            transition: 'border-color .14s ease, box-shadow .14s ease',
          }"
          @input="setDigit(i, $event.target.value)"
          @keydown="onKey(i, $event)"
          @focus="focusedIdx = i"
          @blur="focusedIdx = -1"
        />
      </div>

      <!-- inline status / error -->
      <div
        v-if="error"
        style="
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          margin-top: 12px;
          font-size: 13px;
          color: var(--error);
          font-weight: 600;
        "
      >
        <Icon name="alert" :size="14" :stroke="2.2" /> That code didn't match. Try again.
      </div>
      <div v-else style="margin-top: 12px; font-size: 12.5px; color: var(--muted-2); font-weight: 500">
        Demo — any 6 digits continue. Enter 000000 to preview the error.
      </div>

      <!-- action row: resend + change number -->
      <div
        style="
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          margin-top: 18px;
          font-size: 13.5px;
          font-weight: 700;
        "
      >
        <button
          :disabled="!resendReady"
          :style="{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'none',
            border: 'none',
            padding: '4px 2px',
            cursor: resendReady ? 'pointer' : 'default',
            color: resendReady ? 'var(--accent)' : 'var(--muted-2)',
            transition: 'color .15s ease',
          }"
          @click="resendReady && (secs = 30)"
        >
          <Icon name="refresh" :size="15" :stroke="2.2" />
          {{ resendReady ? "Resend code" : `Resend in ${timerStr}` }}
        </button>
        <span style="width: 1px; height: 14px; background: var(--line)" />
        <button
          :style="{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'none',
            border: 'none',
            padding: '4px 2px',
            cursor: 'pointer',
            color: changeHover ? 'var(--accent)' : 'var(--ink-2)',
            transition: 'color .15s ease',
          }"
          @click="draft = phoneVal; editing = true"
          @mouseenter="changeHover = true"
          @mouseleave="changeHover = false"
        >
          <Icon name="edit" :size="15" :stroke="2.2" /> Change number
        </button>
      </div>
    </template>

    <!-- quiet email note -->
    <div
      v-if="!emailVerified"
      style="
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 7px;
        margin-top: 16px;
        font-size: 13px;
        color: var(--muted-2);
        font-weight: 500;
      "
    >
      <Icon name="mail" :size="14" :stroke="1.8" />
      We also sent a confirmation link to {{ email }}.
    </div>

    <!-- CTA -->
    <button
      class="btn-primary"
      :disabled="!full || busy"
      style="width: 100%; height: 52px; border-radius: 12px; margin-top: 24px; font-size: 15.5px"
      @click="submit"
    >
      <Icon name="check" :size="17" :stroke="2.6" />
      <span style="white-space: nowrap">Verify &amp; {{ verb }}</span>
    </button>

    <!-- footer trust line -->
    <div
      style="
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 7px;
        margin-top: 16px;
        color: var(--muted-2);
        font-size: 13px;
        font-weight: 500;
        line-height: 1.45;
      "
    >
      <Icon name="lock" :size="13" :stroke="2" /> We verify every lead so our partner agents only get
      real buyers.
    </div>
  </div>
</template>

<script setup>
/* Inline glossary term + tooltip (Exclusive Agency Agreement) */
const open = ref(false);
const pos = ref({ left: 0, top: 0, arrow: 26 });
const linkRef = ref(null);
const tipRef = ref(null);
let hideT = null;

const place = () => {
  const el = linkRef.value;
  if (!el) return;
  const r = el.getBoundingClientRect();
  const W = 312, M = 12;
  const center = r.left + r.width / 2;
  let left = center - W / 2;
  left = Math.max(M, Math.min(left, window.innerWidth - W - M));
  const arrow = Math.max(18, Math.min(center - left, W - 26));
  pos.value = { left, top: r.bottom + 11, arrow };
};

const show = () => {
  clearTimeout(hideT);
  place();
  open.value = true;
};
const hide = () => {
  clearTimeout(hideT);
  hideT = setTimeout(() => (open.value = false), 130);
};

const reflow = () => place();
const onKey = (e) => {
  if (e.key === "Escape") open.value = false;
};
const onDown = (e) => {
  if (linkRef.value && linkRef.value.contains(e.target)) return;
  if (tipRef.value && tipRef.value.contains(e.target)) return;
  open.value = false;
};

watch(open, (v) => {
  if (v) {
    window.addEventListener("scroll", reflow, true);
    window.addEventListener("resize", reflow);
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
  } else {
    window.removeEventListener("scroll", reflow, true);
    window.removeEventListener("resize", reflow);
    document.removeEventListener("keydown", onKey);
    document.removeEventListener("pointerdown", onDown);
  }
});

onBeforeUnmount(() => {
  clearTimeout(hideT);
  window.removeEventListener("scroll", reflow, true);
  window.removeEventListener("resize", reflow);
  document.removeEventListener("keydown", onKey);
  document.removeEventListener("pointerdown", onDown);
});

const toggle = (e) => {
  e.preventDefault();
  open.value ? (open.value = false) : show();
};
</script>

<template>
  <span class="agency-term" @mouseenter="show" @mouseleave="hide">
    <a
      href="#"
      ref="linkRef"
      :class="'agency-term-link' + (open ? ' open' : '')"
      @click="toggle"
    >
      <slot>Exclusive Agency Agreement</slot>
    </a>
    <Teleport to="body">
      <span
        v-if="open"
        ref="tipRef"
        class="agency-tip"
        role="tooltip"
        :style="{ left: pos.left + 'px', top: pos.top + 'px' }"
        @mouseenter="show"
        @mouseleave="hide"
      >
        <span class="agency-tip-arrow" :style="{ left: pos.arrow + 'px' }" />
        <span class="agency-tip-title">Exclusive Agency Agreement</span>
        <span class="agency-tip-body">
          An Exclusive Agency Agreement is a contract that gives one agent exclusive rights to
          represent a home buyer and details the terms and agreement of their relationship.
        </span>
        <span class="agency-tip-body">
          If you have a signed Exclusive Agency Agreement, you need to schedule a tour directly
          through your agent.
        </span>
      </span>
    </Teleport>
  </span>
</template>

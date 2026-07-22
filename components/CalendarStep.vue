<script setup>
/* Calendar + time grid (SAS / injected showing) */
const props = defineProps({
  date: [Number, null],
  time: [String, null],
  title: { type: [String, null], default: "Select date & time of showing" },
  note: { type: Boolean, default: true },
  error: [String, Boolean],
});
const emit = defineEmits(["date", "time"]);

const days = buildDays();
const PER = 4;
const dPage = ref(0);
const tPage = ref(0);
const dShown = computed(() => days.slice(dPage.value * PER, dPage.value * PER + PER));
const tShown = computed(() => TIMES.slice(tPage.value * PER, tPage.value * PER + PER));
</script>

<template>
  <div class="col" style="gap: 14px">
    <FieldLabel v-if="title">{{ title }}</FieldLabel>

    <!-- dates -->
    <div class="row" style="align-items: stretch; gap: 8px">
      <Pager dir="L" :disabled="dPage === 0" @click="dPage = Math.max(0, dPage - 1)" />
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; flex: 1">
        <button
          v-for="d in dShown"
          :key="d.key"
          :style="{
            border: `1.5px solid ${
              date === d.key ? 'var(--accent)' : error ? 'var(--error-line)' : 'var(--line)'
            }`,
            borderRadius: 'var(--r-sm)',
            background: date === d.key ? '#f3f8ff' : '#fff',
            boxShadow: date === d.key ? '0 0 0 3px rgba(31,111,214,.12)' : 'none',
            padding: '10px 4px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
            transition: 'all .14s',
          }"
          @click="emit('date', d)"
        >
          <span
            :style="{ fontSize: '12px', fontWeight: 700, color: date === d.key ? 'var(--accent)' : 'var(--muted)' }"
            >{{ d.dow }}</span
          >
          <span style="font-size: 22px; font-weight: 800; color: var(--navy); line-height: 1">{{ d.day }}</span>
          <span style="font-size: 11.5px; font-weight: 600; color: var(--muted)">{{ d.mon }}</span>
        </button>
      </div>
      <Pager dir="R" :disabled="(dPage + 1) * PER >= days.length" @click="dPage++" />
    </div>

    <!-- times -->
    <div class="row" style="align-items: stretch; gap: 8px">
      <Pager dir="L" :disabled="tPage === 0" @click="tPage = Math.max(0, tPage - 1)" />
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; flex: 1">
        <button
          v-for="t in tShown"
          :key="t"
          :style="{
            border: `1.5px solid ${time === t ? 'var(--accent)' : 'var(--line)'}`,
            borderRadius: 'var(--r-sm)',
            background: time === t ? '#f3f8ff' : '#fff',
            boxShadow: time === t ? '0 0 0 3px rgba(31,111,214,.12)' : 'none',
            color: time === t ? 'var(--navy)' : 'var(--ink-2)',
            fontWeight: 700,
            fontSize: '13.5px',
            padding: '12px 4px',
            transition: 'all .14s',
          }"
          @click="emit('time', t)"
        >
          {{ t }}
        </button>
      </div>
      <Pager dir="R" :disabled="(tPage + 1) * PER >= TIMES.length" @click="tPage++" />
    </div>

    <div v-if="error" class="fl-msg">
      <Icon name="alert" :size="13" :stroke="2.2" /> {{ error }}
    </div>
    <div
      v-if="note"
      class="row"
      style="align-items: center; gap: 7px; color: var(--muted); font-size: 12.5px; font-weight: 600"
    >
      <Icon name="info" :size="14" /> It's free, with no obligation — cancel anytime · All times in EDT
    </div>
  </div>
</template>

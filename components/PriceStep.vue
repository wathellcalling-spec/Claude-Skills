<script setup>
/* Offer price: large input + slider */
const props = defineProps({
  value: { type: Number, required: true },
  listing: { type: Number, required: true },
});
const emit = defineEmits(["change"]);

const editing = ref(false);
const draft = ref("");
const min = computed(() => Math.round(props.listing * 0.7));
const max = computed(() => Math.round(props.listing * 1.15));
const delta = computed(() => props.value - props.listing);

const startEdit = () => {
  draft.value = String(props.value);
  editing.value = true;
};
const commit = () => {
  const clean = draft.value.replace(/[^0-9]/g, "");
  const n = +clean;
  if (clean !== "" && !isNaN(n)) emit("change", Math.min(max.value, Math.max(min.value, n)));
  editing.value = false;
};
const draftDisplay = computed(() => fmtMoney(+draft.value.replace(/[^0-9]/g, "") || 0));
</script>

<template>
  <div class="col" style="gap: 18px">
    <StepHead
      title="Enter your offer price"
      hint="Anchored to the list price. You can fine-tune below."
    />
    <div style="display: flex; align-items: center; gap: 12px; justify-content: center">
      <input
        v-if="editing"
        :value="draftDisplay"
        autofocus
        style="
          width: 300px;
          text-align: center;
          font-size: 34px;
          font-weight: 800;
          color: var(--navy);
          border: 1.5px solid var(--accent);
          border-radius: var(--r-md);
          padding: 14px 10px;
          outline: none;
          box-shadow: 0 0 0 3.5px rgba(31, 111, 214, 0.14);
        "
        @input="draft = $event.target.value.replace(/[^0-9]/g, '')"
        @blur="commit"
        @keydown.enter="commit"
      />
      <div
        v-else
        style="
          min-width: 300px;
          text-align: center;
          font-size: 34px;
          font-weight: 800;
          color: var(--navy);
          border: 1.5px solid var(--line);
          border-radius: var(--r-md);
          padding: 14px 10px;
          cursor: text;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background: #fff;
        "
        @click="startEdit"
      >
        {{ fmtMoney(value) }}
      </div>
      <button class="btn-ghost" style="padding: 8px" @click="startEdit">
        <Icon name="edit" :size="18" />
      </button>
    </div>

    <div class="col" style="gap: 8px; padding: 0 6px">
      <div style="position: relative; height: 26px; display: flex; align-items: center">
        <input
          type="range"
          :min="min"
          :max="max"
          step="5000"
          :value="value"
          style="width: 100%; accent-color: var(--accent); height: 6px"
          @input="emit('change', +$event.target.value)"
        />
      </div>
      <div
        class="row"
        style="justify-content: space-between; font-size: 11.5px; color: var(--muted); font-weight: 700"
      >
        <span>{{ fmtMoney(min) }}</span>
        <span
          :style="{
            color: delta === 0 ? 'var(--muted)' : delta > 0 ? 'var(--green-ink)' : 'var(--warn)',
          }"
        >
          {{
            delta === 0
              ? "At list price"
              : (delta > 0 ? "+" : "−") + fmtMoney(Math.abs(delta)) + (delta > 0 ? " over list" : " under list")
          }}
        </span>
        <span>{{ fmtMoney(max) }}</span>
      </div>
    </div>

    <div
      class="row"
      style="
        align-items: center;
        gap: 7px;
        justify-content: center;
        color: var(--muted);
        font-size: 12.5px;
        font-weight: 600;
      "
    >
      <Icon name="info" :size="14" color="var(--warn)" />
      <b style="color: var(--ink-2)">Don't worry:</b> you can change this later.
    </div>
  </div>
</template>

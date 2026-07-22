<script setup>
/* Floating-label field */
const props = defineProps({
  label: String,
  value: { type: [String, Number], default: "" },
  placeholder: { type: String, default: " " },
  type: { type: String, default: "text" },
  error: { type: String, default: "" },
  textarea: Boolean,
  autoFocus: Boolean,
  forceFocus: Boolean,
  inputMode: String,
  maxLength: [Number, String],
});
const emit = defineEmits(["change"]);

const focused = ref(false);
const el = ref(null);

onMounted(() => {
  if (props.autoFocus && el.value) el.value.focus();
});

const isFocused = computed(() => focused.value || props.forceFocus);
const filled = computed(() => props.value != null && props.value !== "");
const cls = computed(
  () =>
    "fl" +
    (filled.value ? " filled" : "") +
    (isFocused.value ? " focused" : "") +
    (props.error ? " error" : "")
);
</script>

<template>
  <div class="col" style="gap: 0">
    <div :class="cls">
      <textarea
        v-if="textarea"
        ref="el"
        :value="value"
        :placeholder="placeholder"
        :maxlength="maxLength"
        rows="2"
        style="margin: 2px 0px -1px; padding: 14px 14px 13px; height: 65px"
        @input="emit('change', $event.target.value)"
        @focus="focused = true"
        @blur="focused = false"
      />
      <input
        v-else
        ref="el"
        :type="type"
        :inputmode="inputMode"
        :maxlength="maxLength"
        :value="value"
        :placeholder="placeholder"
        style="margin: 0px; padding: 16px 14px 0; height: var(--field-h)"
        @input="emit('change', $event.target.value)"
        @focus="focused = true"
        @blur="focused = false"
      />
      <label>{{ label }}</label>
    </div>
    <div v-if="error" class="fl-msg">
      <Icon name="alert" :size="13" :stroke="2.2" /> {{ error }}
    </div>
  </div>
</template>

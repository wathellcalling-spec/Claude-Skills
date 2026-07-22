<script setup>
/* Contact details + message + timeline + agency + finance (CA full form) */
const props = defineProps({
  v: { type: Object, required: true },
  set: { type: Function, required: true },
  errors: { type: Object, default: () => ({}) },
  emptyMode: Boolean,
  hideInlineQ: Boolean,
  hideAgency: Boolean,
  hideFinance: Boolean,
  hideQual: Boolean,
  google: Boolean,
  onGoogle: Function,
});

const g = (k) => (props.emptyMode ? "" : props.v[k]);
const signedIn = computed(() => props.google && props.v.googleVerified);
</script>

<template>
  <div class="col" style="gap: 12px">
    <template v-if="google">
      <GoogleConnected
        v-if="signedIn"
        :name="`${v.firstName} ${v.lastName}`"
        :email="v.email"
      />
      <template v-else>
        <GoogleButton @click="onGoogle && onGoogle()" />
        <OrDivider label="or enter your details" />
      </template>
    </template>

    <div class="row">
      <div class="grow">
        <Field
          label="First Name"
          :value="g('firstName')"
          :error="errors.firstName"
          @change="set('firstName', $event)"
        />
      </div>
      <div class="grow">
        <Field
          label="Last Name"
          :value="g('lastName')"
          :error="errors.lastName"
          @change="set('lastName', $event)"
        />
      </div>
    </div>

    <Field
      v-if="!signedIn"
      label="Email"
      type="email"
      :value="g('email')"
      :placeholder="emptyMode ? 'you@email.com' : ' '"
      :error="errors.email"
      @change="set('email', $event)"
    />

    <Field
      label="Phone"
      inputMode="tel"
      :value="g('phone')"
      :placeholder="emptyMode ? '(000) 000-0000' : ' '"
      :error="errors.phone"
      @change="set('phone', $event)"
    />

    <Field
      label="Your Questions or Comments"
      textarea
      :value="g('message')"
      :placeholder="emptyMode ? 'Tell the agent what you\'d like to know…' : ' '"
      :error="errors.message"
      @change="set('message', $event)"
    />

    <QualQuestions
      v-if="!hideQual"
      :v="v"
      :set="set"
      :empty-mode="emptyMode"
      :hide-inline-q="hideInlineQ"
      :hide-agency="hideAgency"
      :hide-finance="hideFinance"
    />
  </div>
</template>

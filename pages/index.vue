<script setup>
/* App orchestration — property page / states matrix + the four lead flows. */
const t = reactive({
  caStyle: "premium", // 'classic' | 'premium'
  auth: "google", // 'standard' | 'google'
  accent: "#1f6fd6",
});

const view = ref("property"); // 'property' | 'matrix'
const flow = ref(null); // null | 'CA' | 'SAS' | 'GPA' | 'MAO'

const google = computed(() => t.auth === "google");
const close = () => (flow.value = null);
const launch = (f) => (flow.value = f);

const setTweak = (k, val) => (t[k] = val);
const previewCA = () => {
  flow.value = null;
  setTimeout(() => (flow.value = "CA"), 30);
};

// apply accent color tweak to CSS variable
const applyAccent = () => {
  if (import.meta.client) document.documentElement.style.setProperty("--accent", t.accent);
};
onMounted(applyAccent);
watch(() => t.accent, applyAccent);
</script>

<template>
  <div style="min-height: 100vh">
    <PropertyPage
      v-if="view === 'property'"
      @launch="launch"
      @open-matrix="view = 'matrix'"
    />
    <StatesMatrix v-else @back="view = 'property'" />

    <!-- Lead flows -->
    <template v-if="flow === 'CA'">
      <CAFlowPremium
        v-if="t.caStyle === 'premium'"
        :on-close="close"
        :on-launch="launch"
        :google="google"
      />
      <CAFlow v-else :on-close="close" />
    </template>
    <SASFlow v-else-if="flow === 'SAS'" :on-close="close" :on-launch="launch" :google="google" />
    <GPAFlow v-else-if="flow === 'GPA'" :on-close="close" :on-launch="launch" />
    <MAOFlow v-else-if="flow === 'MAO'" :on-close="close" :on-launch="launch" :google="google" />

    <TweaksPanel
      :ca-style="t.caStyle"
      :auth="t.auth"
      :accent="t.accent"
      @update="setTweak"
      @preview-c-a="previewCA"
    />
  </div>
</template>

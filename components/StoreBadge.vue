<script setup>
const props = defineProps({ store: String });
const src = computed(() => (props.store === "apple" ? "/assets/app-store.svg" : "/assets/google-play.svg"));
const alt = computed(() =>
  props.store === "apple" ? "Download on the App Store" : "Get it on Google Play"
);
</script>

<template>
  <a href="#" style="display: inline-flex; line-height: 0" @click.prevent>
    <img :src="src" :alt="alt" style="height: 32px; width: auto; display: block; border-radius: 6px" />
  </a>
</template>

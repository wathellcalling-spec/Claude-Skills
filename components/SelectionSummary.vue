<script setup>
/* Selection summary strip (multi-step flows) */
defineProps({ pills: { type: Array, default: () => [] } });
</script>

<template>
  <div class="sel-sum">
    <div class="sel-sum-top">
      <div class="sel-sum-id">
        <span class="sel-sum-addr">{{ PROPERTY.address }}</span>
        <span class="sel-sum-city">{{ PROPERTY.city }}</span>
      </div>
      <div class="sel-sum-price-wrap">
        <span class="sel-sum-price">{{ PROPERTY.price }}</span>
        <span class="sel-sum-price-cap">List price</span>
      </div>
    </div>
    <div v-if="pills.length > 0" class="sel-sum-pills">
      <span v-for="(p, i) in pills" :key="i" class="sel-pill">
        <Icon :name="p.icon || 'check'" :size="12.5" :stroke="2.4" />
        {{ p.value }}
      </span>
    </div>
  </div>
</template>

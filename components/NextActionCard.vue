<script setup>
defineProps({ icon: String, color: String, title: String, sub: String });
defineEmits(["click"]);
</script>

<template>
  <button
    class="action-row"
    :style="{
      flex: 1,
      minWidth: '220px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      textAlign: 'left',
      background: '#fff',
      border: '1px solid var(--line)',
      borderRadius: 'var(--r-md)',
      padding: '13px 14px',
      transition: 'border-color .15s, box-shadow .15s, transform .06s',
    }"
    @click="$emit('click')"
  >
    <span
      :style="{
        width: '40px',
        height: '40px',
        borderRadius: '10px',
        flexShrink: 0,
        background: color + '18',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }"
    >
      <Icon :name="icon" :size="20" :color="color" />
    </span>
    <span class="col" style="gap: 1px; min-width: 0">
      <span style="font-weight: 800; font-size: 14px; color: var(--navy)">{{ title }}</span>
      <span style="font-size: 12px; color: var(--muted); font-weight: 500">{{ sub }}</span>
    </span>
    <Icon
      name="chevR"
      :size="18"
      :stroke="2.2"
      color="var(--muted-2)"
      :style="{ marginLeft: 'auto', flexShrink: 0 }"
    />
  </button>
</template>

<script setup>
/* Property header chip */
defineProps({ slim: Boolean });
</script>

<template>
  <div
    :style="{
      display: 'flex',
      alignItems: 'center',
      gap: '14px',
      background: 'var(--chip-bg)',
      border: '1px solid var(--chip-line)',
      borderRadius: 'var(--r-md)',
      padding: '9px 12px',
      margin: '3px 26px 0px 0px',
    }"
  >
    <div
      :style="{
        position: 'relative',
        width: slim ? '58px' : '74px',
        height: slim ? '50px' : '60px',
        flexShrink: 0,
        borderRadius: '7px',
        overflow: 'hidden',
        background: '#cdd6e2',
      }"
    >
      <img :src="IMG.thumb" alt="" style="width: 100%; height: 100%; object-fit: cover" />
      <span
        :style="{
          position: 'absolute',
          left: 0,
          bottom: 0,
          right: 0,
          background: 'linear-gradient(transparent, rgba(0,0,0,.78))',
          color: '#fff',
          fontWeight: 800,
          fontSize: slim ? '9.5px' : '11px',
          padding: '8px 5px 3px',
        }"
        >{{ PROPERTY.price }}</span
      >
    </div>
    <div class="col grow" style="gap: 3px; min-width: 0">
      <div :style="{ fontWeight: 800, fontSize: slim ? '14px' : '15.5px', color: 'var(--navy)' }">
        {{ PROPERTY.address }},
        <span style="color: var(--muted); font-weight: 600">{{ PROPERTY.city }}</span>
      </div>
      <div class="row" style="gap: 14px; font-size: 12.5px; color: var(--ink-2); font-weight: 600">
        <span><b style="color: var(--navy)">{{ PROPERTY.beds }}</b> Beds</span>
        <span><b style="color: var(--navy)">{{ PROPERTY.baths }}</b> Baths</span>
        <span><b style="color: var(--navy)">{{ PROPERTY.sqft }}</b> sqft</span>
      </div>
    </div>
  </div>
</template>

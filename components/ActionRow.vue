<script setup>
defineProps({
  color: String,
  title: String,
  sub: String,
  icon: String,
  highlight: Boolean,
});
defineEmits(["click"]);
</script>

<template>
  <!-- Highlighted (Contact Agent) variant -->
  <div
    v-if="highlight"
    style="
      background: linear-gradient(180deg, #f3fbf5, #fff);
      border: 1px solid #d4ead9;
      border-radius: var(--r-md);
      padding: 16px;
      box-shadow: var(--sh-card);
    "
  >
    <div class="row" style="justify-content: space-between; align-items: flex-start; gap: 10px">
      <div class="col" style="gap: 3px">
        <span style="font-weight: 800; font-size: 16px; color: var(--green-deep)">{{ title }}</span>
        <span
          style="
            font-size: 12.5px;
            color: var(--muted);
            font-weight: 500;
            line-height: 1.4;
            max-width: 200px;
          "
          >{{ sub }}</span
        >
      </div>
      <span
        style="
          width: 38px;
          height: 38px;
          border-radius: 9px;
          background: #e4f4e8;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        "
      >
        <Icon :name="icon" :size="20" color="var(--green-deep)" />
      </span>
    </div>
    <button
      class="btn-primary btn-green"
      style="width: 100%; margin-top: 13px"
      @click="$emit('click')"
    >
      Contact Agent
    </button>
  </div>

  <!-- Standard action row -->
  <button
    v-else
    class="action-row"
    style="
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      text-align: left;
      background: #fff;
      border: 1px solid var(--line);
      border-radius: var(--r-md);
      padding: 13px 15px;
      width: 100%;
      transition: border-color 0.15s, box-shadow 0.15s, transform 0.06s;
    "
    @click="$emit('click')"
  >
    <div class="col" style="gap: 2px">
      <span :style="{ fontWeight: 800, fontSize: '15px', color: color }">{{ title }}</span>
      <span style="font-size: 12.5px; color: var(--muted); font-weight: 500">{{ sub }}</span>
    </div>
    <span
      :style="{
        width: '36px',
        height: '36px',
        borderRadius: '9px',
        background: color + '18',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }"
    >
      <Icon :name="icon" :size="19" :color="color" />
    </span>
  </button>
</template>

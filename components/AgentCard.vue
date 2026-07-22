<script setup>
defineProps({ showCall: Boolean });
</script>

<template>
  <div
    style="
      display: flex;
      align-items: center;
      gap: 13px;
      background: #fff;
      border: 1px solid var(--line);
      border-radius: var(--r-md);
      padding: 14px;
      box-shadow: var(--sh-card);
    "
  >
    <div
      style="
        width: 48px;
        height: 48px;
        border-radius: 50%;
        flex-shrink: 0;
        background: linear-gradient(135deg, #2f7fe0, #16407f);
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 800;
        font-size: 17px;
        letter-spacing: 0.5px;
      "
    >
      {{ AGENT.initials }}
    </div>
    <div class="col grow" style="gap: 1px; min-width: 0">
      <span style="font-weight: 800; font-size: 14.5px; color: var(--navy)">{{ AGENT.name }}</span>
      <span style="font-size: 12px; color: var(--muted); font-weight: 600">{{ AGENT.title }}</span>
      <span
        style="
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 11.5px;
          color: var(--ink-2);
          font-weight: 700;
          margin-top: 2px;
        "
      >
        <Icon name="star" :size="12" color="#e0a325" /> {{ AGENT.rating }} · {{ AGENT.reviews }} reviews
      </span>
    </div>
    <a
      v-if="showCall"
      href="#"
      style="
        display: inline-flex;
        align-items: center;
        gap: 6px;
        flex-shrink: 0;
        border: 1.5px solid var(--line);
        border-radius: 8px;
        padding: 8px 12px;
        font-size: 12.5px;
        font-weight: 800;
        color: var(--navy);
        text-decoration: none;
        background: #fff;
      "
      @click.prevent
    >
      <Icon name="phone" :size="14" /> Call
    </a>
  </div>
</template>

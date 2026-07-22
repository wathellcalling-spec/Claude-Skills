<script setup>
/* Houzeo property detail page */
const emit = defineEmits(["launch", "openMatrix"]);
</script>

<template>
  <div style="min-height: 100%; background: #fff">
    <!-- Top bar -->
    <header
      style="
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 14px 22px;
        border-bottom: 1px solid var(--line-soft);
        position: sticky;
        top: 0;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(6px);
        z-index: 5;
      "
    >
      <button class="btn-ghost"><Icon name="chevL" :size="17" :stroke="2.4" /> Back</button>
      <Logo />
      <div class="row" style="align-items: center; gap: 16px; color: var(--ink-2)">
        <span class="row" style="align-items: center; gap: 5px; font-weight: 700; font-size: 13.5px"
          ><Icon name="heart" :size="18" /> 0</span
        >
        <span class="row" style="align-items: center; gap: 5px; font-weight: 700; font-size: 13.5px"
          ><Icon name="eye" :size="18" /> 4</span
        >
        <button class="btn-ghost" style="padding: 6px"><Icon name="send" :size="17" /></button>
        <button
          style="
            border: 1.5px solid var(--line);
            background: #fff;
            border-radius: 8px;
            padding: 7px 12px;
            font-weight: 800;
            font-size: 12.5px;
            color: var(--navy);
            display: inline-flex;
            align-items: center;
            gap: 6px;
          "
          @click="emit('openMatrix')"
        >
          <Icon name="grid" :size="15" /> States matrix
        </button>
      </div>
    </header>

    <div style="max-width: 1180px; margin: 0 auto; padding: 18px 22px 60px">
      <!-- Gallery -->
      <div
        class="gallery"
        style="
          display: grid;
          grid-template-columns: 1.15fr 1fr 1fr;
          grid-template-rows: 1fr 1fr;
          gap: 8px;
          height: 400px;
          margin-bottom: 22px;
        "
      >
        <div style="grid-row: 1 / 3; position: relative; border-radius: var(--r-md); overflow: hidden">
          <img :src="IMG.hero" alt="" style="width: 100%; height: 100%; object-fit: cover" />
          <span
            style="
              position: absolute;
              top: 12px;
              left: 12px;
              display: inline-flex;
              align-items: center;
              gap: 6px;
              background: #fff;
              border-radius: 999px;
              padding: 5px 12px;
              font-size: 12.5px;
              font-weight: 800;
              color: var(--green-deep);
            "
          >
            <span style="width: 8px; height: 8px; border-radius: 50%; background: var(--green)" /> For Sale
          </span>
        </div>
        <div style="position: relative; border-radius: var(--r-md); overflow: hidden">
          <img :src="IMG.exterior" alt="" style="width: 100%; height: 100%; object-fit: cover" />
        </div>
        <div style="position: relative; border-radius: var(--r-md); overflow: hidden">
          <img :src="IMG.street" alt="" style="width: 100%; height: 100%; object-fit: cover" />
        </div>
        <div style="position: relative; border-radius: var(--r-md); overflow: hidden">
          <img :src="IMG.dining" alt="" style="width: 100%; height: 100%; object-fit: cover" />
        </div>
        <div style="position: relative; border-radius: var(--r-md); overflow: hidden">
          <img
            :src="IMG.more"
            alt=""
            style="width: 100%; height: 100%; object-fit: cover; filter: brightness(0.72)"
          />
          <span
            style="
              position: absolute;
              inset: 0;
              display: flex;
              align-items: center;
              justify-content: center;
              color: #fff;
              font-weight: 800;
              font-size: 30px;
            "
            >52+</span
          >
          <div
            style="position: absolute; bottom: 8px; left: 50%; transform: translateX(-50%); display: flex; gap: 6px"
          >
            <span
              style="
                background: #fff;
                border-radius: 7px;
                padding: 5px 9px;
                font-size: 11px;
                font-weight: 700;
                color: var(--ink);
                display: inline-flex;
                gap: 4px;
                align-items: center;
              "
              ><Icon name="eye" :size="13" /> Virtual Tour</span
            >
            <span
              style="
                background: #fff;
                border-radius: 7px;
                padding: 5px 9px;
                font-size: 11px;
                font-weight: 700;
                color: var(--ink);
                display: inline-flex;
                gap: 4px;
                align-items: center;
              "
              ><Icon name="pin" :size="13" /> Street View</span
            >
          </div>
        </div>
      </div>

      <!-- Main + sidebar -->
      <div
        class="detail-grid"
        style="display: grid; grid-template-columns: 1fr 340px; gap: 28px; align-items: start"
      >
        <div class="col" style="gap: 0">
          <div
            class="row"
            style="justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 14px"
          >
            <div class="row" style="gap: 22px; align-items: center; flex-wrap: wrap">
              <Spec icon="bed" :value="PROPERTY.beds" unit="Beds" />
              <span style="color: var(--line)">|</span>
              <Spec icon="bath" :value="PROPERTY.baths" unit="Baths" />
              <span style="color: var(--line)">|</span>
              <Spec icon="area" :value="PROPERTY.sqft" unit="sqft" />
            </div>
            <div class="col" style="align-items: flex-end; gap: 2px">
              <span style="font-weight: 800; font-size: 26px; color: var(--navy)">{{ PROPERTY.price }}</span>
              <span style="font-size: 13px; color: var(--muted); font-weight: 600">
                {{ PROPERTY.estMo }} Est ·
                <a href="#" style="font-weight: 800" @click.prevent="emit('launch', 'GPA')">Get Pre-Approved</a>
              </span>
            </div>
          </div>
          <div style="font-size: 14.5px; color: var(--ink-2); font-weight: 600; margin-top: 8px">
            {{ PROPERTY.address }}, <span style="color: var(--muted)">{{ PROPERTY.city }}</span>
          </div>

          <hr class="divider" style="margin: 20px 0" />

          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px 12px">
            <DetailItem icon="home" :label="PROPERTY.type" />
            <DetailItem icon="tools" :label="`Built in ${PROPERTY.built}`" />
            <DetailItem icon="user" :label="`${PROPERTY.hoa} HOA`" />
            <DetailItem icon="lot" :label="`${PROPERTY.lot} sqft lot`" />
            <DetailItem icon="map" :label="PROPERTY.ppsf" />
          </div>

          <hr class="divider" style="margin: 20px 0" />

          <h2 style="margin: 0 0 12px; font-size: 22px; font-weight: 800; color: var(--navy)">Description</h2>
          <p style="margin: 0; font-size: 14.5px; line-height: 1.65; color: var(--ink-2); font-weight: 500">
            Live the waterfront lifestyle in this elegant townhouse overlooking the Intracoastal. Spread
            across three spacious levels, this beautifully updated home offers an open layout that's perfect
            for entertaining or relaxing in style. Bright flooring adds a touch of luxury, while the sleek
            kitchen — complete with high-end appliances and generous counter space — makes everyday living
            feel elevated. With four bedrooms and five baths, there's room for everyone. Minutes from the
            beach, top schools, and dining.
            <a href="#" style="font-weight: 700"> Continue Reading</a>
          </p>
        </div>

        <!-- Sidebar launcher -->
        <aside class="col launcher" style="gap: 10px; position: sticky; top: 80px">
          <div
            style="
              display: flex;
              align-items: center;
              gap: 11px;
              background: linear-gradient(95deg, #e9f1fb, #f6e9e4);
              border: 1px solid var(--chip-line);
              border-radius: var(--r-md);
              padding: 13px 15px;
            "
          >
            <Icon name="heart" :size="22" color="#d2603f" />
            <div class="col" style="gap: 1px">
              <span style="font-weight: 800; font-size: 16px; color: var(--navy)">Love this home?</span>
              <span style="font-size: 12.5px; color: var(--ink-2); font-weight: 600">Here's 4 things you can do</span>
            </div>
          </div>
          <ActionRow
            highlight
            title="Contact Agent"
            sub="Your local real estate expert. Speak directly about the home & pricing."
            icon="phone"
            @click="emit('launch', 'CA')"
          />
          <ActionRow
            color="var(--blue)"
            title="Schedule a Showing"
            sub="Book your private tour"
            icon="calendar"
            @click="emit('launch', 'SAS')"
          />
          <ActionRow
            color="var(--purple)"
            title="Get Pre-approved"
            sub="Rates starting from 6.8%"
            icon="doc"
            @click="emit('launch', 'GPA')"
          />
          <ActionRow
            color="var(--orange)"
            title="Submit an Offer"
            sub="Fastest way to get your offer in"
            icon="dollar"
            @click="emit('launch', 'MAO')"
          />
        </aside>
      </div>
    </div>
  </div>
</template>

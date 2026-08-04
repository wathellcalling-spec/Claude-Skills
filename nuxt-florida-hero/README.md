# Best Places to Live in Florida — Hero Section (Nuxt 3)

A production-ready **Nuxt 3 + Vue 3** conversion of a Houzeo "Best Places to Live in
Florida" hero section that was originally exported as a bundled HTML design. The
conversion preserves the original design exactly — layout, spacing, typography,
colors, gradients, interactions, animations, and responsive behavior — while
re-implementing the markup in Vue components and the vanilla-JS behavior with the
Vue Composition API.

## Technology Stack

- [Nuxt 3](https://nuxt.com/) (v3.21.x)
- [Vue 3](https://vuejs.org/) — Composition API with `<script setup>`
- JavaScript (no TypeScript)
- [Tailwind CSS v4.3.0](https://tailwindcss.com/) via the first-party `@tailwindcss/vite` plugin
- Poppins (self-hosted TrueType fonts, weights 300/400/500/600)

## Project Structure

```text
nuxt-florida-hero/
├── assets/
│   └── css/
│       └── tailwind.css        # Tailwind v4 entry + ported design CSS (reset, fonts, hero rules, responsive)
├── components/
│   └── HeroSection.vue         # The hero markup + interactions (reveal, count-up, popovers, lightbox)
├── pages/
│   └── index.vue               # Renders the hero at "/"
├── public/
│   ├── fonts/                  # Poppins-Light/Regular/Medium/SemiBold.ttf
│   └── images/                 # hero photo + author/reviewer avatars (webp)
├── app.vue
├── nuxt.config.js
├── package.json
└── README.md
```

## Styling approach

All styling is expressed as **Tailwind CSS utility classes** on the elements —
there are no inline `style="…"` attributes and no hand-written component CSS
rules. Pixel-exact values from the source design are reproduced with Tailwind's
arbitrary values/variants (e.g. `text-[clamp(24px,3.55vw,48px)]`,
`shadow-[…]`, `after:content-['']`, `group-hover/dstat:…`,
`group-data-[open=1]/bio:…`, `max-md:` / `min-[768px]:max-[1024px]:` responsive
variants).

The only CSS in `assets/css/tailwind.css` is what has no utility-class
equivalent and must live in the stylesheet:

- `@import "tailwindcss";`
- an `@theme` block registering the Poppins font token and the four custom
  keyframe animations (`animate-glow-hot`, `animate-live-ring`,
  `animate-live-core`, `animate-ico-draw`)
- `@font-face` declarations for the self-hosted Poppins weights

Base page styling (font, background, text color) is applied with Tailwind
classes via `bodyAttrs` in `nuxt.config.js`; Tailwind's Preflight covers the
reset. Dynamic popover/lightbox positioning that depends on runtime
measurements (`getBoundingClientRect`) is set from JavaScript — this is
behavior, not static styling.

## What was converted

- **Markup** — the hero DOM is reproduced faithfully (same structure and order)
  so every responsive rule keyed to the original structure still applies.
- **JavaScript → Composition API** — the original vanilla-JS behaviors were
  re-implemented in `<script setup>` inside `onMounted` / reactive state:
  - Scroll-in **reveal** animation (`IntersectionObserver`)
  - **Count-up** for the four stat cards (`$395,798`, `40`, `$2,394`, `220,560`)
  - **Shares** popover positioning + **Copy Link** toast (`navigator.clipboard`)
  - **Author / Reviewer** bio hover-cards (fixed positioning, hover/focus/tap)
  - Avatar **lightbox** with `Escape`-to-close
  - Reduced-motion support is preserved via CSS media queries

## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server (http://localhost:3000):

```bash
npm run dev
```

## Production

Build the application:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

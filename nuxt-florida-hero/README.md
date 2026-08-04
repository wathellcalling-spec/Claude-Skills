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

## What was converted

- **Markup** — the hero DOM is reproduced verbatim (same structure, classes, inline
  styles) so every responsive rule keyed to the original structure still applies.
- **CSS** — the design's global reset, `@font-face` declarations, keyframes, and all
  hero + responsive rules were moved into `assets/css/tailwind.css`. Dead CSS for
  page sections that are not part of this hero was removed.
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

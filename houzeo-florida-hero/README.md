# Best Places to Live in Florida — Hero (Houzeo)

The Houzeo "Best Places to Live in Florida 2026" hero, rebuilt on a modern
stack. This is a 1:1 port of the original static HTML/CSS/JS export.

## Stack

- **Nuxt 3** (file-based routing, auto-imports, SSR)
- **Vue 3** with the **Composition API** and `<script setup>`
- **JavaScript** (no TypeScript)
- **Tailwind CSS v4** via the official `@tailwindcss/vite` plugin

### Styling rule

All element styling is expressed with **Tailwind utility classes only** —
including arbitrary values (`bg-[#182638]`, `[background:linear-gradient(...)]`,
`shadow-[...]`). There is **no custom CSS, no external CSS and no inline
`style` attributes** anywhere in the components.

The single stylesheet, `assets/css/main.css`, contains only what Tailwind
itself requires: the `@import "tailwindcss"` entry, an `@theme` token that backs
the `font-poppins` utility, and the self-hosted Poppins `@font-face` asset
declarations. It contains no element styling rules.

## Project structure

```
houzeo-florida-hero/
├── nuxt.config.js              Tailwind v4 (Vite plugin) + base body classes
├── app.vue                     shell — page + shared lightbox
├── pages/
│   └── index.vue               page metadata + ItemList JSON-LD + <HeroSection>
├── components/
│   ├── HeroSection.vue         stage, breadcrumb, engagement row, grid, strip
│   ├── HeroContent.vue         headline, intro, byline, CTAs (left column)
│   ├── HeroPhoto.vue           photo, glow, hot-post pill, stat grid (right)
│   ├── HeroStatCard.vue        one stat card (icon + count-up + label)
│   ├── Byline.vue              author / editor / reviewer pill
│   ├── BioCard.vue             hover/tap bio popover (accent-themed)
│   ├── ShareMenu.vue           share popover + clipboard copy + toast
│   ├── MlsStrip.vue            live-data strip + source chips
│   └── AvatarLightbox.vue      full-size avatar overlay
├── composables/
│   ├── useHeroApi.js           mock service seam (returns Promises)
│   ├── useReveal.js            reveal-on-scroll (IntersectionObserver)
│   ├── useCountUp.js           count-up animation
│   ├── useLightbox.js          shared lightbox state (useState)
│   └── useReducedMotion.js     prefers-reduced-motion guard
├── utils/
│   └── content.js              content model (stats, contributors, share URL)
├── assets/
│   ├── css/main.css            Tailwind entry + font tokens/faces (no styling)
│   └── fonts/Poppins-*.ttf
└── public/images/              hero photo + contributor avatars
```

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
```

Build / preview:

```bash
npm run build
npm run preview
```

## Ported interactions

| Element | Behaviour |
|---|---|
| Headline, intro, byline, stat grid, strip | Reveal on scroll (`IntersectionObserver`) |
| Stat figures | Count-up from 0 with cubic ease-out, formatted `en-US` |
| Stat cards | Hover lift + icon/glow states (Tailwind `hover:` / `after:`) |
| Author / Editor names + avatars | Bio popover: hover, tap, keyboard focus / Enter / Space, Esc, 150 ms grace |
| Bio card avatar | Full-size lightbox (backdrop / ✕ / Esc to close) |
| Shares | Popover with Copy Link (clipboard + toast) and social share links |
| All motion | Disabled under `prefers-reduced-motion: reduce` |

## Notes on the conversion

- **Data / API seam.** Content lives in `utils/content.js`; `useHeroApi`
  mirrors the original mock API layer (swap each body for `$fetch`).
- **Animations.** The live pulse, ring and hot-post glow use Tailwind's
  built-in `animate-ping` / `animate-pulse` so no custom keyframes are needed.
  The stat-icon stroke-draw (a bespoke keyframe in the original) is omitted to
  keep styling to utility classes only.
- **Bio / share popovers.** The original positioned these with JS-set fixed
  coordinates. To avoid inline styles, they are anchored with absolute Tailwind
  positioning relative to their trigger, preserving the look and open/close
  behaviour.

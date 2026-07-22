# Houzeo — Buyer Lead Flow

A faithful Nuxt 3 implementation of the Houzeo **Buyer Lead Flow** prototype — a
hyper-professional, data-dense real-estate lead-capture experience built around a
property detail page and four modular lead flows.

Imported from the Claude Design project **Buyer Lead Flow.html** and ported from
the original React prototype to **Nuxt 3 / Vue 3** with the Composition API.

## Tech stack

- **Nuxt 3** + **Vue 3** (`<script setup>`, Composition API)
- **JavaScript** (no TypeScript)
- **Tailwind CSS v4** (via `@tailwindcss/vite`) alongside a ported design-token layer
- Plus Jakarta Sans (Google Fonts)

No Bootstrap, Vuetify, PrimeVue, jQuery, SCSS/SASS/LESS, CSS Modules, or other
external UI frameworks.

## What's inside

The property detail page launches four lead flows, each a self-contained modal
state machine:

| Flow | Path |
| --- | --- |
| **Contact Agent** (premium) | contact → timeline → agency → finance → seen-in-person → (calendar) → verify → success |
| **Schedule a Showing** | calendar → agency → contact → verify → success |
| **Get Pre-approved** | ask → (dense form) → contact → success |
| **Make an Offer** | price → seen-in-person → (calendar) → agency → financing → pre-approval → contact → verify → success |

Shared building blocks include a floating-label field kit, segmented controls,
choice cards, an inline phone-OTP verify screen, an "already represented"
dead-end, a staged verifying → cross-sell → app-download interstitial, and two
success-screen variants. A **States Matrix** view (linked from the header) shows
the nine canonical UI states side-by-side.

A floating **Tweaks** panel (bottom-right) lets you switch the Contact Agent
style (classic / premium), the sign-in identity (standard / Google), and the
accent color.

### Notes

- Property photography and brand marks are lightweight local SVG placeholders in
  `public/assets/`; the Houzeo app QR code is the real asset. Swap in production
  imagery by replacing the files referenced in `composables/useData.js`.
- The OTP screen is a demo: any 6 digits continue, `000000` previews the error state.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run preview  # preview the production build
```

## Project structure

```
app.vue                     # root
pages/index.vue             # app orchestration (property / matrix + flows + tweaks)
assets/css/main.css         # Tailwind import + design tokens & component styles
composables/                # data, validators, submit lifecycle
components/                  # ~50 Vue SFCs (primitives, steps, flows, success screens)
public/assets/              # SVG imagery + QR code
```

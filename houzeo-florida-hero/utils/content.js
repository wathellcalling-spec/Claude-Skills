/* ============================================================================
   content.js — content model for the hero (ported from the original data.js).

   Everything the hero renders dynamically lives here so no copy, figure or
   person is hardcoded inside the components. Nuxt auto-imports these named
   exports, so any component can reference them directly.
   ========================================================================== */

/* Stat cards shown over the hero photo. `value` is animated from 0 on scroll.
   `icon` is a key resolved to an inline SVG inside HeroStatCard.vue. */
export const HERO_STATS = [
  { id: 'median-home-price', label: 'Median Home Price', value: 395798, prefix: '$', icon: 'home' },
  { id: 'safety-score', label: 'Safety Score', value: 40, prefix: '', icon: 'shield' },
  { id: 'median-home-rent', label: 'Median Home Rent', value: 2394, prefix: '$', icon: 'rent' },
  { id: 'homes-for-sale', label: 'Homes for Sale', value: 220560, prefix: '', icon: 'list' }
]

/* Byline. `card: true` renders the hover bio card; the reviewer is a label only.
   `accent` selects the colour theme applied inside the bio card component. */
export const CONTRIBUTORS = [
  {
    role: 'Author',
    accent: 'author',
    card: true,
    name: 'Jaaziel Pereira',
    title: 'Relocation & Livability Analyst',
    avatar: '/images/jaaziel-pereira.webp',
    bio: 'Jaaziel Pereira is a Relocation and Livability Analyst who helps people find places that balance affordability, comfort, and opportunity. He studies market trends, community features, and quality-of-life indicators to guide smarter relocation decisions.',
    topics: ['Best Places to Live', 'Safest Places to Live'],
    profileUrl: 'https://www.houzeo.com/blog/author/Jaaziel-Pereira/'
  },
  {
    role: 'Editor',
    accent: 'editor',
    card: true,
    name: 'Harshada Jaybhaye',
    title: 'Relocation & Livability Analyst',
    avatar: '/images/harshada-jaybhaye.webp',
    bio: 'Harshada Jaybhaye is a Relocation and Livability Analyst who helps people compare places beyond rankings and headlines. She evaluates affordability, safety, quality of life, and local amenities to help readers find places that match their budget, lifestyle, and long-term goals.',
    topics: ['Best Places to Live', 'Safest Places to Live'],
    profileUrl: 'https://www.houzeo.com/blog/author/Harshada-Jaybhaye/'
  },
  {
    role: 'Reviewer',
    card: false,
    name: 'Dan Farber'
  }
]

/* Canonical URL used by the share menu. */
export const SHARE_URL = 'https://www.houzeo.com/best-places-to-live/florida'

/* Static engagement figures shown in the header (static text in the design). */
export const ENGAGEMENT = {
  reads: '14,599',
  shares: '55',
  lastUpdated: 'Jul 17, 2026'
}

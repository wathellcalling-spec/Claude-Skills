<script setup>
// Page-level metadata (title, description) and the ItemList structured data,
// ported from the original <head> of index.html.
useHead({
  title: 'Best Places to Live in Florida 2026 | Houzeo',
  meta: [
    {
      name: 'description',
      content:
        'The top 10 places to live in Florida in 2026, ranked on safety, schools, home prices, rent and inventory using live MLS, FBI, Census and BLS data.'
    }
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Best Places to Live in Florida 2026',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Naples, FL' },
          { '@type': 'ListItem', position: 2, name: 'Miami, FL' },
          { '@type': 'ListItem', position: 3, name: 'Fort Lauderdale, FL' },
          { '@type': 'ListItem', position: 4, name: 'Tampa, FL' },
          { '@type': 'ListItem', position: 5, name: 'Orlando, FL' },
          { '@type': 'ListItem', position: 6, name: 'Cape Coral, FL' },
          { '@type': 'ListItem', position: 7, name: 'Pensacola, FL' },
          { '@type': 'ListItem', position: 8, name: 'Jacksonville, FL' },
          { '@type': 'ListItem', position: 9, name: 'Melbourne, FL' },
          { '@type': 'ListItem', position: 10, name: 'Tallahassee, FL' }
        ]
      })
    }
  ]
})
</script>

<template>
  <main id="hz-main" class="flow-root">
    <HeroSection />
  </main>
</template>

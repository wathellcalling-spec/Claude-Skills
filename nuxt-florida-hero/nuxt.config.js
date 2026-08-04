import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: false },

  // Global stylesheet (Tailwind v4 entry + design CSS ported from the source).
  css: ['~/assets/css/tailwind.css'],

  // Tailwind CSS v4 is wired through its first-party Vite plugin.
  vite: {
    plugins: [tailwindcss()]
  },

  app: {
    head: {
      title: 'Best Places to Live in Florida',
      htmlAttrs: { lang: 'en' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            'Life in Florida is usually painted with palm-lined streets, white sand beaches, and warm sunshine. Here are the top 10 places to live in Florida.'
        }
      ]
    }
  }
})

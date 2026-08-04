import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: false },

  // The single global stylesheet is nothing more than the Tailwind entry point
  // (`@import "tailwindcss"`) plus the design's font registration and theme
  // tokens. All element styling is expressed with Tailwind utility classes.
  css: ['~/assets/css/main.css'],

  // Tailwind CSS v4 is wired in through its official Vite plugin.
  vite: {
    plugins: [tailwindcss()]
  },

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      // Base type + surface colours applied with Tailwind utilities (no CSS rules).
      bodyAttrs: { class: 'font-poppins text-[#202020] bg-white antialiased leading-normal' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ]
    }
  }
})

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  // Vite configuration to fix Windows path issues
  vite: {
    server: {
      fs: {
        strict: false
      }
    }
  },

  // Modules
  modules: [
    '@nuxtjs/tailwindcss'
    // '@vite-pwa/nuxt' // Temporarily disabled due to Windows path issues
  ],

  // PWA Configuration - Temporarily disabled due to Windows path issues
  // pwa: {
  //   registerType: 'autoUpdate',
  //   workbox: {
  //     navigateFallback: '/',
  //     globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
  //   },
  //   client: {
  //     installPrompt: true,
  //   },
  //   manifest: {
  //     name: 'Aplikasi Rekap Absensi',
  //     short_name: 'Absensi PWA',
  //     description: 'Aplikasi Progressive Web App untuk rekap absensi karyawan',
  //     theme_color: '#3b82f6',
  //     background_color: '#ffffff',
  //     display: 'standalone',
  //     orientation: 'portrait',
  //     scope: '/',
  //     start_url: '/',
  //     icons: [
  //       {
  //         src: '/pwa-192x192.png',
  //         sizes: '192x192',
  //         type: 'image/png',
  //       },
  //       {
  //         src: '/pwa-512x512.png',
  //         sizes: '512x512',
  //         type: 'image/png',
  //       },
  //       {
  //         src: '/pwa-512x512.png',
  //         sizes: '512x512',
  //         type: 'image/png',
  //         purpose: 'any maskable',
  //       },
  //       {
  //         src: '/pwa-192x192.svg',
  //         sizes: '192x192',
  //         type: 'image/svg+xml',
  //       },
  //       {
  //         src: '/pwa-512x512.svg',
  //         sizes: '512x512',
  //         type: 'image/svg+xml',
  //       },
  //     ],
  //   },
  // },

  // App Configuration
  app: {
    head: {
      title: 'Aplikasi Rekap Absensi',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Aplikasi Progressive Web App untuk rekap absensi karyawan' },
        { name: 'theme-color', content: '#3b82f6' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'apple-touch-icon', sizes: '192x192', href: '/pwa-192x192.png' },
        { rel: 'mask-icon', href: '/favicon.svg', color: '#3b82f6' }
      ]
    }
  },

  // SSR Configuration
  ssr: false,

  // CSS Configuration
  css: ['~/assets/css/main.css'],

  // Tailwind CSS Configuration
  tailwindcss: {
    configPath: 'tailwind.config.js',
    exposeConfig: true
  }
})

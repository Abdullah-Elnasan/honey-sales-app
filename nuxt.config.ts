export default defineNuxtConfig({
  devtools: { enabled: true },
  nitro: {
  preset: 'vercel',
  externals: {
    inline: ['unhead']
  }
},
  experimental: { appManifest: true },
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      htmlAttrs: { lang: 'ar', dir: 'rtl' },
      title: 'حسابات بيع العسل',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
    },
  },
  compatibilityDate: '2024-04-03',
})
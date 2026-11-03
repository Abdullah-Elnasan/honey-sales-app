export default defineNuxtConfig({
  devtools: { enabled: true },
  nitro: { preset: 'vercel' },
  experimental: { appManifest: true },
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      htmlAttrs: { lang: 'ar', dir: 'rtl' },
      title: 'حسابات بيع العسل',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1'
        },
        {
          name: 'description',
          content: 'تطبيق لإدارة حسابات ومبيعات العسل بسهولة'
        },
        {
          property: 'og:type',
          content: 'website'
        },
        {
          property: 'og:title',
          content: 'حسابات بيع العسل'
        },
        {
          property: 'og:description',
          content: 'إدارة المبيعات والحسابات بسهولة'
        },
        {
          property: 'og:image',
          content: 'https://YOUR-DOMAIN.vercel.app/og-image.jpg'
        },
        {
          property: 'og:image:width',
          content: '1200'
        },
        {
          property: 'og:image:height',
          content: '630'
        },
        {
          name: 'twitter:card',
          content: 'summary_large_image'
        },
        {
          name: 'twitter:image',
          content: 'https://honey-sales-app-silk.vercel.app/og-image.jpg'
        }
      ],
    },
  },
  compatibilityDate: '2024-04-03',
})
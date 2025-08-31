// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: "Fléchettes",
      htmlAttrs: { lang: "fr" },
      link: [
        {
          rel: "icon",
          type: "image/png",
          sizes: "32x32",
          href: "/favicon-32x32.png",
        },
        {
          rel: "icon",
          type: "image/png",
          sizes: "16x16",
          href: "/favicon-16x16.png",
        },
        {
          rel: "apple-touch-icon",
          sizes: "512x512",
          href: "/apple-touch-icon.png",
        },
        { rel: "manifest", href: "/site.webmanifest" },
      ],
      meta: [
        {
          name: "description",
          content: "Record your dart games from anywhere.",
        },
        {
          name: "keywords",
          content:
            "dart, darts, fléchettes, game, games, score, scoring, record, throw, throws",
        },
        { property: "og:title", content: "Fléchettes" },
        { property: "og:type", content: "website" },
        { property: "og:url", content: "https://flechettes.flozdra.dev/" },
        {
          property: "og:description",
          content: "Record your dart games from anywhere.",
        },
        {
          property: "og:image",
          content: "https://flechettes.flozdra.dev/og-image.png",
        },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: "Fléchettes" },
        {
          name: "twitter:description",
          content: "Record your dart games from anywhere.",
        },
        {
          name: "twitter:image",
          content: "https://flechettes.flozdra.dev/og-image.png",
        },
        {
          name: "viewport",
          content:
            "width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1.0, user-scalable=no",
        },
      ],
    },
  },
  colorMode: { preference: "dark" },
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },
  modules: ["@nuxt/eslint", "@nuxt/fonts", "@nuxt/icon", "@nuxt/ui"],
  css: ["~/assets/css/main.css"],
  ssr: false,
});

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: true,
  modules: ["@nuxthq/ui", "nuxt-icon", "@vueuse/nuxt"],
  ui: {
    global: true,
    icons: ["heroicons"],
  },
  imports: {
    dirs: ["dto"],
  },
  nitro: {
    imports: {
      dirs: ["dto"],
    },
    experimental: {
      openAPI: true
    }
  },
});

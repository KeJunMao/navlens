// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: true,
  modules: ["@nuxthq/ui", "nuxt-icon", "@vueuse/nuxt", "@vite-pwa/nuxt"],
  ui: {
    global: true,
    icons: ["heroicons"],
    safelistColors: ["primary", "red"],
  },
  imports: {
    dirs: ["dto"],
  },
  nitro: {
    imports: {
      dirs: ["dto"],
    },
    esbuild: {
      options: {
        target: "esnext",
      },
    },
    prerender: {
      routes: ["/_setup"],
    },
  },
  pwa: {
    registerType: "autoUpdate",
    manifest: {
      name: "NavLens",
      short_name: "NavLens",
      theme_color: "#ffffff",
      icons: [
        {
          src: "android-chrome-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "android-chrome-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
        {
          src: "android-chrome-512x512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "any maskable",
        },
      ],
    },
    workbox: {
      globPatterns: ["**/*.{js,css,html,txt,png,ico,svg}"],
      navigateFallbackDenylist: [/^\/api\//],
      navigateFallback: "/",
      cleanupOutdatedCaches: true,
      runtimeCaching: [
        {
          urlPattern: ({ url, request }) =>
            request.method === "GET" && url.pathname.includes("/api/group/"),
          handler: "NetworkFirst",
          options: {
            cacheName: "api-group-cache",
          },
        },
      ],
    },
    registerWebManifestInRouteRules: true,
    writePlugin: true,
  },
});

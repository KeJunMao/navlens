import { defineNuxtModule } from "@nuxt/kit";
import tailwindcssAnimated from 'tailwindcss-animated'

export default defineNuxtModule({
  meta: {
    name: "nuxt-tailwind-typo",
  },
  setup(options, nuxt) {
    // @ts-ignore
    nuxt.hook("tailwindcss:config", function (tailwindConfig) {
      tailwindConfig.plugins.push(tailwindcssAnimated);
    });
  },
});

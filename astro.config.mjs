// @ts-check
import node from "@astrojs/node";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";
import { defineConfig } from "astro/config";
import { componentsStories } from "./src/lib/astro/integrations/components-stories";
import { devOnlyPages } from "./src/lib/astro/integrations/dev-only-pages";
import { pagefind } from "./src/lib/astro/integrations/pagefind";
import { CONFIG } from "./src/utils/constants";

// https://astro.build/config
export default defineConfig({
  adapter: node({
    mode: "standalone",
  }),
  i18n: {
    defaultLocale: CONFIG.LANGUAGES.DEFAULT,
    locales: [...CONFIG.LANGUAGES.AVAILABLE],
  },
  integrations: [
    componentsStories({
      baseSlug: "/design-system/components",
      components: "./src/components",
    }),
    devOnlyPages({ prefix: "_dev_" }),
    icon({
      iconDir: "src/assets/icons",
    }),
    pagefind(),
    sitemap({
      i18n: {
        defaultLocale: CONFIG.LANGUAGES.DEFAULT,
        locales: {
          en: "en-US",
        },
      },
    }),
  ],
  output: "hybrid",
  site: `https://${CONFIG.HOST}`,
  vite: {
    server: {
      watch: {
        ignored: ["**/coverage/**"],
      },
    },
  },
});

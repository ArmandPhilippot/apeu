// @ts-check
import icon from "astro-icon";
import { defineConfig } from "astro/config";
import { componentsStories } from "./src/lib/astro/integrations/components-stories";
import { devOnlyPages } from "./src/lib/astro/integrations/dev-only-pages";

// https://astro.build/config
export default defineConfig({
  integrations: [
    componentsStories({
      baseSlug: "/design-system/components",
      components: "./src/components",
    }),
    devOnlyPages({ prefix: "_dev_" }),
    icon({
      iconDir: "src/assets/icons",
    }),
  ],
  vite: {
    server: {
      watch: {
        ignored: ["**/coverage/**"],
      },
    },
  },
});

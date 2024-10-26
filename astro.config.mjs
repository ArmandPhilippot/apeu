// @ts-check
import { defineConfig } from "astro/config";
import { devOnlyPages } from "./src/lib/astro/integrations/dev-only-pages";

// https://astro.build/config
export default defineConfig({
  integrations: [devOnlyPages({ prefix: "_dev_" })],
  vite: {
    server: {
      watch: {
        ignored: ["**/coverage/**"],
      },
    },
  },
});

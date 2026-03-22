/// <reference types="vitest/config" />
import { getViteConfig } from "astro/config";

export default getViteConfig({
  test: {
    coverage: {
      include: ["src/**.{js,jsx,ts,tsx,astro}"],
      exclude: [
        "src/content.config.ts",
        "src/env.d.ts",
        "src/pages",
        "src/**/*.stories.astro",
        "src/**/*.test.ts",
      ],
    },
    environment: "node",
    globals: false,
    watch: false,
  },
});

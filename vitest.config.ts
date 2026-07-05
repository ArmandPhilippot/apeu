import { getViteConfig } from "astro/config";
import { defaultExclude } from "vitest/config";

export default getViteConfig({
  test: {
    coverage: {
      include: ["src/**/*.{js,jsx,ts,tsx,astro}"],
      exclude: [
        "src/content.config.ts",
        "src/env.d.ts",
        "src/pages",
        "src/**/*.stories.astro",
        "src/**/*.test.ts",
      ],
    },
    environment: "node",
    exclude: [...defaultExclude, "tests/e2e/**"],
    globals: false,
    watch: false,
  },
});

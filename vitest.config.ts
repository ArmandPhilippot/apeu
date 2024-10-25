/// <reference types="vitest/config" />
import { getViteConfig } from "astro/config";

export default getViteConfig({
  test: {
    coverage: {
      include: ["src"],
      exclude: ["src/env.d.ts", "src/pages", "src/**/*.test.ts"],
      extension: [
        ".js",
        ".cjs",
        ".mjs",
        ".ts",
        ".mts",
        ".cts",
        ".tsx",
        ".jsx",
        ".astro",
      ],
    },
    environment: "node",
    globals: false,
    watch: false,
  },
});

import { defineConfig } from "@playwright/test";

const DEFAULT_HOST = "127.0.0.1";
const DEFAULT_PORT = 4321;
const baseURL = `http://${DEFAULT_HOST}:${DEFAULT_PORT}`;

export default defineConfig({
  fullyParallel: true,
  projects: [
    {
      name: "chromium",
      use: {
        browserName: "chromium",
      },
    },
  ],
  outputDir: "playwright/artifacts",
  reporter: [["html", { open: "never", outputFolder: "playwright/report" }]],
  retries: 0,
  testDir: "./tests/e2e",
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  webServer: {
    command: `astro preview --host ${DEFAULT_HOST} --port ${DEFAULT_PORT}`,
    reuseExistingServer: true,
    stderr: "pipe",
    stdout: "ignore",
    url: baseURL,
  },
});

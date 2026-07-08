import { existsSync } from "node:fs";
import { defineConfig } from "@playwright/test";
import {
  SMTP_CATCHER_CONTROL_PORT,
  SMTP_CATCHER_HOST,
  SMTP_CATCHER_SMTP_PORT,
} from "./tests/e2e/utils/smtp-catcher-config.ts";

/* `astro preview` runs the built Node server directly, which reads secrets
 * straight from `process.env` (unlike `astro dev`, it does not load `.env`
 * itself). Locally that file supplies them; in CI they're already set at
 * the workflow level, so there is nothing to load. */
if (existsSync(".env")) process.loadEnvFile(".env");

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
  webServer: [
    {
      command:
        "node --experimental-strip-types tests/e2e/utils/smtp-catcher.ts",
      port: SMTP_CATCHER_CONTROL_PORT,
      reuseExistingServer: true,
      stderr: "pipe",
      stdout: "ignore",
    },
    {
      command: `astro preview --host ${DEFAULT_HOST} --port ${DEFAULT_PORT}`,
      env: {
        /* `env` replaces the inherited process environment rather than
         * merging with it, so `.env` values (e.g. CONTACT_EMAIL) must be
         * spread back in explicitly. */
        ...process.env,
        SMTP_HOST: SMTP_CATCHER_HOST,
        SMTP_PASSWORD: "e2e",
        SMTP_PORT: String(SMTP_CATCHER_SMTP_PORT),
        SMTP_USER: "e2e",
      },
      reuseExistingServer: true,
      stderr: "pipe",
      stdout: "ignore",
      url: baseURL,
    },
  ],
});

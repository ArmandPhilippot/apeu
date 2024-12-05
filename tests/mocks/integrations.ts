import { vi } from "vitest";
import { isObject } from "../../src/utils/type-checks";

export const createAstroBuildDoneMockContext = (
  overrides = {},
): Parameters<Astro.IntegrationHooks["astro:build:done"]>[0] => ({
  assets: new Map(),
  dir: new URL("file:///mock/out"),
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
  } as unknown as Parameters<
    Astro.IntegrationHooks["astro:config:setup"]
  >[0]["logger"],
  pages: [],
  routes: [],
  ...overrides,
});

// cSpell:ignore Codegen

export const createAstroConfigSetupMockContext = (
  overrides = {},
): Parameters<Astro.IntegrationHooks["astro:config:setup"]>[0] => ({
  addClientDirective: vi.fn(),
  addDevToolbarApp: vi.fn(),
  addMiddleware: vi.fn(),
  addRenderer: vi.fn(),
  addWatchFile: vi.fn(),
  command: "dev",
  config: {
    adapter: { name: "@astrojs/node", hooks: {} },
    output: "static",
    build: {
      client: new URL("file:///mock/build/client"),
      assets: "assets",
      concurrency: 0,
      format: "directory",
      inlineStylesheets: "auto",
      redirects: false,
      server: new URL("file:///mock/build/server"),
      serverEntry: "",
    },
    outDir: new URL("file:///mock/out"),
    ...("config" in overrides && isObject(overrides.config)
      ? overrides.config
      : {}),
    root: new URL("file:///mock/build"),
  } as Parameters<Astro.IntegrationHooks["astro:config:setup"]>[0]["config"],
  createCodegenDir: vi.fn(),
  injectRoute: vi.fn(),
  injectScript: vi.fn(),
  isRestart: false,
  logger: {
    error: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
  } as unknown as Parameters<
    Astro.IntegrationHooks["astro:config:setup"]
  >[0]["logger"],
  updateConfig: vi.fn(),
  ...overrides,
});

export const createAstroServerSetupMockContext = (
  overrides = {},
): Parameters<Astro.IntegrationHooks["astro:server:setup"]>[0] => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
  } as unknown as Parameters<
    Astro.IntegrationHooks["astro:config:setup"]
  >[0]["logger"],
  server: {} as unknown as Parameters<
    Astro.IntegrationHooks["astro:server:setup"]
  >[0]["server"],
  toolbar: {
    on: vi.fn(),
    onAppInitialized: vi.fn(),
    onAppToggled: vi.fn(),
    send: vi.fn(),
  },
  ...overrides,
});

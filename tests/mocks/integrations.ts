import { vi } from "vitest";
import type {
  AstroConfig,
  AstroIntegrationLogger,
  HookParameters,
} from "astro";
import { isObject } from "../../src/utils/type-checks";

const logger = {
  error: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
} as unknown as AstroIntegrationLogger;

/**
 * Create a mocked context for the `astro:build:done` hook.
 *
 * @param {object} overrides - An object to override the context.
 * @returns {HookParameters<"astro:build:done">} The hook context.
 */
export const createAstroBuildDoneMockContext = (
  overrides: object = {}
): HookParameters<"astro:build:done"> => {
  return {
    assets: new Map(),
    dir: new URL("file:///mock/out"),
    logger,
    pages: [],
    routes: [],
    ...overrides,
  };
};

// cSpell:ignore Codegen

/**
 * Create a mocked context for the `astro:config:setup` hook.
 *
 * @param {object} overrides - An object to override the context.
 * @returns {HookParameters<"astro:config:setup">} The hook context.
 */
export const createAstroConfigSetupMockContext = (
  overrides: object = {}
): HookParameters<"astro:config:setup"> => {
  return {
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
    } as AstroConfig,
    createCodegenDir: vi.fn(),
    injectRoute: vi.fn(),
    injectScript: vi.fn(),
    isRestart: false,
    logger,
    updateConfig: vi.fn(),
    ...overrides,
  };
};

/**
 * Create a mocked context for the `astro:server:setup` hook.
 *
 * @param {object} overrides - An object to override the context.
 * @returns {HookParameters<"astro:server:setup">} The hook context.
 */
export const createAstroServerSetupMockContext = (
  overrides: object = {}
): HookParameters<"astro:server:setup"> => {
  return {
    logger,

    server: {} as unknown as HookParameters<"astro:server:setup">["server"],
    toolbar: {
      on: vi.fn(),
      onAppInitialized: vi.fn(),
      onAppToggled: vi.fn(),
      send: vi.fn(),
    },
    ...overrides,
  };
};

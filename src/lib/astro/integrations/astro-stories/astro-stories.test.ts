import { globSync } from "tinyglobby";
import type { Plugin as VitePlugin } from "vite";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createAstroConfigSetupMockContext } from "../../../../../tests/mocks/integrations";
import { isKeyExistIn, isObject } from "../../../../utils/type-guards";
import { astroStories } from "./astro-stories";
import type { Stories, StoriesIndex, Story } from "./types/internal";

function createStoryFixture(overrides: Partial<Story> = {}): Story {
  return {
    breadcrumb: [],
    label: "Button",
    path: "/mock/src/components/button.stories.mdx",
    route: "/stories/components/button",
    slug: "components/button",
    type: "story",
    virtualModuleId: "virtual:astro-stories/stories/components/button",
    ...overrides,
  };
}

function createStoriesIndexFixture(
  overrides: Partial<StoriesIndex> = {}
): StoriesIndex {
  return {
    breadcrumb: [],
    children: [],
    label: "Components",
    route: "/stories/components",
    type: "index",
    ...overrides,
  };
}

function createStoriesFixture(): Stories {
  return {
    "components/button": createStoryFixture(),
    components: createStoriesIndexFixture(),
  };
}

vi.mock("tinyglobby", async (importOriginal) => {
  const mod = await importOriginal<typeof import("tinyglobby")>();
  return {
    ...mod,
    globSync: vi.fn().mockReturnValue([]),
  };
});

vi.mock("./utils", async (importOriginal) => {
  const mod = await importOriginal<typeof import("./utils")>();
  return {
    ...mod,
    getStories: vi.fn(createStoriesFixture),
  };
});

/**
 * The shape produced by the integration: Vite 8 object hook form where
 * `resolveId` and `load` are `{ filter, handler }` objects instead of bare
 * functions.
 */
type ResolveIdObjectHook = Extract<
  NonNullable<VitePlugin["resolveId"]>,
  { handler: (...args: never[]) => unknown }
>;

type LoadObjectHook = Extract<
  NonNullable<VitePlugin["load"]>,
  { handler: (...args: never[]) => unknown }
>;

type ObjectHookPlugin = {
  name: VitePlugin["name"];
  resolveId: ResolveIdObjectHook;
  load: LoadObjectHook;
};

type ResolveIdThis = ThisParameterType<ResolveIdObjectHook["handler"]>;
type LoadThis = ThisParameterType<LoadObjectHook["handler"]>;

const isObjectHook = <T extends string>(
  hook: unknown,
  _key: T
): hook is T extends "load" ? LoadObjectHook : ResolveIdObjectHook => {
  if (!isObject(hook)) return false;
  if (!isKeyExistIn(hook, "handler")) return false;
  if (typeof hook.handler !== "function") return false;
  return true;
};

const isObjectHookPlugin = (plugin: unknown): plugin is ObjectHookPlugin => {
  if (!isObject(plugin)) return false;
  if (!isKeyExistIn(plugin, "resolveId") || !isKeyExistIn(plugin, "load")) {
    return false;
  }

  return (
    isObjectHook(plugin.load, "load") &&
    isObjectHook(plugin.resolveId, "resolveId")
  );
};

/**
 * Extract and validate the Vite plugin produced by the integration from an
 * `updateConfig` mock call.
 *
 * @param {ReturnType<typeof createAstroConfigSetupMockContext>} mockContext - The mocked Astro `config:setup` hook context produced by `createAstroConfigSetupMockContext`.
 * @returns {ObjectHookPlugin} The validated Vite 8 plugin.
 * @throws {Error} When the plugin does not match the expected object hook shape.
 */
const getPlugin = (
  mockContext: ReturnType<typeof createAstroConfigSetupMockContext>
): ObjectHookPlugin => {
  const viteConfig = vi.mocked(mockContext.updateConfig).mock.calls[0]?.[0];
  const [plugin] = viteConfig?.vite?.plugins ?? [];

  if (!isObjectHookPlugin(plugin)) {
    throw new Error(
      "Expected a Vite 8 plugin with object hook shape ({ filter, handler })."
    );
  }

  return plugin;
};

const callResolveId = async (plugin: ObjectHookPlugin, id: string) =>
  plugin.resolveId.handler.call({} as ResolveIdThis, id, undefined, {
    isEntry: false,
  });

const callLoad = async (plugin: ObjectHookPlugin, id: string) =>
  plugin.load.handler.call({} as LoadThis, id);

// eslint-disable-next-line @typescript-eslint/no-deprecated -- globSync is the mocked function under test.
const globSyncMock = vi.mocked(globSync);

describe("astro-stories", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("integration shape", () => {
    it("should return an integration with the correct name", () => {
      const integration = astroStories({ base: "/stories" });

      expect(integration.name).toBe("astro-stories");
    });

    it("should expose the astro:config:setup hook", () => {
      const integration = astroStories({ base: "/stories" });

      expect(integration.hooks).toHaveProperty("astro:config:setup");
    });

    it("should do nothing when command is not 'dev'", async () => {
      expect.assertions(1);

      const integration = astroStories({ base: "/stories" });
      const mockContext = createAstroConfigSetupMockContext({
        command: "build",
      });

      if (integration.hooks["astro:config:setup"] !== undefined) {
        await integration.hooks["astro:config:setup"](mockContext);
      }

      expect(mockContext.updateConfig).not.toHaveBeenCalled();
    });
  });

  describe("route injection", () => {
    it("should inject a catch-all route under the base path", async () => {
      expect.assertions(1);

      const integration = astroStories({ base: "/stories" });
      const mockContext = createAstroConfigSetupMockContext();

      if (integration.hooks["astro:config:setup"] !== undefined) {
        await integration.hooks["astro:config:setup"](mockContext);
      }

      expect(mockContext.injectRoute).toHaveBeenCalledWith({
        pattern: "/stories/[...story]",
        entrypoint: expect.any(URL),
      });
    });

    it("should use the sanitized base in the injected route pattern", async () => {
      expect.assertions(1);

      const integration = astroStories({ base: "/docs/" });
      const mockContext = createAstroConfigSetupMockContext();

      if (integration.hooks["astro:config:setup"] !== undefined) {
        await integration.hooks["astro:config:setup"](mockContext);
      }

      expect(mockContext.injectRoute).toHaveBeenCalledWith(
        expect.objectContaining({ pattern: "/docs/[...story]" })
      );
    });
  });

  describe("base path sanitization", () => {
    it("should add a leading slash when missing and warn", async () => {
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory.
      expect.assertions(2);

      const integration = astroStories({ base: "stories" });
      const mockContext = createAstroConfigSetupMockContext();

      if (integration.hooks["astro:config:setup"] !== undefined) {
        await integration.hooks["astro:config:setup"](mockContext);
      }

      expect(mockContext.logger.warn).toHaveBeenCalledWith(
        "The base option should start with a leading slash, received: stories. Please check the syntax in your config file."
      );
      expect(mockContext.injectRoute).toHaveBeenCalledWith(
        expect.objectContaining({ pattern: "/stories/[...story]" })
      );
    });

    it("should remove a trailing slash when present and warn", async () => {
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory.
      expect.assertions(2);

      const integration = astroStories({ base: "/stories/" });
      const mockContext = createAstroConfigSetupMockContext();

      if (integration.hooks["astro:config:setup"] !== undefined) {
        await integration.hooks["astro:config:setup"](mockContext);
      }

      expect(mockContext.logger.warn).toHaveBeenCalledWith(
        "The base option shouldn't end with a trailing slash, received: /stories/. Please check the syntax in your config file."
      );
      expect(mockContext.injectRoute).toHaveBeenCalledWith(
        expect.objectContaining({ pattern: "/stories/[...story]" })
      );
    });

    it("should not warn for a properly formatted base path", async () => {
      expect.assertions(1);

      const integration = astroStories({ base: "/stories" });
      const mockContext = createAstroConfigSetupMockContext();

      if (integration.hooks["astro:config:setup"] !== undefined) {
        await integration.hooks["astro:config:setup"](mockContext);
      }

      expect(mockContext.logger.warn).not.toHaveBeenCalled();
    });
  });

  describe("vite plugin", () => {
    it("should register a plugin with the correct name", async () => {
      expect.assertions(1);

      const integration = astroStories({ base: "/stories" });
      const mockContext = createAstroConfigSetupMockContext();

      if (integration.hooks["astro:config:setup"] !== undefined) {
        await integration.hooks["astro:config:setup"](mockContext);
      }

      expect(mockContext.updateConfig).toHaveBeenCalledWith({
        vite: {
          plugins: [
            expect.objectContaining({ name: "vite-plugin-astro-stories" }),
          ],
        },
      });
    });

    it("should use the Vite 8 object hook shape for resolveId and load", async () => {
      expect.assertions(1);

      const integration = astroStories({ base: "/stories" });
      const mockContext = createAstroConfigSetupMockContext();

      if (integration.hooks["astro:config:setup"] !== undefined) {
        await integration.hooks["astro:config:setup"](mockContext);
      }

      expect(mockContext.updateConfig).toHaveBeenCalledWith({
        vite: {
          plugins: [
            expect.objectContaining({
              resolveId: expect.objectContaining({
                handler: expect.any(Function),
              }),
              load: expect.objectContaining({
                handler: expect.any(Function),
              }),
            }),
          ],
        },
      });
    });
  });

  describe("resolveId handler", () => {
    it("should resolve virtual:astro-stories/config", async () => {
      expect.assertions(1);

      const integration = astroStories({ base: "/stories" });
      const mockContext = createAstroConfigSetupMockContext();

      if (integration.hooks["astro:config:setup"] !== undefined) {
        await integration.hooks["astro:config:setup"](mockContext);
      }

      const plugin = getPlugin(mockContext);

      await expect(
        callResolveId(plugin, "virtual:astro-stories/config")
      ).resolves.toBe("\0virtual:astro-stories/config");
    });

    it("should resolve virtual:astro-stories/Layout", async () => {
      expect.assertions(1);

      const integration = astroStories({ base: "/stories" });
      const mockContext = createAstroConfigSetupMockContext();

      if (integration.hooks["astro:config:setup"] !== undefined) {
        await integration.hooks["astro:config:setup"](mockContext);
      }

      const plugin = getPlugin(mockContext);

      await expect(
        callResolveId(plugin, "virtual:astro-stories/Layout")
      ).resolves.toBe("\0virtual:astro-stories/Layout");
    });

    it("should resolve virtual:astro-stories/registry", async () => {
      expect.assertions(1);

      const integration = astroStories({ base: "/stories" });
      const mockContext = createAstroConfigSetupMockContext();

      if (integration.hooks["astro:config:setup"] !== undefined) {
        await integration.hooks["astro:config:setup"](mockContext);
      }

      const plugin = getPlugin(mockContext);

      await expect(
        callResolveId(plugin, "virtual:astro-stories/registry")
      ).resolves.toBe("\0virtual:astro-stories/registry");
    });

    it("should resolve virtual module ids for story files", async () => {
      expect.assertions(1);

      const integration = astroStories({ base: "/stories" });
      const mockContext = createAstroConfigSetupMockContext();

      if (integration.hooks["astro:config:setup"] !== undefined) {
        await integration.hooks["astro:config:setup"](mockContext);
      }

      const plugin = getPlugin(mockContext);

      await expect(
        callResolveId(plugin, "virtual:astro-stories/stories/components/button")
      ).resolves.toBe("\0virtual:astro-stories/stories/components/button");
    });

    it("should return null for unknown module ids", async () => {
      expect.assertions(1);

      const integration = astroStories({ base: "/stories" });
      const mockContext = createAstroConfigSetupMockContext();

      if (integration.hooks["astro:config:setup"] !== undefined) {
        await integration.hooks["astro:config:setup"](mockContext);
      }

      const plugin = getPlugin(mockContext);

      await expect(
        callResolveId(plugin, "some-other-module")
      ).resolves.toBeNull();
    });
  });

  describe("load handler", () => {
    it("should load the config module with base and stories exports", async () => {
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory.
      expect.assertions(2);

      const integration = astroStories({ base: "/stories" });
      const mockContext = createAstroConfigSetupMockContext();

      if (integration.hooks["astro:config:setup"] !== undefined) {
        await integration.hooks["astro:config:setup"](mockContext);
      }

      const plugin = getPlugin(mockContext);
      const content = await callLoad(plugin, "\0virtual:astro-stories/config");

      expect(content).toContain("export const base");
      expect(content).toContain("export const stories");
    });

    it("should load the default Layout module pointing to story-layout.astro", async () => {
      expect.assertions(1);

      const integration = astroStories({ base: "/stories" });
      const mockContext = createAstroConfigSetupMockContext();

      if (integration.hooks["astro:config:setup"] !== undefined) {
        await integration.hooks["astro:config:setup"](mockContext);
      }

      const plugin = getPlugin(mockContext);
      const content = await callLoad(plugin, "\0virtual:astro-stories/Layout");

      expect(content).toContain("story-layout.astro");
    });

    it("should load a custom Layout module when layout is provided", async () => {
      expect.assertions(1);

      const integration = astroStories({
        base: "/stories",
        layout: "./custom-layout.astro",
      });
      const mockContext = createAstroConfigSetupMockContext();

      if (integration.hooks["astro:config:setup"] !== undefined) {
        await integration.hooks["astro:config:setup"](mockContext);
      }

      const plugin = getPlugin(mockContext);
      const content = await callLoad(plugin, "\0virtual:astro-stories/Layout");

      expect(content).toContain("custom-layout.astro");
    });

    it("should load the registry module with story imports and storyRegistry export", async () => {
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory.
      expect.assertions(2);

      const integration = astroStories({ base: "/stories" });
      const mockContext = createAstroConfigSetupMockContext();

      if (integration.hooks["astro:config:setup"] !== undefined) {
        await integration.hooks["astro:config:setup"](mockContext);
      }

      const plugin = getPlugin(mockContext);
      const content = await callLoad(
        plugin,
        "\0virtual:astro-stories/registry"
      );

      expect(content).toContain(
        `import * as story0 from "virtual:astro-stories/stories/components/button"`
      );
      expect(content).toContain("export const storyRegistry");
    });

    it("should exclude index stories from the registry module", async () => {
      expect.assertions(1);

      const integration = astroStories({ base: "/stories" });
      const mockContext = createAstroConfigSetupMockContext();

      if (integration.hooks["astro:config:setup"] !== undefined) {
        await integration.hooks["astro:config:setup"](mockContext);
      }

      const plugin = getPlugin(mockContext);
      const content = await callLoad(
        plugin,
        "\0virtual:astro-stories/registry"
      );

      // The "components" entry has type "index" and must not appear as an import.
      expect(content).not.toContain(`"components"`);
    });

    it("should load a story virtual module with re-exports from the MDX file", async () => {
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory.
      expect.assertions(3);

      const integration = astroStories({ base: "/stories" });
      const mockContext = createAstroConfigSetupMockContext();

      if (integration.hooks["astro:config:setup"] !== undefined) {
        await integration.hooks["astro:config:setup"](mockContext);
      }

      const plugin = getPlugin(mockContext);
      const content = await callLoad(
        plugin,
        "\0virtual:astro-stories/stories/components/button"
      );

      expect(content).toContain("export const frontmatter");
      expect(content).toContain("export const Content");
      expect(content).toContain("button.stories.mdx");
    });

    it("should return null for unknown module ids", async () => {
      expect.assertions(1);

      const integration = astroStories({ base: "/stories" });
      const mockContext = createAstroConfigSetupMockContext();

      if (integration.hooks["astro:config:setup"] !== undefined) {
        await integration.hooks["astro:config:setup"](mockContext);
      }

      const plugin = getPlugin(mockContext);

      await expect(callLoad(plugin, "\0some-other-module")).resolves.toBeNull();
    });
  });

  describe("glob patterns", () => {
    it("should use default patterns when none are specified", async () => {
      expect.assertions(1);

      const integration = astroStories({ base: "/stories" });
      const mockContext = createAstroConfigSetupMockContext();

      if (integration.hooks["astro:config:setup"] !== undefined) {
        await integration.hooks["astro:config:setup"](mockContext);
      }

      expect(globSyncMock).toHaveBeenCalledWith(
        ["**/*.stories.mdx", "**/stories/**/*.mdx"],
        expect.any(Object)
      );
    });

    it("should use custom patterns when provided", async () => {
      expect.assertions(1);

      const integration = astroStories({
        base: "/stories",
        patterns: ["src/**/*.stories.mdx"],
      });
      const mockContext = createAstroConfigSetupMockContext();

      if (integration.hooks["astro:config:setup"] !== undefined) {
        await integration.hooks["astro:config:setup"](mockContext);
      }

      expect(globSyncMock).toHaveBeenCalledWith(
        ["src/**/*.stories.mdx"],
        expect.any(Object)
      );
    });
  });

  describe("file filtering", () => {
    it("should warn about non-MDX files and ignore them", async () => {
      expect.assertions(1);

      globSyncMock.mockReturnValue([
        "invalid/file.astro",
        "another/unsupported/file.txt",
      ]);

      const integration = astroStories({ base: "/stories" });
      const mockContext = createAstroConfigSetupMockContext();

      if (integration.hooks["astro:config:setup"] !== undefined) {
        await integration.hooks["astro:config:setup"](mockContext);
      }

      expect(mockContext.logger.warn).toHaveBeenCalledWith(
        `Found 2 non-MDX files that will be ignored because unsupported. Received:\ninvalid/file.astro\nanother/unsupported/file.txt\n\nPlease check your glob patterns.`
      );
    });
  });
});

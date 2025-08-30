import { describe, it, expect, vi, beforeEach } from "vitest";
import { createAstroConfigSetupMockContext } from "../../../../../tests/mocks/integrations";
import { isKeyExistIn, isObject } from "../../../../utils/type-guards";
import { astroStories } from "./astro-stories";

vi.mock("./utils", () => {
  return {
    getStories: vi.fn(() => {
      return {
        example: { type: "story", route: "/stories/example" },
        components: {
          type: "index",
          route: "/stories/components",
          children: [],
        },
      };
    }),
  };
});

vi.mock("../../../../utils/type-guards", async (importOriginal) => {
  const mod =
    await importOriginal<typeof import("../../../../utils/type-guards")>();
  return {
    ...mod,
    isString: vi.fn(
      (value: unknown): value is string => typeof value === "string"
    ),
  };
});

describe("astro-stories", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("basic integration setup", () => {
    it("should return an integration object with correct name", () => {
      const integration = astroStories({ base: "/stories" });

      expect(integration.name).toBe("astro-stories");
      expect(integration.hooks).toHaveProperty("astro:config:setup");
    });

    it("should inject route with correct pattern", async () => {
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

    it("should configure vite plugin", async () => {
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
              name: "vite-plugin-astro-stories",
              resolveId: expect.any(Function),
              load: expect.any(Function),
            }),
          ],
        },
      });
    });
  });

  describe("base path sanitization", () => {
    it("should add leading slash if missing", async () => {
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
        expect.objectContaining({
          pattern: "/stories/[...story]",
        })
      );
    });

    it("should remove trailing slash if present", async () => {
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
        expect.objectContaining({
          pattern: "/stories/[...story]",
        })
      );
    });

    it("should not warn for properly formatted base", async () => {
      expect.assertions(1);

      const integration = astroStories({ base: "/stories" });
      const mockContext = createAstroConfigSetupMockContext();

      if (integration.hooks["astro:config:setup"] !== undefined) {
        await integration.hooks["astro:config:setup"](mockContext);
      }

      expect(mockContext.logger.warn).not.toHaveBeenCalled();
    });
  });

  describe("configuration options", () => {
    it("should use default patterns when not provided", async () => {
      expect.assertions(1);

      const { getStories } = vi.mocked(await import("./utils"));

      const integration = astroStories({ base: "/stories" });
      const mockContext = createAstroConfigSetupMockContext();

      if (integration.hooks["astro:config:setup"] !== undefined) {
        await integration.hooks["astro:config:setup"](mockContext);
      }

      expect(getStories).toHaveBeenCalledWith(
        expect.objectContaining({
          patterns: ["**/*"],
        })
      );
    });

    it("should use custom patterns when provided", async () => {
      expect.assertions(1);

      const { getStories } = vi.mocked(await import("./utils"));

      const integration = astroStories({
        base: "/stories",
        patterns: ["components/**/*", "pages/**/*"],
      });
      const mockContext = createAstroConfigSetupMockContext();

      if (integration.hooks["astro:config:setup"] !== undefined) {
        await integration.hooks["astro:config:setup"](mockContext);
      }

      expect(getStories).toHaveBeenCalledWith(
        expect.objectContaining({
          patterns: ["components/**/*", "pages/**/*"],
        })
      );
    });

    it("should handle custom base path in route injection", async () => {
      expect.assertions(1);

      const integration = astroStories({ base: "/docs" });
      const mockContext = createAstroConfigSetupMockContext();

      if (integration.hooks["astro:config:setup"] !== undefined) {
        await integration.hooks["astro:config:setup"](mockContext);
      }

      expect(mockContext.injectRoute).toHaveBeenCalledWith({
        pattern: "/docs/[...story]",
        entrypoint: expect.any(URL),
      });
    });
  });

  describe("virtual modules", () => {
    it("should create virtual modules for config and layout", async () => {
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory.
      expect.assertions(4);

      const integration = astroStories({ base: "/stories" });
      const mockContext = createAstroConfigSetupMockContext();

      if (integration.hooks["astro:config:setup"] !== undefined) {
        await integration.hooks["astro:config:setup"](mockContext);
      }

      const viteConfig = vi.mocked(mockContext.updateConfig).mock.calls[0]?.[0];
      const [plugin] = viteConfig?.vite?.plugins ?? [];

      if (
        !isObject(plugin) ||
        (!isKeyExistIn(plugin, "resolveId") && !isKeyExistIn(plugin, "load"))
      ) {
        throw new Error("Received an unexpected plugin.");
      }

      const { load, resolveId } = plugin;

      if (typeof load !== "function" || typeof resolveId !== "function") {
        throw new TypeError("Unexpected plugin methods.");
      }

      expect(resolveId("virtual:astro-stories/config")).toBe(
        "\0virtual:astro-stories/config"
      );
      expect(load("\0virtual:astro-stories/config")).toContain(
        "export const stories"
      );
      expect(resolveId("virtual:astro-stories/Layout")).toBe(
        "\0virtual:astro-stories/Layout"
      );
      expect(load("\0virtual:astro-stories/Layout")).toContain(
        "export { default }"
      );
    });

    it("should return null for unknown virtual module ids", async () => {
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory.
      expect.assertions(2);

      const integration = astroStories({ base: "/stories" });
      const mockContext = createAstroConfigSetupMockContext();

      if (integration.hooks["astro:config:setup"] !== undefined) {
        await integration.hooks["astro:config:setup"](mockContext);
      }

      const viteConfig = vi.mocked(mockContext.updateConfig).mock.calls[0]?.[0];
      const [plugin] = viteConfig?.vite?.plugins ?? [];

      if (
        !isObject(plugin) ||
        (!isKeyExistIn(plugin, "resolveId") && !isKeyExistIn(plugin, "load"))
      ) {
        throw new Error("Received an unexpected plugin.");
      }

      const { load, resolveId } = plugin;

      if (typeof load !== "function" || typeof resolveId !== "function") {
        throw new TypeError("Unexpected plugin methods.");
      }

      expect(resolveId("some-other-module")).toBe(null);
      expect(load("\0some-other-module")).toBe(null);
    });
  });

  describe("layout handling", () => {
    it("should use default layout when none provided", async () => {
      expect.assertions(1);

      const integration = astroStories({ base: "/stories" });
      const mockContext = createAstroConfigSetupMockContext();

      if (integration.hooks["astro:config:setup"] !== undefined) {
        await integration.hooks["astro:config:setup"](mockContext);
      }

      const viteConfig = vi.mocked(mockContext.updateConfig).mock.calls[0]?.[0];
      const [plugin] = viteConfig?.vite?.plugins ?? [];

      if (!isObject(plugin) || !isKeyExistIn(plugin, "load")) {
        throw new Error("Received an unexpected plugin.");
      }

      const { load } = plugin;

      if (typeof load !== "function") {
        throw new TypeError("Unexpected plugin methods.");
      }

      const layoutModule = load("\0virtual:astro-stories/Layout");

      expect(layoutModule).toContain("components/story-layout.astro");
    });

    it("should use custom layout when provided", async () => {
      expect.assertions(1);

      const integration = astroStories({
        base: "/stories",
        layout: "./custom-layout.astro",
      });
      const mockContext = createAstroConfigSetupMockContext();

      if (integration.hooks["astro:config:setup"] !== undefined) {
        await integration.hooks["astro:config:setup"](mockContext);
      }

      const viteConfig = vi.mocked(mockContext.updateConfig).mock.calls[0]?.[0];
      const [plugin] = viteConfig?.vite?.plugins ?? [];

      if (!isObject(plugin) || !isKeyExistIn(plugin, "load")) {
        throw new Error("Received an unexpected plugin.");
      }

      const { load } = plugin;

      if (typeof load !== "function") {
        throw new TypeError("Unexpected plugin methods.");
      }

      const layoutModule = load("\0virtual:astro-stories/Layout");

      expect(layoutModule).toContain("custom-layout.astro");
    });
  });
});

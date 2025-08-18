import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { globbySync } from "globby";
import slash from "slash";
import { describe, expect, it, vi } from "vitest";
import { createAstroConfigSetupMockContext } from "../../../../tests/mocks/integrations";
import { STORIES_EXT } from "../../../utils/constants";
import { getStoryRoute } from "../../../utils/stories";
import { componentsStories } from "./components-stories";

vi.mock("globby", () => {
  return {
    globbySync: vi.fn(),
  };
});

vi.mock("../../../utils/stories", async (importOriginal) => {
  const mod = await importOriginal<typeof import("../../../utils/stories")>();
  return {
    ...mod,
    getStoryRoute: vi.fn(),
  };
});

describe("components-stories", () => {
  it("should return an Astro integration", () => {
    const integration = componentsStories({
      components: "./path/to/components",
    });

    expect(integration.hooks["astro:config:setup"]).toBeDefined();
    expect(integration.name).toBe("components-stories");
  });

  describe("astro:config:setup hook", () => {
    it("should do nothing in non-dev command", () => {
      const integration = componentsStories({
        components: "./path/to/components",
      });
      const mockContext = createAstroConfigSetupMockContext({
        command: "build",
      });

      integration.hooks["astro:config:setup"](mockContext);

      expect(mockContext.logger.info).not.toHaveBeenCalled();
    });

    it("should call globbySync with the correct arguments and map story paths to routes", () => {
      const mockStoryPaths = [
        "Button/Button.stories.astro",
        "Input/Input.stories.astro",
      ];
      const mockRoutes = ["/button", "/input"] as const;

      vi.mocked(globbySync).mockReturnValue(mockStoryPaths);
      vi.mocked(getStoryRoute)
        .mockReturnValueOnce(mockRoutes[0])
        .mockReturnValueOnce(mockRoutes[1]);

      const integration = componentsStories({
        components: "./src/components",
      });
      const mockContext = createAstroConfigSetupMockContext();

      integration.hooks["astro:config:setup"](mockContext);

      expect(globbySync).toHaveBeenCalledWith(`**/*.${STORIES_EXT}`, {
        cwd: new URL("./src/components", mockContext.config.root),
      });
      /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
      expect(getStoryRoute).toHaveBeenCalledTimes(2);
      expect(getStoryRoute).toHaveBeenNthCalledWith(1, mockStoryPaths[0]);
      /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
      expect(getStoryRoute).toHaveBeenNthCalledWith(2, mockStoryPaths[1]);
    });

    it("should inject the correct routes for stories", () => {
      const mockStoryPaths = [
        "Button/Button.stories.astro",
        "Input/Input.stories.astro",
      ];
      const mockRoutes = ["/button", "/input"] as const;

      vi.mocked(globbySync).mockReturnValue(mockStoryPaths);
      vi.mocked(getStoryRoute)
        .mockReturnValueOnce(mockRoutes[0])
        .mockReturnValueOnce(mockRoutes[1]);

      const integration = componentsStories({
        components: "./src/components",
      });
      const mockContext = createAstroConfigSetupMockContext();

      integration.hooks["astro:config:setup"](mockContext);

      const expectedEntrypoints = mockStoryPaths.map((path) =>
        slash(
          join(
            fileURLToPath(new URL("./src/components", mockContext.config.root)),
            path
          )
        )
      );

      /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
      expect(mockContext.injectRoute).toHaveBeenCalledTimes(2);
      expect(mockContext.injectRoute).toHaveBeenNthCalledWith(1, {
        entrypoint: expectedEntrypoints[0],
        pattern: mockRoutes[0],
      });
      /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
      expect(mockContext.injectRoute).toHaveBeenNthCalledWith(2, {
        entrypoint: expectedEntrypoints[1],
        pattern: mockRoutes[1],
      });
    });

    it("should log the number of stories found", () => {
      const mockStoryPaths = [
        "Button/Button.stories.astro",
        "Input/Input.stories.astro",
      ];

      vi.mocked(globbySync).mockReturnValue(mockStoryPaths);

      const integration = componentsStories({
        components: "./src/components",
      });
      const mockContext = createAstroConfigSetupMockContext();

      integration.hooks["astro:config:setup"](mockContext);

      expect(mockContext.logger.info).toHaveBeenCalledWith(
        expect.stringContaining("Found 2 stories.")
      );
    });

    it("should support baseSlug configuration", () => {
      const mockStoryPaths = ["Button/Button.stories.astro"];
      const mockRoute = "/button";
      const baseSlug = "/design-system";

      vi.mocked(globbySync).mockReturnValue(mockStoryPaths);
      vi.mocked(getStoryRoute).mockReturnValue(mockRoute);

      const integration = componentsStories({
        components: "./src/components",
        baseSlug,
      });
      const mockContext = createAstroConfigSetupMockContext();

      integration.hooks["astro:config:setup"](mockContext);

      expect(mockContext.injectRoute).toHaveBeenCalledWith({
        entrypoint: expect.any(String),
        pattern: `${baseSlug}${mockRoute}`,
      });
    });

    it("should not log stories when logStories is false", () => {
      const mockStoryPaths = ["Button/Button.stories.astro"];

      vi.mocked(globbySync).mockReturnValue(mockStoryPaths);
      vi.mocked(getStoryRoute).mockReturnValue("/button");

      const integration = componentsStories({
        components: "./src/components",
        logStories: false,
      });
      const mockContext = createAstroConfigSetupMockContext();

      integration.hooks["astro:config:setup"](mockContext);

      expect(mockContext.logger.info).toHaveBeenCalledWith(
        expect.stringContaining("Found 1 story.")
      );
      expect(mockContext.logger.info).not.toHaveBeenCalledWith(
        expect.stringContaining("\n")
      );
    });

    it("should log stories when logStories is true", () => {
      const mockStoryPaths = ["Button/Button.stories.astro"];
      const mockRoute = "/button";

      vi.mocked(globbySync).mockReturnValue(mockStoryPaths);
      vi.mocked(getStoryRoute).mockReturnValue(mockRoute);

      const integration = componentsStories({
        components: "./src/components",
        logStories: true,
      });
      const mockContext = createAstroConfigSetupMockContext();

      integration.hooks["astro:config:setup"](mockContext);

      expect(mockContext.logger.info).toHaveBeenCalledWith(
        expect.stringContaining(`Found 1 story:`)
      );
      expect(mockContext.logger.info).toHaveBeenCalledWith(
        expect.stringContaining(`- ${mockRoute}`)
      );
    });
  });
});

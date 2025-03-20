import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { globbySync } from "globby";
import slash from "slash";
import { describe, expect, it, vi } from "vitest";
import { createAstroConfigSetupMockContext } from "../../../../tests/mocks/integrations";
import { devOnlyPages } from "./dev-only-pages";

vi.mock("globby", () => {
  return {
    globbySync: vi.fn(),
  };
});

describe("dev-only-pages", () => {
  it("should return an Astro integration", () => {
    const integration = devOnlyPages({ prefix: "__foo" });

    expect(integration.hooks["astro:config:setup"]).toBeDefined();
    expect(integration.name).toBe("dev-only-pages");
  });

  describe("astro:config:setup hook", () => {
    it("should do nothing in non-dev command", () => {
      const integration = devOnlyPages({ prefix: "__foo" });
      const mockContext = createAstroConfigSetupMockContext({
        command: "build",
      });

      integration.hooks["astro:config:setup"](mockContext);

      expect(mockContext.logger.info).not.toHaveBeenCalled();
    });

    it("should log an error for invalid prefix", () => {
      const integration = devOnlyPages({ prefix: "invalid" });
      const mockContext = createAstroConfigSetupMockContext();

      integration.hooks["astro:config:setup"](mockContext);

      expect(mockContext.logger.error).toHaveBeenCalledWith(
        "The dev-only pages prefix must start with an underscore (`_`) and its length must be equal to or greater than 2."
      );
    });

    it("should find and inject routes for valid dev-only pages", () => {
      const mockPages = [
        "__foo/page1.astro",
        "__foo/page2/index.astro",
      ] as const;
      const prefix = "__foo";

      vi.mocked(globbySync).mockReturnValue([...mockPages]);

      const integration = devOnlyPages({ prefix });
      const mockContext = createAstroConfigSetupMockContext();

      integration.hooks["astro:config:setup"](mockContext);

      expect(globbySync).toHaveBeenCalledWith(
        [
          `**/${prefix}*.astro`,
          `**/${prefix}*/**/*.astro`,
          `!**/${prefix}*/**/_*.astro`,
        ],
        { cwd: new URL("./src/pages", mockContext.config.root) }
      );

      /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
      expect(mockContext.injectRoute).toHaveBeenCalledTimes(2);
      expect(mockContext.injectRoute).toHaveBeenCalledWith({
        entrypoint: slash(
          join(
            fileURLToPath(new URL("./src/pages", mockContext.config.root)),
            mockPages[0]
          )
        ),
        pattern: "/page1",
      });
      expect(mockContext.injectRoute).toHaveBeenCalledWith({
        entrypoint: slash(
          join(
            fileURLToPath(new URL("./src/pages", mockContext.config.root)),
            mockPages[1]
          )
        ),
        pattern: "/page2", // `/index` should be removed
      });

      expect(mockContext.logger.info).toHaveBeenCalledWith(
        expect.stringContaining("Found 2 dev-only routes.")
      );
    });

    it("should log the routes list if logPages is true", () => {
      const mockPages = ["__foo/page1.astro"];
      const prefix = "__foo";

      vi.mocked(globbySync).mockReturnValue(mockPages);

      const integration = devOnlyPages({ prefix, logPages: true });
      const mockContext = createAstroConfigSetupMockContext();

      integration.hooks["astro:config:setup"](mockContext);

      expect(mockContext.logger.info).toHaveBeenCalledWith(
        "Found 1 dev-only route:\n- /page1"
      );
    });

    it("should handle an empty pages directory gracefully", () => {
      vi.mocked(globbySync).mockReturnValue([]);

      const integration = devOnlyPages({ prefix: "__foo" });
      const mockContext = createAstroConfigSetupMockContext();

      integration.hooks["astro:config:setup"](mockContext);

      expect(mockContext.injectRoute).not.toHaveBeenCalled();
      expect(mockContext.logger.info).toHaveBeenCalledWith(
        "Found 0 dev-only routes."
      );
    });
  });
});

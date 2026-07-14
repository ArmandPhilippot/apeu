import type { PagefindIndex } from "pagefind";
import { describe, expect, it, vi } from "vitest";
import {
  createAstroBuildDoneMockContext,
  createAstroConfigSetupMockContext,
  createAstroServerSetupMockContext,
} from "../../../../../tests/mocks/integrations";
import { pagefindSearch } from "./pagefind";

vi.mock("node:fs/promises", () => {
  return {
    access: vi.fn(),
  };
});

vi.mock("pagefind", () => {
  return {
    createIndex: vi.fn(),
    close: vi.fn(),
  };
});

describe("pagefind", () => {
  it("should return an Astro integration", () => {
    const integration = pagefindSearch();

    expect(integration.hooks["astro:config:setup"]).toBeDefined();
    expect(integration.hooks["astro:server:setup"]).toBeDefined();
    expect(integration.hooks["astro:build:done"]).toBeDefined();
    expect(integration.name).toBe("pagefind");
  });

  describe("astro:config:setup hook", () => {
    it("should do nothing in non-dev command", async () => {
      expect.assertions(1);

      const integration = pagefindSearch();
      const mockContext = createAstroConfigSetupMockContext({
        command: "build",
      });

      await integration.hooks["astro:config:setup"](mockContext);

      expect(mockContext.logger.info).not.toHaveBeenCalled();
    });

    it("should log info when pagefind directory is accessible", async () => {
      expect.assertions(1);

      const { access } = await import("node:fs/promises");
      vi.mocked(access).mockResolvedValueOnce();

      const integration = pagefindSearch();
      const mockContext = createAstroConfigSetupMockContext();

      await integration.hooks["astro:config:setup"](mockContext);

      expect(mockContext.logger.info).toHaveBeenCalledWith(
        "Search index found!"
      );
    });

    it("should log warning when pagefind directory is not accessible", async () => {
      expect.assertions(1);

      const { access } = await import("node:fs/promises");
      vi.mocked(access).mockRejectedValue(new Error("Not found"));

      const integration = pagefindSearch();
      const mockContext = createAstroConfigSetupMockContext();

      await integration.hooks["astro:config:setup"](mockContext);

      expect(mockContext.logger.warn).toHaveBeenCalledWith(
        expect.stringContaining("You need to run `pnpm build`")
      );
    });
  });

  describe("astro:server:setup hook", () => {
    it("should warn if outDir is not set", () => {
      expect.assertions(1);

      const integration = pagefindSearch();
      const mockContext = createAstroServerSetupMockContext();

      integration.hooks["astro:server:setup"](mockContext);

      expect(mockContext.logger.warn).toHaveBeenCalledWith(
        expect.stringContaining("Couldn't determine Pagefind output directory")
      );
    });
  });

  describe("astro:build:done hook", () => {
    it("should index the output directory", async () => {
      expect.assertions(1);

      const pagefind = await import("pagefind");
      const addDirectory = vi.fn().mockResolvedValue({ errors: [] });
      const writeFiles = vi.fn().mockResolvedValue({ errors: [] });
      vi.mocked(pagefind.createIndex).mockResolvedValue({
        errors: [],
        index: { addDirectory, writeFiles } as unknown as PagefindIndex,
      });

      const integration = pagefindSearch();
      const mockContext = createAstroBuildDoneMockContext();

      await integration.hooks["astro:build:done"](mockContext);

      expect(addDirectory).toHaveBeenCalledWith({ path: "/mock/out/" });
    });

    it("should write the search index using the Node.js API", async () => {
      expect.assertions(1);

      const pagefind = await import("pagefind");
      const addDirectory = vi.fn().mockResolvedValue({ errors: [] });
      const writeFiles = vi.fn().mockResolvedValue({ errors: [] });
      vi.mocked(pagefind.createIndex).mockResolvedValue({
        errors: [],
        index: { addDirectory, writeFiles } as unknown as PagefindIndex,
      });

      const integration = pagefindSearch();
      const mockContext = createAstroBuildDoneMockContext();

      await integration.hooks["astro:build:done"](mockContext);

      expect(writeFiles).toHaveBeenCalledWith({
        outputPath: "/mock/out/pagefind/",
      });
    });

    it("should close the Pagefind service once the index is built", async () => {
      expect.assertions(1);

      const pagefind = await import("pagefind");
      const addDirectory = vi.fn().mockResolvedValue({ errors: [] });
      const writeFiles = vi.fn().mockResolvedValue({ errors: [] });
      vi.mocked(pagefind.createIndex).mockResolvedValue({
        errors: [],
        index: { addDirectory, writeFiles } as unknown as PagefindIndex,
      });

      const integration = pagefindSearch();
      const mockContext = createAstroBuildDoneMockContext();

      await integration.hooks["astro:build:done"](mockContext);

      expect(pagefind.close).toHaveBeenCalledWith();
    });

    it("should throw when the index cannot be created", async () => {
      expect.assertions(1);

      const pagefind = await import("pagefind");
      vi.mocked(pagefind.createIndex).mockResolvedValue({
        errors: ["boom"],
      });

      const integration = pagefindSearch();
      const mockContext = createAstroBuildDoneMockContext();

      await expect(
        integration.hooks["astro:build:done"](mockContext)
      ).rejects.toThrow("Failed to build the search index.");
    });

    it("should always close the Pagefind service, even on failure", async () => {
      expect.assertions(1);

      const pagefind = await import("pagefind");
      vi.mocked(pagefind.createIndex).mockResolvedValue({
        errors: ["boom"],
      });

      const integration = pagefindSearch();
      const mockContext = createAstroBuildDoneMockContext();

      await integration.hooks["astro:build:done"](mockContext).catch(() => undefined);

      expect(pagefind.close).toHaveBeenCalledWith();
    });
  });
});

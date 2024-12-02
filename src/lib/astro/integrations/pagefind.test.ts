import { type ChildProcess, spawn } from "node:child_process";
import { describe, expect, it, vi } from "vitest";
import {
  createAstroBuildDoneMockContext,
  createAstroConfigSetupMockContext,
  createAstroServerSetupMockContext,
} from "../../../../tests/mocks/integrations";
import { pagefind } from "./pagefind";

vi.mock("node:child_process", () => ({
  spawn: vi.fn(),
}));

vi.mock("node:fs/promises", () => ({
  access: vi.fn(),
}));

describe("pagefind", () => {
  it("should return an Astro integration", () => {
    const integration = pagefind();

    expect(integration.hooks["astro:config:setup"]).toBeDefined();
    expect(integration.hooks["astro:server:setup"]).toBeDefined();
    expect(integration.hooks["astro:build:done"]).toBeDefined();
    expect(integration.name).toBe("pagefind");
  });

  describe("astro:config:setup hook", () => {
    it("should do nothing in non-dev command", async () => {
      const integration = pagefind();
      const mockContext = createAstroConfigSetupMockContext({
        command: "build",
      });

      await integration.hooks["astro:config:setup"](mockContext);

      expect.assertions(1);

      expect(mockContext.logger.info).not.toHaveBeenCalled();
    });

    it("should log info when pagefind directory is accessible", async () => {
      const { access } = await import("node:fs/promises");
      vi.mocked(access).mockResolvedValueOnce();

      const integration = pagefind();
      const mockContext = createAstroConfigSetupMockContext();

      await integration.hooks["astro:config:setup"](mockContext);

      expect.assertions(1);

      expect(mockContext.logger.info).toHaveBeenCalledWith(
        "Search index found!",
      );
    });

    it("should log warning when pagefind directory is not accessible", async () => {
      const { access } = await import("node:fs/promises");
      vi.mocked(access).mockRejectedValue(new Error("Not found"));

      const integration = pagefind();
      const mockContext = createAstroConfigSetupMockContext();

      await integration.hooks["astro:config:setup"](mockContext);

      expect.assertions(1);

      expect(mockContext.logger.warn).toHaveBeenCalledWith(
        expect.stringContaining("You need to run `pnpm build`"),
      );
    });
  });

  describe("astro:server:setup hook", () => {
    it("should warn if outDir is not set", () => {
      const integration = pagefind();
      const mockContext = createAstroServerSetupMockContext();

      integration.hooks["astro:server:setup"](mockContext);

      expect.assertions(1);

      expect(mockContext.logger.warn).toHaveBeenCalledWith(
        expect.stringContaining("Couldn't determine Pagefind output directory"),
      );
    });
  });

  describe("astro:build:done hook", () => {
    it("should spawn pagefind process during build", async () => {
      const mockSpawn = vi.mocked(spawn).mockReturnValue({
        on: vi.fn().mockImplementation((event, callback) => {
          if (event === "close") {
            callback();
          }
          return { on: vi.fn() };
        }),
      } as unknown as ChildProcess);

      const integration = pagefind();
      const mockContext = createAstroBuildDoneMockContext();

      await integration.hooks["astro:build:done"](mockContext);

      expect.assertions(1);

      expect(mockSpawn).toHaveBeenCalledWith(
        "npx",
        expect.arrayContaining(["-y", "pagefind", "--site"]),
        expect.objectContaining({
          stdio: "inherit",
          shell: true,
        }),
      );
    });
  });
});

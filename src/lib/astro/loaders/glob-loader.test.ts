import type { LoaderContext } from "astro/loaders";
import { describe, expect, it, vi } from "vitest";
import { globLoader } from "./glob-loader";

vi.mock("../../../utils/constants", () => ({
  CONFIG: {
    LANGUAGES: {
      DEFAULT: "en",
      AVAILABLE: ["en", "fr"],
    },
  },
}));

describe("globLoader", () => {
  const createMockContext = (): LoaderContext => ({
    collection: "",
    store: {
      addModuleImport: vi.fn(),
      set: vi.fn(),
      clear: vi.fn(),
      get: vi.fn(),
      delete: vi.fn(),
      has: vi.fn(),
      keys: vi.fn().mockReturnValue([]),
      values: vi.fn().mockReturnValue([]),
      entries: vi.fn().mockReturnValue([]),
    },
    meta: {
      set: vi.fn(),
      get: vi.fn(),
      delete: vi.fn(),
      has: vi.fn(),
    },
    logger: {
      debug: vi.fn(),
      error: vi.fn(),
      fork: vi.fn(),
      info: vi.fn(),
      label: "label",
      options: {
        dest: { write: vi.fn() },
        level: "info",
      },
      warn: vi.fn(),
    },
    config: {
      base: "/",
      build: {
        assets: "_astro",
        format: "directory",
        inlineStylesheets: "always",
        redirects: false,
      },
      publicDir: new URL("file:///path/to/project/public/"),
      root: new URL("file:///path/to/project/"),
      server: {
        host: false,
        open: false,
        port: 3000,
      },
      srcDir: new URL("file:///path/to/project/src/"),
      trailingSlash: "ignore",
    } as unknown as LoaderContext["config"],
    parseData: vi.fn(),
    generateDigest: vi.fn(),
    entryTypes: new Map(),
    refreshContextData: {},
  });

  describe("Localized Collections", () => {
    it("should process localized collection entries correctly", async () => {
      const ctx = createMockContext();
      ctx.collection = "blog.posts";
      (ctx.store.entries as ReturnType<typeof vi.fn>).mockReturnValue([
        [
          "en/blog/posts/sample-post",
          {
            id: "en/blog/posts/sample-post",
            filePath: "/path/to/sample-post.md",
            data: { title: "Sample Post" },
          },
        ],
      ]);
      (ctx.store.keys as ReturnType<typeof vi.fn>).mockReturnValue([
        "en/blog/posts/sample-post",
      ]);

      const loader = globLoader("blog.posts");

      await loader.load(ctx);

      expect.assertions(2);

      expect(ctx.store.clear).toHaveBeenCalled();
      expect(ctx.store.set).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            locale: "en",
            route: "/blog/posts/sample-post",
            slug: "sample-post",
            title: "Sample Post",
          }),
          filePath: "/path/to/sample-post.md",
          id: "en/sample-post",
        }),
      );
    });

    it("should handle non-localized collections", async () => {
      const ctx = createMockContext();
      ctx.collection = "authors";
      (ctx.store.entries as ReturnType<typeof vi.fn>).mockReturnValue([
        [
          "author1",
          {
            id: "authors/author1",
            filePath: "/path/to/author1.json",
            data: { name: "John Doe" },
          },
        ],
      ]);
      (ctx.store.keys as ReturnType<typeof vi.fn>).mockReturnValue(["author1"]);

      const loader = globLoader("authors");

      await loader.load(ctx);

      expect.assertions(2);

      expect(ctx.store.clear).toHaveBeenCalled();
      expect(ctx.store.set).toHaveBeenCalledWith(
        expect.objectContaining({
          id: "author1",
        }),
      );
    });

    it("should handle entries without filePath", async () => {
      const ctx = createMockContext();
      ctx.collection = "blog.posts";
      (ctx.store.entries as ReturnType<typeof vi.fn>).mockReturnValue([
        [
          "entry-without-filepath",
          {
            id: "en/blog/posts/sample-post",
            filePath: null,
            data: { title: "Ignored Entry" },
          },
        ],
      ]);
      (ctx.store.keys as ReturnType<typeof vi.fn>).mockReturnValue([
        "entry-without-filepath",
      ]);

      const loader = globLoader("blog.posts");

      await loader.load(ctx);

      expect.assertions(2);

      expect(ctx.store.clear).toHaveBeenCalled();
      expect(ctx.store.set).not.toHaveBeenCalled();
    });
  });
});

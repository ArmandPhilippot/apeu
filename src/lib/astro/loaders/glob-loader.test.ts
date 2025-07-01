import type { Loader, LoaderContext } from "astro/loaders";
import { describe, expect, it, vi } from "vitest";
import { globLoader } from "./glob-loader";

vi.mock("astro/loaders", async (importOriginal) => {
  const actual: Loader = await importOriginal();
  return {
    ...actual,
    glob: vi.fn().mockReturnValue({
      load: vi.fn().mockResolvedValue(undefined),
    }),
  };
});

vi.mock("../../../utils/constants", () => {
  return {
    CONFIG: {
      LANGUAGES: {
        DEFAULT: "en",
        AVAILABLE: ["en", "fr"],
      },
    },
  };
});

type CreateMockContextConfig = {
  collection: string;
};

const createMockContext = ({
  collection,
}: CreateMockContextConfig): LoaderContext => {
  return {
    collection,
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
    refreshContextData: {},
    renderMarkdown: vi.fn(),
  };
};

describe("globLoader", () => {
  describe("Localized Collections", () => {
    it("should process localized collection entries correctly", async () => {
      /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
      expect.assertions(2);

      const ctx = createMockContext({ collection: "blog.posts" });
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

      expect(ctx.store.clear).toHaveBeenCalledWith();
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
        })
      );
    });

    it("should handle non-localized collections", async () => {
      /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
      expect.assertions(2);

      const ctx = createMockContext({ collection: "authors" });
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

      expect(ctx.store.clear).toHaveBeenCalledWith();
      expect(ctx.store.set).toHaveBeenCalledWith(
        expect.objectContaining({
          id: "author1",
        })
      );
    });

    it("should handle entries without filePath", async () => {
      /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
      expect.assertions(2);

      const ctx = createMockContext({ collection: "blog.posts" });
      (ctx.store.entries as ReturnType<typeof vi.fn>).mockReturnValue([
        [
          "entry-without-filepath",
          {
            id: "en/blog/posts/sample-post",
            filePath: undefined,
            data: { title: "Ignored Entry" },
          },
        ],
      ]);
      (ctx.store.keys as ReturnType<typeof vi.fn>).mockReturnValue([
        "entry-without-filepath",
      ]);

      const loader = globLoader("blog.posts");

      await loader.load(ctx);

      expect(ctx.store.clear).toHaveBeenCalledWith();
      expect(ctx.store.set).not.toHaveBeenCalled();
    });
  });
});

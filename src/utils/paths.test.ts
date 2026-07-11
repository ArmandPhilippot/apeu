import { afterAll, describe, expect, it, vi } from "vitest";
import { CONFIG } from "./constants";
import {
  getCumulativePaths,
  getLocaleFromPath,
  getParentDirPath,
  joinPaths,
  removeExtFromPath,
  routeToStaticPathParam,
  withoutOuterSlashes,
  withoutTrailingSlash,
  withTrailingSlash,
} from "./paths";

vi.mock("./constants", async (importOriginal) => {
  const mod = await importOriginal<typeof import("./constants")>();
  return {
    ...mod,
    CONFIG: {
      ...mod.CONFIG,
      LANGUAGES: {
        ...mod.CONFIG.LANGUAGES,
        AVAILABLE: ["en", "fr", "es"],
        DEFAULT: "en",
      },
    },
  };
});

vi.mock("./type-guards", async (importOriginal) => {
  const mod = await importOriginal<typeof import("./type-guards")>();

  return {
    ...mod,
    isAvailableLocale: vi
      .fn()
      .mockImplementation((locale: string) =>
        ["en", "es", "fr"].includes(locale)
      ),
  };
});

describe("join-paths", () => {
  it("returns a path from path fragments", () => {
    const fragments = ["/some/nested", "./parent/path", "./to/file"];
    const result = joinPaths(...fragments);

    expect(result).toMatchInlineSnapshot(`"/some/nested/parent/path/to/file"`);
  });
});

describe("get-parent-dir-path", () => {
  it("returns the parent directory path from a UNIX-style path", () => {
    const file = "file";
    const parentDir = "/some/path/to/a";
    const filePath = `${parentDir}/${file}`;
    const result = getParentDirPath(filePath);

    expect(result).toBe(parentDir);
  });

  it("returns the parent directory path from a Windows-style path", () => {
    const file = "file";
    const parentDir = String.raw`C:\some\path\to`;
    const filePath = `${parentDir}\\${file}`;
    const result = getParentDirPath(filePath);

    expect(result).toMatchInlineSnapshot(`"C:/some/path/to"`);
  });
});

describe("remove-ext-from-path", () => {
  it("removes the extension from a file path", () => {
    const ext = ".php";
    const filePath = "/some/path/to/a/file";
    const filePathWithExt = `${filePath}${ext}`;
    const result = removeExtFromPath(filePathWithExt);

    expect(result).toBe(filePath);
  });

  it("returns the file path if no extension was found", () => {
    const filePath = "/some/path/to/a/file";
    const result = removeExtFromPath(filePath);

    expect(result).toBe(filePath);
  });
});

describe("get-locale-from-path", () => {
  afterAll(() => {
    vi.resetAllMocks();
  });

  it("returns the locale from a path starting with the locale", () => {
    const path = "/es/some/file.md";
    const locale = getLocaleFromPath(path);

    expect(locale).toBe("es");
  });

  it("returns the locale from a path containing the locale", () => {
    const path = "/some/nested/es/file.md";
    const locale = getLocaleFromPath(path);

    expect(locale).toBe("es");
  });

  it("returns the default locale if no locale was found", () => {
    const path = "/some/nested/file.md";
    const locale = getLocaleFromPath(path);

    expect(locale).toBe(CONFIG.LANGUAGES.DEFAULT);
  });

  it("returns the default locale if the locale was invalid", () => {
    const path = "/ru/some/nested/file.md";
    const locale = getLocaleFromPath(path);

    expect(locale).toBe(CONFIG.LANGUAGES.DEFAULT);
  });
});

describe("getCumulativePaths", () => {
  it("splits a multi-segment path", () => {
    expect(getCumulativePaths("en/blog/posts")).toStrictEqual([
      "/en",
      "/en/blog",
      "/en/blog/posts",
    ]);
  });

  it("filters out the first segment when the path starts with a slash", () => {
    expect(getCumulativePaths("/en/blog/posts")).toStrictEqual([
      "/en",
      "/en/blog",
      "/en/blog/posts",
    ]);
  });

  it("splits a single-segment route", () => {
    expect(getCumulativePaths("en")).toStrictEqual(["/en"]);
  });

  it("handles route with trailing slashes", () => {
    expect(getCumulativePaths("en/blog/")).toStrictEqual(["/en", "/en/blog"]);
  });

  it("returns empty array for '/'", () => {
    expect(getCumulativePaths("/")).toStrictEqual([]);
  });

  it("returns empty array for empty string", () => {
    expect(getCumulativePaths("")).toStrictEqual([]);
  });
});

describe("withoutTrailingSlash", () => {
  it("removes the trailing slash from a route", () => {
    expect(withoutTrailingSlash("/blog/")).toBe("/blog");
  });

  it("leaves a route without a trailing slash untouched", () => {
    expect(withoutTrailingSlash("/blog")).toBe("/blog");
  });

  it("collapses the root route to '/'", () => {
    expect(withoutTrailingSlash("/")).toBe("/");
  });
});

describe("withTrailingSlash", () => {
  it("adds a trailing slash to a route without one", () => {
    expect(withTrailingSlash("/blog")).toBe("/blog/");
  });

  it("leaves a route with a trailing slash untouched", () => {
    expect(withTrailingSlash("/blog/")).toBe("/blog/");
  });

  it("leaves the root route untouched", () => {
    expect(withTrailingSlash("/")).toBe("/");
  });
});

describe("withoutOuterSlashes", () => {
  it("removes the leading and trailing slashes from a route", () => {
    expect(withoutOuterSlashes("/blog/posts/")).toBe("blog/posts");
  });

  it("removes the leading slash from a route without a trailing slash", () => {
    expect(withoutOuterSlashes("/blog/posts")).toBe("blog/posts");
  });

  it("returns an empty string for the root route", () => {
    expect(withoutOuterSlashes("/")).toBe("");
  });

  it("throws instead of silently corrupting a route without a leading slash", () => {
    expect(() => withoutOuterSlashes("blog/posts/")).toThrow(
      'Expected a route starting with "/", received: "blog/posts/"'
    );
  });

  it("throws for an empty string", () => {
    expect(() => withoutOuterSlashes("")).toThrow(
      'Expected a route starting with "/", received: ""'
    );
  });
});

describe("routeToStaticPathParam", () => {
  it("removes the leading and trailing slashes from a route", () => {
    expect(routeToStaticPathParam("/blog/posts/")).toBe("blog/posts");
  });

  it("returns undefined for the root route", () => {
    expect(routeToStaticPathParam("/")).toBeUndefined();
  });
});

import { globSync } from "tinyglobby";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { getStories } from "./utils";

vi.mock("node:path", async (importOriginal) => {
  const mod = await importOriginal<typeof import("node:path")>();
  return {
    ...mod,
    relative: vi.fn((from: string, to: string) => to.replace(`${from}/`, "./")),
  };
});

vi.mock("tinyglobby", () => {
  return {
    globSync: vi.fn(),
  };
});

describe("getStories", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return empty object when no stories are found", () => {
    vi.mocked(globSync).mockReturnValue([]);

    const result = getStories({
      base: "/stories",
      patterns: ["**/*"],
      root: "/some/full/path/to/project",
      src: "/some/full/path/to/project/src",
    });

    expect(result).toStrictEqual({});
  });

  it("should create story entries for MDX files", () => {
    vi.mocked(globSync).mockReturnValue(["project/src/stories/example.mdx"]);

    const result = getStories({
      base: "/somewhere",
      patterns: ["**/*"],
      root: "/project",
      src: "/project/src",
    });

    expect(result.example).toStrictEqual({
      type: "story",
      route: "/somewhere/example",
      ext: ".mdx",
      pathWithoutExt: "/project/src/stories/example",
    });
  });

  it("should create index entries for directories containing stories", () => {
    vi.mocked(globSync).mockReturnValue([
      "project/src/components/button.mdx",
      "project/src/components/input.mdx",
    ]);

    const result = getStories({
      base: "/stories",
      patterns: ["**/*"],
      root: "/project",
      src: "/project/src",
    });

    expect(result.components).toStrictEqual({
      type: "index",
      route: "/stories/components",
      children: ["/stories/components/button", "/stories/components/input"],
    });
  });

  describe("slug transformation behavior", () => {
    it("should remove .stories suffix from filenames", () => {
      vi.mocked(globSync).mockReturnValue(["project/src/button.stories.mdx"]);

      const result = getStories({
        base: "/stories",
        patterns: ["**/*"],
        root: "/project",
        src: "/project/src",
      });

      expect(result.button).toBeDefined();
      expect(result.button?.route).toBe("/stories/button");
    });

    it("should remove stories directories from paths", () => {
      vi.mocked(globSync).mockReturnValue(["project/src/stories/button.mdx"]);

      const result = getStories({
        base: "/stories",
        patterns: ["**/*"],
        root: "/project",
        src: "/project/src",
      });

      expect(result.button?.route).toBe("/stories/button");
    });

    it("should deduplicate consecutive identical path segments", () => {
      vi.mocked(globSync).mockReturnValue(["project/src/button/button.mdx"]);

      const result = getStories({
        base: "/stories",
        patterns: ["**/*"],
        root: "/project",
        src: "/project/src",
      });

      expect(result.button?.route).toBe("/stories/button");
    });
  });

  describe("configuration handling", () => {
    it("should use multiple patterns correctly", () => {
      vi.mocked(globSync).mockReturnValue([]);

      getStories({
        base: "/stories",
        patterns: ["components/**/*", "pages/**/*"],
        root: "/project",
        src: "/project/src",
      });

      expect(vi.mocked(globSync)).toHaveBeenCalledWith(
        ["/project/src/components/**/*.mdx", "/project/src/pages/**/*.mdx"],
        {
          cwd: "/project",
        }
      );
    });

    it("should respect custom base paths", () => {
      vi.mocked(globSync).mockReturnValue(["project/src/example.mdx"]);

      const result = getStories({
        base: "/custom-docs",
        patterns: ["**/*"],
        root: "/project",
        src: "/project/src",
      });

      expect(result.example?.route).toBe("/custom-docs/example");
    });
  });
});

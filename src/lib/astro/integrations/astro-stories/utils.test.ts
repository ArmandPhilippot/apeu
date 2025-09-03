import { join } from "node:path";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { getStories } from "./utils";

describe("getStories", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should only return the base as index when paths are empty", () => {
    const result = getStories({
      base: "/base",
      paths: [],
      src: import.meta.dirname,
    });

    expect(result).toStrictEqual({
      base: {
        breadcrumb: [
          { label: "Home", url: "/" },
          { label: "Base", url: "/base" },
        ],
        children: [],
        label: "Base",
        route: "/base",
        type: "index",
      },
    });
  });

  it("should create a story entry for files using stories.mdx as extension", () => {
    const result = getStories({
      base: "/somewhere",
      paths: ["button.stories.mdx"],
      src: import.meta.dirname,
    });

    expect(result.button).toStrictEqual({
      breadcrumb: [
        { label: "Home", url: "/" },
        { label: "Somewhere", url: "/somewhere" },
        { label: "Button", url: "/somewhere/button" },
      ],
      label: "Button",
      path: join(import.meta.dirname, "button.stories.mdx"),
      slug: "button",
      route: "/somewhere/button",
      type: "story",
      virtualModuleId: "virtual:astro-stories/stories/button",
    });
  });

  it("should create a story entry for MDX files in a stories directory", () => {
    const result = getStories({
      base: "/somewhere",
      paths: ["stories/example.mdx"],
      src: import.meta.dirname,
    });

    expect(result.example).toStrictEqual({
      breadcrumb: [
        { label: "Home", url: "/" },
        { label: "Somewhere", url: "/somewhere" },
        { label: "Example", url: "/somewhere/example" },
      ],
      label: "Example",
      path: join(import.meta.dirname, "stories/example.mdx"),
      slug: "example",
      route: "/somewhere/example",
      type: "story",
      virtualModuleId: "virtual:astro-stories/stories/example",
    });
  });

  it("should create index entries for directories containing stories", () => {
    const result = getStories({
      base: "/somewhere",
      paths: ["components/button.mdx", "components/input.mdx"],
      src: import.meta.dirname,
    });

    expect(result.components).toStrictEqual({
      breadcrumb: [
        { label: "Home", url: "/" },
        { label: "Somewhere", url: "/somewhere" },
        { label: "Components", url: "/somewhere/components" },
      ],
      children: [
        { route: "/somewhere/components/button", label: "Button" },
        { route: "/somewhere/components/input", label: "Input" },
      ],
      label: "Components",
      route: "/somewhere/components",
      type: "index",
    });
  });

  it("should include sub-indexes as children of their parent index", () => {
    const result = getStories({
      base: "/design-system",
      paths: ["components/atoms/blockquote.mdx", "tokens/colors.mdx"],
      src: import.meta.dirname,
    });

    expect(result.components).toMatchObject({
      children: [{ route: "/design-system/components/atoms", label: "Atoms" }],
    });

    expect(result["design-system"]).toMatchObject({
      children: expect.arrayContaining([
        { route: "/design-system/components", label: "Components" },
        { route: "/design-system/tokens", label: "Tokens" },
      ]),
    });
  });

  describe("slug transformation behavior", () => {
    it("should remove .stories suffix from filenames", () => {
      const result = getStories({
        base: "/somewhere",
        paths: ["button.stories.mdx"],
        src: import.meta.dirname,
      });

      expect(result.button).toBeDefined();
      expect(result.button?.route).toBe("/somewhere/button");
    });

    it("should remove stories directories from paths", () => {
      const result = getStories({
        base: "/somewhere",
        paths: ["stories/button.mdx"],
        src: import.meta.dirname,
      });

      expect(result.button?.route).toBe("/somewhere/button");
    });

    it("should only remove the last stories directories from paths", () => {
      const result = getStories({
        base: "/somewhere",
        paths: ["component/stories/story/stories/first-story.mdx"],
        src: import.meta.dirname,
      });

      expect(result["component/stories/story/first-story"]?.route).toBe(
        "/somewhere/component/stories/story/first-story"
      );
    });

    it("should deduplicate consecutive identical path segments", () => {
      const result = getStories({
        base: "/somewhere",
        paths: ["component/button/button.stories.mdx"],
        src: import.meta.dirname,
      });

      expect(result["component/button"]?.route).toBe(
        "/somewhere/component/button"
      );
    });
  });
});

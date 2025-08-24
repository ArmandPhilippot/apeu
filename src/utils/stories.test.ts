import { describe, expect, it } from "vitest";
import { getStoryMeta, getStoryNameFromSlug, getStoryRoute } from "./stories";

describe("get-story-route", () => {
  it("returns the story route from its path", () => {
    const path = "/some/path/to/story";
    const route = getStoryRoute(path);

    expect(route).toMatchInlineSnapshot(`"/some/path/to"`);
  });

  it("can return a sub story route", () => {
    const path = "/some/path/to/stories/single-story.stories.astro";
    const route = getStoryRoute(path);

    expect(route).toMatchInlineSnapshot(`"/some/path/to/single-story"`);
  });

  it("can return the stories index route", () => {
    const path = "/some/path/to/stories/index.stories.astro";
    const route = getStoryRoute(path);

    expect(route).toMatchInlineSnapshot(`"/some/path/to"`);
  });
});

describe("get-story-name-from-slug", () => {
  it("returns the story name from its slug", () => {
    const slug = "/the/story/slug";
    const storyName = getStoryNameFromSlug(slug);

    expect(storyName).toMatchInlineSnapshot(`"Slug"`);
  });

  it("can return the story name from slug separated by hyphens", () => {
    const slug = "/the/story/slug-separated-by-hyphens";
    const storyName = getStoryNameFromSlug(slug);

    expect(storyName).toMatchInlineSnapshot(`"SlugSeparatedByHyphens"`);
  });

  it("throws an error if the name can't be determined", () => {
    const slug = "";

    expect(() => getStoryNameFromSlug(slug)).toThrowErrorMatchingInlineSnapshot(
      `[Error: Could not retrieve the story name from its slug. Are you sure this slug match a story?]`
    );
  });
});

describe("get-story-meta", () => {
  it("builds breadcrumb and seo for a component story", () => {
    const meta = getStoryMeta({
      breadcrumb: {
        kind: "atoms",
        route: "/design-system/components/atoms/story",
        title: "Story",
      },
    });

    expect(meta.breadcrumb).toStrictEqual([
      { label: "Home", url: "/" },
      { label: "Design system", url: "/design-system" },
      { label: "Components", url: "/design-system/components" },
      { label: "Atoms", url: "/design-system/components/atoms" },
      { label: "Story", url: "/design-system/components/atoms/story" },
    ]);
    expect(meta.seo).toStrictEqual({
      title: "Story | Atoms | Components | Design system",
      noindex: true,
      nofollow: true,
    });
  });

  it("builds breadcrumb and seo for a views story", () => {
    const meta = getStoryMeta({
      breadcrumb: {
        kind: "views",
        route: "/design-system/views/homepage",
        title: "Homepage",
      },
    });

    expect(meta.breadcrumb).toStrictEqual([
      { label: "Home", url: "/" },
      { label: "Design system", url: "/design-system" },
      { label: "Views", url: "/design-system/views" },
      { label: "Homepage", url: "/design-system/views/homepage" },
    ]);
    expect(meta.seo).toStrictEqual({
      title: "Homepage | Views | Design system",
      noindex: true,
      nofollow: true,
    });
  });

  it("allows overriding seo flags", () => {
    const meta = getStoryMeta({
      breadcrumb: {
        kind: "organisms",
        route: "/design-system/components/organisms/story",
        title: "Story",
      },
      seo: { noindex: false, nofollow: false },
    });

    expect(meta.seo.noindex).toBe(false);
    expect(meta.seo.nofollow).toBe(false);
  });
});

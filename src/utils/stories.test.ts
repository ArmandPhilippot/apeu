import { describe, expect, it } from "vitest";
import { getStoryNameFromSlug, getStoryRoute } from "./stories";

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
    const name = getStoryNameFromSlug(slug);

    expect(name).toMatchInlineSnapshot(`"Slug"`);
  });

  it("can return the story name from slug separated by hyphens", () => {
    const slug = "/the/story/slug-separated-by-hyphens";
    const name = getStoryNameFromSlug(slug);

    expect(name).toMatchInlineSnapshot(`"SlugSeparatedByHyphens"`);
  });

  it("throws an error if the name can't be determined", () => {
    const slug = "";

    expect(() => getStoryNameFromSlug(slug)).toThrowErrorMatchingInlineSnapshot(
      `[Error: Could not retrieve the story name from its slug. Are you sure this slug match a story?]`,
    );
  });
});

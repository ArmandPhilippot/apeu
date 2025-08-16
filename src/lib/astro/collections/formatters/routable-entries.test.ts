import { describe, expect, it, vi } from "vitest";
import type { CollectionEntry } from "astro:content";
import {
  blogCategoryFixture,
  blogPostFixture,
  guideFixture,
  noteFixture,
} from "../../../../../tests/fixtures/collections";
import { createMockEntries } from "../../../../../tests/helpers/astro-content";
import { getRoutableEntry, getRoutableEntryPreview } from "./routable-entries";

vi.mock("astro:content", async () => {
  const originalModule = await vi.importActual("astro:content");
  return {
    ...originalModule,
    getCollection: vi.fn(),
    getEntry: vi.fn(),
  };
});

describe("get-routable-entry-preview", () => {
  it("returns a routable entry preview from a collection entry", async () => {
    expect.assertions(1);

    const mockEntries = createMockEntries([blogPostFixture]);
    const mockEntriesIndex = new Map(
      mockEntries.map((entry) => [
        entry.id,
        { raw: entry, route: entry.id, slug: entry.id },
      ])
    );

    const result = await getRoutableEntryPreview(
      {
        raw: blogPostFixture,
        route: "/blog/post/my-awesome-post",
        slug: "my-awesome-post",
      },
      mockEntriesIndex
    );

    expect(result).toMatchInlineSnapshot(`
      {
        "collection": "blog.posts",
        "description": "The blog post description.",
        "id": "en/my-awesome-post",
        "locale": "en",
        "meta": {
          "authors": [],
          "category": null,
          "publishedOn": 2024-09-22T21:10:11.400Z,
          "readingTime": undefined,
          "tags": null,
          "updatedOn": 2024-09-22T21:10:11.400Z,
        },
        "route": "/blog/post/my-awesome-post",
        "title": "The blog post title",
      }
    `);
  });

  it("handles collection entry without authors", async () => {
    expect.assertions(1);

    const mockEntries = createMockEntries([noteFixture]);
    const mockEntriesIndex = new Map(
      mockEntries.map((entry) => [
        entry.id,
        { raw: entry, route: entry.id, slug: entry.id },
      ])
    );

    const result = await getRoutableEntryPreview(
      {
        raw: noteFixture,
        route: "/notes/some-note",
        slug: "some-note",
      },
      mockEntriesIndex
    );

    expect(result.meta).not.toHaveProperty("authors");
  });

  it("handles collection entry without category", async () => {
    expect.assertions(1);

    const mockEntries = createMockEntries([guideFixture]);
    const mockEntriesIndex = new Map(
      mockEntries.map((entry) => [
        entry.id,
        { raw: entry, route: entry.id, slug: entry.id },
      ])
    );

    const result = await getRoutableEntryPreview(
      {
        raw: guideFixture,
        route: "/guides/in-depth-guide",
        slug: "in-depth-guide",
      },
      mockEntriesIndex
    );

    expect(result.meta).not.toHaveProperty("category");
  });

  it("handles collection entry with a cover", async () => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self explanatory. */
    expect.assertions(2);

    const guideWithCover: CollectionEntry<"guides"> = {
      ...guideFixture,
      data: {
        ...guideFixture.data,
        cover: {
          src: {
            format: "jpg",
            height: 200,
            src: "./my-cover.jpg",
            width: 400,
          },
        },
      },
    };
    const mockEntries = createMockEntries([guideWithCover]);
    const mockEntriesIndex = new Map(
      mockEntries.map((entry) => [
        entry.id,
        { raw: entry, route: entry.id, slug: entry.id },
      ])
    );

    const result = await getRoutableEntryPreview(
      {
        raw: guideWithCover,
        route: "/guides/in-depth-guide",
        slug: "in-depth-guide",
      },
      mockEntriesIndex
    );

    expect(result).toHaveProperty("cover");

    if (!("cover" in result)) {
      throw new Error("Unexpected missing cover property in result.");
    }

    expect(result.cover).toMatchInlineSnapshot(`
      {
        "src": {
          "format": "jpg",
          "height": 200,
          "src": "./my-cover.jpg",
          "width": 400,
        },
      }
    `);
  });

  it("handles collection entry with a cover explicitly set as undefined", async () => {
    expect.assertions(1);

    const guideWithUndefinedCover: CollectionEntry<"guides"> = {
      ...guideFixture,
      data: {
        ...guideFixture.data,
        cover: undefined,
      },
    };
    const mockEntries = createMockEntries([guideWithUndefinedCover]);
    const mockEntriesIndex = new Map(
      mockEntries.map((entry) => [
        entry.id,
        { raw: entry, route: entry.id, slug: entry.id },
      ])
    );

    const result = await getRoutableEntryPreview(
      {
        raw: guideWithUndefinedCover,
        route: "/guides/in-depth-guide",
        slug: "in-depth-guide",
      },
      mockEntriesIndex
    );

    expect(result).toMatchObject({ cover: null });
  });

  it("handles collection entry without tags", async () => {
    expect.assertions(1);

    const mockEntries = createMockEntries([blogCategoryFixture]);
    const mockEntriesIndex = new Map(
      mockEntries.map((entry) => [
        entry.id,
        { raw: entry, route: entry.id, slug: entry.id },
      ])
    );

    const result = await getRoutableEntryPreview(
      {
        raw: blogCategoryFixture,
        route: "/blog/category/astro",
        slug: "astro",
      },
      mockEntriesIndex
    );

    expect(result.meta).not.toHaveProperty("tags");
  });
});

describe("get-routable-entry", () => {
  it("returns a routable entry from a collection entry", async () => {
    expect.assertions(1);

    const mockEntries = createMockEntries([blogPostFixture]);
    const mockEntriesIndex = new Map(
      mockEntries.map((entry) => [
        entry.id,
        { raw: entry, route: entry.id, slug: entry.id },
      ])
    );

    const result = await getRoutableEntry(
      {
        raw: blogPostFixture,
        route: blogPostFixture.id,
        slug: blogPostFixture.id,
      },
      mockEntriesIndex
    );

    expect(result).toMatchInlineSnapshot(`
      {
        "Content": [Function],
        "collection": "blog.posts",
        "description": "The blog post description.",
        "hasContent": false,
        "headings": [],
        "id": "en/my-awesome-post",
        "locale": "en",
        "meta": {
          "authors": [],
          "category": null,
          "publishedOn": 2024-09-22T21:10:11.400Z,
          "readingTime": undefined,
          "tags": null,
          "updatedOn": 2024-09-22T21:10:11.400Z,
        },
        "route": "en/my-awesome-post",
        "seo": {
          "description": "The blog post description for search engines.",
          "languages": null,
          "title": "The blog post title for search engines",
        },
        "slug": "en/my-awesome-post",
        "title": "The blog post title",
      }
    `);
  });
});

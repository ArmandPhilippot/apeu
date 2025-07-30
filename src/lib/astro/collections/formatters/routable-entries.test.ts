import { describe, expect, it } from "vitest";
import {
  blogCategoryFixture,
  blogPostFixture,
  guideFixture,
  noteFixture,
} from "../../../../../tests/fixtures/collections";
import { getRoutableEntry, getRoutableEntryPreview } from "./routable-entries";

describe("get-routable-entry-preview", () => {
  it("returns a routable entry preview from a collection entry", async () => {
    expect.assertions(1);

    const result = await getRoutableEntryPreview(blogPostFixture);

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
        "slug": "my-awesome-post",
        "title": "The blog post title",
      }
    `);
  });

  it("handles collection entry without authors", async () => {
    expect.assertions(1);

    const result = await getRoutableEntryPreview(noteFixture);

    expect(result.meta).not.toHaveProperty("authors");
  });

  it("handles collection entry without category", async () => {
    expect.assertions(1);

    const result = await getRoutableEntryPreview(guideFixture);

    expect(result.meta).not.toHaveProperty("category");
  });

  it("handles collection entry with a cover", async () => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self explanatory. */
    expect.assertions(2);

    const result = await getRoutableEntryPreview({
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
    });

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

    const result = await getRoutableEntryPreview({
      ...guideFixture,
      data: {
        ...guideFixture.data,
        cover: undefined,
      },
    });

    expect(result).toMatchObject({ cover: null });
  });

  it("handles collection entry without tags", async () => {
    expect.assertions(1);

    const result = await getRoutableEntryPreview(blogCategoryFixture);

    expect(result.meta).not.toHaveProperty("tags");
  });
});

describe("get-routable-entry", () => {
  it("returns a routable entry from a collection entry", async () => {
    expect.assertions(1);

    const result = await getRoutableEntry(blogPostFixture);

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
        "route": "/blog/post/my-awesome-post",
        "seo": {
          "description": "The blog post description for search engines.",
          "languages": null,
          "title": "The blog post title for search engines",
        },
        "slug": "my-awesome-post",
        "title": "The blog post title",
      }
    `);
  });
});

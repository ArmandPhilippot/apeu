import { describe, expect, it } from "vitest";
import {
  blogCategoryFixture,
  tagFixture,
} from "../../../../../tests/fixtures/collections";
import { getTaxonomy, getTaxonomyLink, getTaxonomyPreview } from "./taxonomies";

describe("get-taxonomy-link", () => {
  it("returns a taxonomy link from a blog category entry", () => {
    const result = getTaxonomyLink(blogCategoryFixture);

    expect(result).toMatchInlineSnapshot(`
      {
        "route": "/blog/category/micro-blog",
        "title": "The category title",
      }
    `);
  });

  it("returns a taxonomy link from a tag entry", () => {
    const result = getTaxonomyLink(tagFixture);

    expect(result).toMatchInlineSnapshot(`
      {
        "route": "/tags/catchall-tag",
        "title": "The tag title",
      }
    `);
  });
});

describe("get-taxonomy-preview", () => {
  it("returns a taxonomy preview from a blog category entry", () => {
    expect(getTaxonomyPreview(blogCategoryFixture)).toMatchInlineSnapshot(`
      {
        "collection": "blogCategories",
        "cover": undefined,
        "description": "The category description.",
        "id": "en/micro-blog",
        "locale": "en",
        "meta": {
          "publishedOn": 2024-09-22T20:54:19.968Z,
          "updatedOn": 2024-09-22T20:54:19.968Z,
        },
        "route": "/blog/category/micro-blog",
        "title": "The category title",
      }
    `);
  });

  it("returns a taxonomy preview from a tag entry", () => {
    expect(getTaxonomyPreview(tagFixture)).toMatchInlineSnapshot(`
      {
        "collection": "tags",
        "cover": undefined,
        "description": "The tag description.",
        "id": "catchall-tag",
        "locale": "en",
        "meta": {
          "publishedOn": 2024-09-22T20:54:19.968Z,
          "updatedOn": 2024-09-22T20:54:19.968Z,
        },
        "route": "/tags/catchall-tag",
        "title": "The tag title",
      }
    `);
  });
});

describe("get-taxonomy", () => {
  it("returns a taxonomy from a blog category entry", async () => {
    const result = await getTaxonomy(blogCategoryFixture);

    expect.assertions(1);

    expect(result).toMatchInlineSnapshot(`
      {
        "Content": [Function],
        "collection": "blogCategories",
        "cover": undefined,
        "description": "The category description.",
        "headings": [],
        "id": "en/micro-blog",
        "locale": "en",
        "meta": {
          "publishedOn": 2024-09-22T20:54:19.968Z,
          "updatedOn": 2024-09-22T20:54:19.968Z,
        },
        "route": "/blog/category/micro-blog",
        "seo": {
          "description": "The category description for search engines.",
          "title": "The category title for search engines",
        },
        "slug": "micro-blog",
        "title": "The category title",
      }
    `);
  });

  it("returns a taxonomy from a tag entry", async () => {
    const result = await getTaxonomy(tagFixture);

    expect.assertions(1);

    expect(result).toMatchInlineSnapshot(`
      {
        "Content": [Function],
        "collection": "tags",
        "cover": undefined,
        "description": "The tag description.",
        "headings": [],
        "id": "catchall-tag",
        "locale": "en",
        "meta": {
          "publishedOn": 2024-09-22T20:54:19.968Z,
          "updatedOn": 2024-09-22T20:54:19.968Z,
        },
        "route": "/tags/catchall-tag",
        "seo": {
          "description": "The tag description for search engines.",
          "title": "The tag title for search engines",
        },
        "slug": "catchall-tag",
        "title": "The tag title",
      }
    `);
  });
});

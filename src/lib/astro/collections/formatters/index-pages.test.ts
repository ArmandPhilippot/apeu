import { describe, expect, it } from "vitest";
import { indexPageFixture } from "../../../../../tests/fixtures/collections";
import { getIndexPage, getIndexPagePreview } from "./index-pages";

describe("get-index-page-preview", () => {
  it("returns a page preview from an index.pages collection entry", async () => {
    expect.assertions(1);

    const result = await getIndexPagePreview(indexPageFixture);

    expect(result).toMatchInlineSnapshot(`
      {
        "collection": "index.pages",
        "cover": null,
        "description": "The page description.",
        "id": "en/generic-page",
        "locale": "en",
        "meta": {
          "isDraft": false,
          "publishedOn": 2024-09-22T20:54:19.962Z,
          "readingTime": undefined,
          "updatedOn": 2024-09-22T20:54:19.962Z,
        },
        "route": "/generic-page",
        "title": "The page title",
      }
    `);
  });
});

describe("get-index-page", () => {
  it("returns a page from a index.pages collection entry", async () => {
    expect.assertions(1);

    const result = await getIndexPage(indexPageFixture);

    expect(result).toMatchInlineSnapshot(`
      {
        "Content": [Function],
        "collection": "index.pages",
        "cover": null,
        "description": "The page description.",
        "hasContent": false,
        "headings": [],
        "id": "en/generic-page",
        "locale": "en",
        "meta": {
          "isDraft": false,
          "publishedOn": 2024-09-22T20:54:19.962Z,
          "readingTime": undefined,
          "updatedOn": 2024-09-22T20:54:19.962Z,
        },
        "route": "/generic-page",
        "seo": {
          "description": "The page description for search engines.",
          "languages": null,
          "title": "The page title for search engines",
        },
        "slug": "generic-page",
        "title": "The page title",
      }
    `);
  });
});

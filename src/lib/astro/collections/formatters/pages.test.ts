import { describe, expect, it } from "vitest";
import { pageFixture } from "../../../../../tests/fixtures/collections";
import { getPage, getPagePreview } from "./pages";

describe("get-page-preview", () => {
  it("returns a page preview from a pages collection entry", async () => {
    expect.assertions(1);

    const result = await getPagePreview(pageFixture);

    expect(result).toMatchInlineSnapshot(`
      {
        "collection": "pages",
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

describe("get-page", () => {
  it("returns a page from a pages collection entry", async () => {
    expect.assertions(1);

    const result = await getPage(pageFixture);

    expect(result).toMatchInlineSnapshot(`
      {
        "Content": [Function],
        "collection": "pages",
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

import { describe, expect, it } from "vitest";
import { pageFixture } from "../../../../../tests/fixtures/collections";
import { getPage, getPagePreview } from "./pages";

describe("get-page-preview", () => {
  it("returns a page preview from a pages collection entry", async () => {
    const result = await getPagePreview(pageFixture);

    expect.assertions(1);

    expect(result).toMatchInlineSnapshot(`
      {
        "collection": "pages",
        "description": "The page description.",
        "id": "en/generic-page",
        "locale": "en",
        "meta": {
          "isDraft": false,
          "publishedOn": 2024-09-22T20:54:19.962Z,
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
    const result = await getPage(pageFixture);

    expect.assertions(1);

    expect(result).toMatchInlineSnapshot(`
      {
        "Content": [Function],
        "collection": "pages",
        "description": "The page description.",
        "hasContent": false,
        "headings": [],
        "id": "en/generic-page",
        "locale": "en",
        "meta": {
          "isDraft": false,
          "publishedOn": 2024-09-22T20:54:19.962Z,
          "updatedOn": 2024-09-22T20:54:19.962Z,
        },
        "route": "/generic-page",
        "seo": {
          "description": "The page description for search engines.",
          "title": "The page title for search engines",
        },
        "slug": "generic-page",
        "title": "The page title",
      }
    `);
  });
});

import { describe, expect, it } from "vitest";
import { guideFixture } from "../../../../../tests/fixtures/collections";
import { getGuide, getGuidePreview } from "./guides";

describe("get-guide-preview", () => {
  it("returns a guide preview from a guides collection entry", async () => {
    expect.assertions(1);

    const result = await getGuidePreview(guideFixture);

    expect(result).toMatchInlineSnapshot(`
      {
        "collection": "guides",
        "cover": null,
        "description": "The guide description.",
        "id": "en/in-depth-guide",
        "locale": "en",
        "meta": {
          "publishedOn": 2024-09-22T21:00:40.799Z,
          "readingTime": undefined,
          "tags": null,
          "updatedOn": 2024-09-22T21:00:40.799Z,
        },
        "route": "/guides/in-depth-guide",
        "title": "officia qui a",
      }
    `);
  });
});

describe("get-guide", () => {
  it("returns a guide from a collection entry", async () => {
    expect.assertions(1);

    const result = await getGuide(guideFixture);

    expect(result).toMatchInlineSnapshot(`
      {
        "Content": [Function],
        "collection": "guides",
        "cover": null,
        "description": "The guide description.",
        "hasContent": false,
        "headings": [],
        "id": "en/in-depth-guide",
        "locale": "en",
        "meta": {
          "authors": [],
          "publishedOn": 2024-09-22T21:00:40.799Z,
          "readingTime": undefined,
          "tags": null,
          "updatedOn": 2024-09-22T21:00:40.799Z,
        },
        "route": "/guides/in-depth-guide",
        "seo": {
          "description": "The guide description for search engines.",
          "languages": null,
          "title": "The guide title for search engines",
        },
        "slug": "in-depth-guide",
        "title": "officia qui a",
      }
    `);
  });
});

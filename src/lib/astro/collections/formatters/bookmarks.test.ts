import { describe, expect, it } from "vitest";
import { bookmarkFixture } from "../../../../../tests/fixtures/collections";
import { getBookmark } from "./bookmarks";

describe("get-bookmark", () => {
  it("returns a bookmark from a bookmarks collection entry", async () => {
    const result = await getBookmark(bookmarkFixture);

    expect.assertions(1);

    expect(result).toMatchInlineSnapshot(`
      {
        "collection": "bookmarks",
        "description": "The bookmark description.",
        "id": "must-read-bookmark",
        "isQuote": false,
        "meta": {
          "inLanguage": "en",
          "publishedOn": 2024-09-22T21:00:40.797Z,
          "tags": null,
        },
        "title": "The bookmark title",
        "url": "https://any-site.test/must-read",
      }
    `);
  });
});

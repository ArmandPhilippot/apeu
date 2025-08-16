import { describe, expect, it, vi } from "vitest";
import { bookmarkFixture } from "../../../../../tests/fixtures/collections";
import { createMockEntries } from "../../../../../tests/helpers/astro-content";
import { getBookmark } from "./bookmarks";

vi.mock("astro:content", async () => {
  const originalModule = await vi.importActual("astro:content");
  return {
    ...originalModule,
    getCollection: vi.fn(),
    getEntry: vi.fn(),
  };
});

describe("get-bookmark", () => {
  it("returns a bookmark from a bookmarks collection entry", () => {
    const mockEntries = createMockEntries([bookmarkFixture]);
    const mockEntriesIndex = new Map(
      mockEntries.map((entry) => [
        entry.id,
        { raw: entry, route: entry.id, slug: entry.id },
      ])
    );
    const result = getBookmark({ raw: bookmarkFixture }, mockEntriesIndex);

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

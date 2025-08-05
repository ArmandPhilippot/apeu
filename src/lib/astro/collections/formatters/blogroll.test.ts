import { describe, expect, it, vi } from "vitest";
import { blogrollFixture } from "../../../../../tests/fixtures/collections";
import { createMockEntries } from "../../../../../tests/helpers/astro-content";
import { getBlog } from "./blogroll";

vi.mock("astro:content", async () => {
  const originalModule = await vi.importActual("astro:content");
  return {
    ...originalModule,
    getCollection: vi.fn(),
    getEntry: vi.fn(),
  };
});

describe("get-blog", () => {
  it("returns a blog from a blogroll collection entry", () => {
    const mockEntries = createMockEntries([blogrollFixture]);
    const mockEntriesIndex = new Map(
      mockEntries.map((entry) => [
        entry.id,
        { raw: entry, route: entry.id, slug: entry.id },
      ])
    );
    const result = getBlog({ raw: blogrollFixture }, mockEntriesIndex);

    expect(result).toMatchInlineSnapshot(`
      {
        "collection": "blogroll",
        "description": {
          "en": "The blog description in English.",
        },
        "id": "great-blog",
        "meta": {
          "inLanguages": [
            "en",
          ],
          "publishedOn": 2024-09-22T21:00:40.723Z,
          "tags": null,
          "updatedOn": 2024-09-22T21:00:40.723Z,
        },
        "title": "The blog title",
        "url": "https://great-blog.test",
      }
    `);
  });
});

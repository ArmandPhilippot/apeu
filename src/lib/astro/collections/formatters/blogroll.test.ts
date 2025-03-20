import { describe, expect, it } from "vitest";
import { blogrollFixture } from "../../../../../tests/fixtures/collections";
import { getBlog } from "./blogroll";

describe("get-blog", () => {
  it("returns a blog from a blogroll collection entry", async () => {
    expect.assertions(1);

    const result = await getBlog(blogrollFixture);

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

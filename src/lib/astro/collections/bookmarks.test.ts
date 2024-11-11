import { describe, expect, it } from "vitest";
import { CONFIG } from "../../../utils/constants";
import { bookmarks } from "./bookmarks";

describe("bookmarks", () => {
  it("should include the meta in the transformed output", () => {
    const bookmark = {
      title: "The title of the bookmark",
      description: "A description of the bookmark.",
      inLanguage: "es",
      isDraft: true,
      publishedOn: new Date("2023-01-01"),
      updatedOn: new Date("2023-01-02"),
      url: "https://example.test",
    };

    if (!bookmarks.schema || typeof bookmarks.schema === "function")
      throw new Error("The schema is not accessible");

    const result = bookmarks.schema.safeParse(bookmark);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.meta.inLanguage).toBe(bookmark.inLanguage);
      expect(result.data.meta.isDraft).toBe(true);
      expect(result.data.meta.publishedOn).toEqual(new Date("2023-01-01"));
      expect(result.data.meta.updatedOn).toEqual(new Date("2023-01-02"));
    }
  });

  it("should apply default values as expected", () => {
    const bookmark = {
      title: "The title of the bookmark",
      description: "A description of the bookmark.",
      publishedOn: new Date("2023-01-01"),
      url: "https://example.test",
    };

    if (!bookmarks.schema || typeof bookmarks.schema === "function")
      throw new Error("The schema is not accessible");

    const result = bookmarks.schema.safeParse(bookmark);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.meta.inLanguage).toBe(CONFIG.LANGUAGES.DEFAULT);
      expect(result.data.meta.isDraft).toBe(false);
      expect(result.data.meta.updatedOn).toEqual(result.data.meta.publishedOn);
    }
  });
});

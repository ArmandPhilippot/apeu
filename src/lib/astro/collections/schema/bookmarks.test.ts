import { describe, expect, it, vi } from "vitest";
import { bookmarks } from "./bookmarks";

vi.mock("../../../../utils/dates", async (importOriginal) => {
  const mod = await importOriginal<typeof import("../../../../utils/dates")>();

  return {
    ...mod,
    applyTimezone: vi.fn((date) => date), // Mocked to return the input date
  };
});

describe("bookmarks", () => {
  it("should include the meta in the transformed output", () => {
    const bookmark = {
      title: "The title of the bookmark",
      description: "A description of the bookmark.",
      inLanguage: "es",
      isDraft: true,
      publishedOn: new Date("2023-01-01"),
      url: "https://example.test",
    };

    if (
      bookmarks.schema === undefined ||
      typeof bookmarks.schema === "function"
    ) {
      throw new Error("The schema is not accessible");
    }

    const result = bookmarks.schema.safeParse(bookmark);

    expect(result.success).toBe(true);

    // This guards against TypeScript errors but won't execute if the test is passing
    if (!result.success) return;

    expect(result.data.meta.inLanguage).toBe(bookmark.inLanguage);
    expect(result.data.meta.isDraft).toBe(true);
    expect(result.data.meta.publishedOn).toStrictEqual(new Date("2023-01-01"));
  });

  it("should apply default values as expected", () => {
    const bookmark = {
      title: "The title of the bookmark",
      description: "A description of the bookmark.",
      publishedOn: new Date("2023-01-01"),
      url: "https://example.test",
      inLanguage: "en",
    };

    if (
      bookmarks.schema === undefined ||
      typeof bookmarks.schema === "function"
    ) {
      throw new Error("The schema is not accessible");
    }

    const result = bookmarks.schema.safeParse(bookmark);

    expect(result.success).toBe(true);

    // This guards against TypeScript errors but won't execute if the test is passing
    if (!result.success) return;

    expect(result.data.isQuote).toBe(false);
    expect(result.data.meta.isDraft).toBe(false);
  });
});

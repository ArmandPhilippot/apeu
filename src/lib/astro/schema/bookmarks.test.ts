import { describe, expect, it, vi } from "vitest";
import { createImageMock } from "../../../../tests/mocks/schema";
import { bookmarks } from "./bookmarks";

vi.mock("../../../utils/dates", async (importOriginal) => {
  const mod = await importOriginal<typeof import("../../../utils/dates")>();

  return {
    ...mod,
    applyTimezone: vi.fn((date) => date),
  };
});

const mockImage = createImageMock();

describe("bookmarks", () => {
  it("should include the meta in the transformed output", async () => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(4);

    const bookmark = {
      title: "The title of the bookmark",
      description: "A description of the bookmark.",
      inLanguage: "es",
      isDraft: true,
      publishedOn: new Date("2023-01-01"),
      url: "https://example.test",
    };

    if (typeof bookmarks.schema !== "function") {
      throw new TypeError("The schema is not callable");
    }

    const parsedSchema = bookmarks.schema({ image: mockImage });
    const result = await parsedSchema.safeParseAsync(bookmark);

    expect(result.success).toBe(true);

    // This guards against TypeScript errors but won't execute if the test is passing
    if (!result.success) return;

    expect(result.data.meta.inLanguage).toBe(bookmark.inLanguage);
    expect(result.data.meta.isDraft).toBe(true);
    expect(result.data.meta.publishedOn).toStrictEqual(new Date("2023-01-01"));
  });

  it("should apply default values as expected", async () => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(3);

    const bookmark = {
      title: "The title of the bookmark",
      description: "A description of the bookmark.",
      publishedOn: new Date("2023-01-01"),
      url: "https://example.test",
      inLanguage: "en",
    };

    if (typeof bookmarks.schema !== "function") {
      throw new TypeError("The schema is not callable");
    }

    const parsedSchema = bookmarks.schema({ image: mockImage });
    const result = await parsedSchema.safeParseAsync(bookmark);

    expect(result.success).toBe(true);

    // This guards against TypeScript errors but won't execute if the test is passing
    if (!result.success) return;

    expect(result.data.isQuote).toBe(false);
    expect(result.data.meta.isDraft).toBe(false);
  });
});

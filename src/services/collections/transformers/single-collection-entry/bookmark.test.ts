import { describe, expect, it, vi } from "vitest";
import { createMockI18n } from "../../../../../tests/helpers/i18n";
import type { QueriedEntry } from "../../types";
import { convertBookmarkToPreview } from "./bookmark";

vi.mock("../../../../utils/constants", async (importOriginal) => {
  const mod =
    await importOriginal<typeof import("../../../../utils/constants")>();
  return {
    ...mod,
    CONFIG: {
      ...mod.CONFIG,
      LANGUAGES: {
        DEFAULT: "en",
        AVAILABLE: ["en", "fr"],
      },
    },
  };
});

const createBookmarkEntry = (
  overrides = {}
): QueriedEntry<"bookmarks", "preview"> => {
  return {
    title: "Test Bookmark",
    description: "Bookmark description",
    url: "https://example.com/article",
    // @ts-expect-error - Mock data doesn't need complete meta structure
    meta: { publishedOn: new Date("2024-01-01") },
    ...overrides,
  };
};

describe("convertBookmarkToPreview", () => {
  it("should convert bookmark with external read more CTA", () => {
    const entry = createBookmarkEntry();
    const i18n = createMockI18n();
    const result = convertBookmarkToPreview(entry, {
      i18n,
      showCta: true,
    });

    expect(result.cta).toHaveLength(1);
    expect(result.cta?.[0]).toMatchObject({
      label: "cta.read.more",
      path: "https://example.com/article",
      isExternal: true,
    });
    expect(i18n.translate).toHaveBeenCalledWith("cta.read.more.a11y", {
      title: "Test Bookmark",
    });
  });
});

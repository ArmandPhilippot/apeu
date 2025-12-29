import { describe, expect, it, vi } from "vitest";
import { createMockI18n } from "../../../../../tests/helpers/i18n";
import type { QueriedEntry } from "../../types";
import { convertTaxonomyToPreview } from "./taxonomy";

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

const createTaxonomyEntry = (
  overrides = {}
): QueriedEntry<"blog.categories", "preview"> => {
  return {
    title: "Test Category",
    description: "Category description",
    route: "/category/test",
    cover: { src: "/images/category.jpg", alt: "Category" },
    // @ts-expect-error - Mock data doesn't need complete meta structure
    meta: {},
    ...overrides,
  };
};

describe("convertTaxonomyToPreview", () => {
  it("should use discover CTA for taxonomies", () => {
    const entry = createTaxonomyEntry();
    const i18n = createMockI18n();
    const result = convertTaxonomyToPreview(entry, {
      i18n,
      showCta: true,
    });

    expect(result.cta?.[0]?.label).toBe("cta.discover");
  });

  it("should support cover", () => {
    const entry = createTaxonomyEntry();
    const i18n = createMockI18n();
    const result = convertTaxonomyToPreview(entry, {
      i18n,
      showCover: true,
    });

    expect(result.cover).toStrictEqual({
      src: "/images/category.jpg",
      alt: "Category",
    });
  });
});

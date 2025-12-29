import { describe, expect, it, vi } from "vitest";
import { createMockI18n } from "../../../../../tests/helpers/i18n";
import type { QueriedEntry } from "../../types";
import { convertGuideToPreview } from "./guide";

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

const createGuideEntry = (
  overrides = {}
): QueriedEntry<"guides", "preview"> => {
  return {
    title: "Test Guide",
    description: "Guide description",
    route: "/guides/test-guide",
    cover: { src: "/images/guide.jpg", alt: "Guide" },
    // @ts-expect-error - Mock data doesn't need complete meta structure
    meta: { publishedOn: new Date("2024-01-01") },
    ...overrides,
  };
};

describe("convertGuideToPreview", () => {
  it("should convert guide with cover support", () => {
    const entry = createGuideEntry();
    const i18n = createMockI18n();
    const result = convertGuideToPreview(entry, {
      i18n,
      showCover: true,
    });

    expect(result.cover).toStrictEqual({
      src: "/images/guide.jpg",
      alt: "Guide",
    });
    expect(result.description).toBe("Guide description");
  });

  it("should use read more CTA", () => {
    const entry = createGuideEntry();
    const i18n = createMockI18n();
    const result = convertGuideToPreview(entry, {
      i18n,
      showCta: true,
    });

    expect(result.cta?.[0]?.label).toBe("cta.read.more");
  });
});

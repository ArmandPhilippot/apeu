import { describe, expect, it, vi } from "vitest";
import { createMockI18n } from "../../../../../tests/helpers/i18n";
import type { QueriedEntry } from "../../types";
import { convertPageToPreview } from "./page";

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

const createPageEntry = (overrides = {}): QueriedEntry<"pages", "preview"> => {
  return {
    title: "Test Page",
    description: "Page description",
    route: "/pages/test-page",
    cover: { src: "/images/page.jpg", alt: "Page" },
    // @ts-expect-error - Mock data doesn't need complete meta structure
    meta: {},
    ...overrides,
  };
};

describe("convertPageToPreview", () => {
  it("should use read more CTA for pages", () => {
    const entry = createPageEntry();
    const i18n = createMockI18n();
    const result = convertPageToPreview(entry, {
      i18n,
      showCta: true,
    });

    expect(result.cta?.[0]?.label).toBe("cta.read.more");
  });

  it("should support cover", () => {
    const entry = createPageEntry();
    const i18n = createMockI18n();
    const result = convertPageToPreview(entry, {
      i18n,
      showCover: true,
    });

    expect(result.cover).toStrictEqual({
      src: "/images/page.jpg",
      alt: "Page",
    });
  });
});

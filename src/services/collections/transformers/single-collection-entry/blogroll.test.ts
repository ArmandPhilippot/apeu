import { describe, expect, it, vi } from "vitest";
import { createMockI18n } from "../../../../../tests/helpers/i18n";
import type { QueriedEntry } from "../../types";
import { convertBlogToPreview } from "./blogroll";

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

const createBlogEntry = (
  overrides = {}
): QueriedEntry<"blogroll", "preview"> => {
  return {
    title: "Test Blog",
    description: { en: "English description", fr: "French description" },
    url: "https://example.com",
    // @ts-expect-error - Mock data doesn't need complete meta structure
    meta: { publishedOn: new Date("2024-01-01") },
    feed: undefined,
    ...overrides,
  };
};

describe("convertBlogToPreview", () => {
  it("should convert blog with CTA shown", () => {
    const entry = createBlogEntry();
    const i18n = createMockI18n();
    const result = convertBlogToPreview(entry, {
      i18n,
      showCta: true,
    });

    expect(result.heading).toBe("Test Blog");
    expect(result.cta).toHaveLength(1);
    expect(result.cta?.[0]).toMatchObject({
      label: "cta.open.website",
      path: "https://example.com",
      isExternal: true,
    });
  });

  it("should convert blog without CTA and linked heading", () => {
    const entry = createBlogEntry();
    const i18n = createMockI18n();
    const result = convertBlogToPreview(entry, {
      i18n,
      showCta: false,
    });

    expect(result.heading).toStrictEqual({
      label: "Test Blog",
      path: "https://example.com",
    });
    expect(result.cta).toBeNull();
  });

  it("should include feed CTA when feed exists", () => {
    const entry = createBlogEntry({ feed: "https://example.com/feed.xml" });
    const i18n = createMockI18n();
    const result = convertBlogToPreview(entry, {
      i18n,
      showCta: true,
    });

    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect(result.cta).toHaveLength(2);
    expect(result.cta?.[1]).toMatchObject({
      label: "cta.open.feed",
      path: "https://example.com/feed.xml",
      isExternal: true,
    });
  });

  it("should use correct locale for description", () => {
    const entry = createBlogEntry();
    const i18n = createMockI18n();
    const result = convertBlogToPreview(entry, {
      i18n,
      locale: "fr",
    });

    expect(result.description).toBe("French description");
  });

  it("should fallback to default locale when locale not available", () => {
    const entry = createBlogEntry();
    const i18n = createMockI18n();
    const result = convertBlogToPreview(entry, {
      i18n,
      locale: "ru",
    });

    expect(result.description).toBe("English description");
  });

  it("should include metadata when showMeta is true", () => {
    const entry = createBlogEntry();
    const i18n = createMockI18n();
    const result = convertBlogToPreview(entry, {
      i18n,
      showMeta: true,
    });

    expect(result.meta).toBeDefined();
    expect(result.meta).toHaveLength(1);
  });

  it("should not include metadata when showMeta is false", () => {
    const entry = createBlogEntry();
    const i18n = createMockI18n();
    const result = convertBlogToPreview(entry, {
      i18n,
      showMeta: false,
    });

    expect(result.meta).toBeNull();
  });

  it("should pass through featuredMeta, isQuote, and locale", () => {
    const entry = createBlogEntry();
    const i18n = createMockI18n();
    const result = convertBlogToPreview(entry, {
      featuredMetaItem: { key: "publishedOn", icon: "arrow-right" },
      i18n,
      isQuote: true,
      locale: "fr",
    });

    expect(result.featuredMeta).toStrictEqual({
      icon: { name: "arrow-right" },
      label: "meta.label.published.on",
      values: [entry.meta.publishedOn],
    });
    expect(result.isQuote).toBe(true);
    expect(result.locale).toBe("fr");
  });
});

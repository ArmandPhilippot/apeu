import { describe, expect, it, vi } from "vitest";
import { createMockI18n } from "../../../../../tests/helpers/i18n";
import type { QueriedEntry } from "../../types";
import { convertBlogPostToPreview } from "./blog-post";

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

const createBlogPostEntry = (
  overrides = {}
): QueriedEntry<"blog.posts", "preview"> => {
  return {
    title: "Test Blog Post",
    description: "Post description",
    route: "/blog/test-post",
    cover: { src: "/images/cover.jpg", alt: "Cover" },
    // @ts-expect-error - Mock data doesn't need complete meta structure
    meta: { publishedOn: new Date("2024-01-01") },
    ...overrides,
  };
};

describe("convertBlogPostToPreview", () => {
  it("should convert blog post with a cover when showCover is true", () => {
    const entry = createBlogPostEntry();
    const i18n = createMockI18n();
    const result = convertBlogPostToPreview(entry, {
      i18n,
      showCover: true,
    });

    expect(result.cover).toStrictEqual({
      src: "/images/cover.jpg",
      alt: "Cover",
    });
  });

  it("should convert blog post without cover when showCover is false", () => {
    const entry = createBlogPostEntry();
    const i18n = createMockI18n();
    const result = convertBlogPostToPreview(entry, {
      i18n,
      showCover: false,
    });

    expect(result.cover).toBeNull();
  });

  it("should convert blog post including a CTA when showCta is true", () => {
    const entry = createBlogPostEntry();
    const i18n = createMockI18n();
    const result = convertBlogPostToPreview(entry, {
      i18n,
      showCta: true,
    });

    expect(result.cta?.[0]).toMatchObject({
      label: "cta.read.more",
      path: "/blog/test-post",
      isExternal: undefined,
    });
  });

  it("should convert blog post without CTA and a linked heading when showCta is false", () => {
    const entry = createBlogPostEntry();
    const i18n = createMockI18n();
    const result = convertBlogPostToPreview(entry, {
      i18n,
      showCta: false,
    });

    expect(result.heading).toStrictEqual({
      label: "Test Blog Post",
      path: "/blog/test-post",
    });
    expect(result.cta?.[0]).toBeUndefined();
  });
});

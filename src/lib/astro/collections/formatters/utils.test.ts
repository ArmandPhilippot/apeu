import { getEntry } from "astro:content";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  blogCategoryFixture,
  tagFixture,
} from "../../../../../tests/fixtures/collections";
import { getTaxonomyLink, resolveTranslations } from "./utils";

vi.mock("astro:content", async () => {
  const originalModule = await vi.importActual("astro:content");
  return {
    ...originalModule,
    getEntry: vi.fn((ref: { collection: string; id: string }) => {
      return {
        id: ref.id,
        data: { route: `/test/${ref.id}` },
      };
    }),
  };
});

vi.mock("../../../../utils/i18n", () => {
  return {
    isAvailableLanguage: vi.fn(
      (lang: string) => lang === "en" || lang === "fr"
    ),
  };
});

type GetEntryMock = (ref: {
  collection: string;
  id: string;
}) =>
  | Promise<{ id: string; data: { route: string } } | null>
  | { id: string; data: { route: string } }
  | null;

describe("get-taxonomy-link", () => {
  it("returns a taxonomy link from a blog category entry", () => {
    const result = getTaxonomyLink(blogCategoryFixture);

    expect(result).toMatchInlineSnapshot(`
      {
        "route": "/blog/category/micro-blog",
        "title": "The category title",
      }
    `);
  });

  it("returns a taxonomy link from a tag entry", () => {
    const result = getTaxonomyLink(tagFixture);

    expect(result).toMatchInlineSnapshot(`
      {
        "route": "/tags/catchall-tag",
        "title": "The tag title",
      }
    `);
  });
});

describe("resolveTranslations", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns null for undefined translations", async () => {
    expect.assertions(1);

    const result = await resolveTranslations(undefined);

    expect(result).toBeNull();
  });

  it("returns null for empty translations object", async () => {
    expect.assertions(1);

    const result = await resolveTranslations({});

    expect(result).toBeNull();
  });

  it("successfully resolves valid translations", async () => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(2);

    vi.mocked(getEntry as GetEntryMock).mockImplementation((ref) => {
      return {
        id: ref.id,
        data: { route: `/test/${ref.id}` },
      };
    });

    const translations = {
      en: { collection: "pages", id: "en" },
      fr: { collection: "pages", id: "fr" },
    } as const;

    const result = await resolveTranslations(translations);

    expect(result).toStrictEqual([
      { locale: "en", route: "/test/en" },
      { locale: "fr", route: "/test/fr" },
    ]);
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect(getEntry).toHaveBeenCalledTimes(2);
  });

  it("filters out invalid language codes", async () => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(2);

    vi.mocked(getEntry as GetEntryMock).mockImplementation((ref) => {
      return {
        id: ref.id,
        data: { route: `/test/${ref.id}` },
      };
    });

    const translations = {
      en: { collection: "pages", id: "home" },
      invalid: { collection: "pages", id: "invalid" },
    } as const;

    const result = await resolveTranslations(translations);

    expect(result).toStrictEqual([{ locale: "en", route: "/test/home" }]);
    expect(getEntry).toHaveBeenCalledTimes(1);
  });

  it("handles getEntry returning null", async () => {
    expect.assertions(1);

    vi.mocked(getEntry).mockResolvedValue(null);

    const translations = {
      en: { collection: "pages", id: "home" },
    } as const;

    const result = await resolveTranslations(translations);

    expect(result).toBeNull();
  });

  it("handles entries without route data", async () => {
    expect.assertions(1);

    vi.mocked(getEntry).mockResolvedValue({
      data: { title: "Test" },
    });

    const translations = {
      en: { collection: "pages", id: "home" },
    } as const;

    const result = await resolveTranslations(translations);

    expect(result).toBeNull();
  });

  it("handles mixed valid and invalid entries", async () => {
    expect.assertions(1);

    vi.mocked(getEntry as GetEntryMock).mockImplementation((ref) => {
      if (ref.id === "home") {
        return { id: ref.id, data: { route: "/test/home" } };
      }
      return null;
    });

    const translations = {
      en: { collection: "pages", id: "home" },
      fr: { collection: "pages", id: "nonexistent" },
    } as const;

    const result = await resolveTranslations(translations);

    expect(result).toStrictEqual([{ locale: "en", route: "/test/home" }]);
  });
});

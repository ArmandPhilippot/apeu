import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  blogCategoryFixture,
  tagFixture,
} from "../../../../../tests/fixtures/collections";
import {
  createMockEntries,
  setupCollectionMocks,
} from "../../../../../tests/helpers/astro-content";
import type { IndexedEntry } from "../../../../types/routing";
import {
  getMetaFromRemarkPluginFrontmatter,
  getTaxonomyLink,
  resolveReferences,
  resolveTranslations,
} from "./utils";

vi.mock("astro:content", async () => {
  const originalModule = await vi.importActual("astro:content");
  return {
    ...originalModule,
    getCollection: vi.fn(),
    getEntry: vi.fn(),
  };
});

vi.mock("../../../../utils/constants", async (importOriginal) => {
  const mod =
    await importOriginal<typeof import("../../../../utils/constants")>();
  return {
    ...mod,
    CONFIG: {
      ...mod.CONFIG,
      LANGUAGES: {
        DEFAULT: "en",
        AVAILABLE: ["en", "es", "fr"],
      },
    },
  };
});

describe("get-meta-from-remark-plugin-frontmatter", () => {
  it("can return the reading time if wordsCount is defined", () => {
    const remarkPluginFrontmatter = {
      wordsCount: 324,
    };
    const result = getMetaFromRemarkPluginFrontmatter(
      remarkPluginFrontmatter,
      "en"
    );

    expect(result.readingTime).toBeDefined();
    expect(result.readingTime?.wordsCount).toBe(
      remarkPluginFrontmatter.wordsCount
    );
  });

  it("does not return the reading time when wordsCount is undefined", () => {
    const remarkPluginFrontmatter = {};
    const result = getMetaFromRemarkPluginFrontmatter(
      remarkPluginFrontmatter,
      "en"
    );

    expect(result.readingTime).not.toBeDefined();
  });
});

describe("get-taxonomy-link", () => {
  it("returns a taxonomy link from a blog category entry", () => {
    const indexedEntry: IndexedEntry<"blog.categories"> = {
      raw: blogCategoryFixture,
      route: "/blog/category/micro-blog",
      slug: "micro-blog",
    };
    const result = getTaxonomyLink(indexedEntry);

    expect(result).toMatchObject({
      route: indexedEntry.route,
      title: indexedEntry.raw.data.title,
    });
  });

  it("returns a taxonomy link from a tag entry", () => {
    const indexedEntry: IndexedEntry<"tags"> = {
      raw: tagFixture,
      route: "/tags/catchall-tag",
      slug: "catchall-tag",
    };
    const result = getTaxonomyLink(indexedEntry);

    expect(result).toMatchObject({
      route: indexedEntry.route,
      title: indexedEntry.raw.data.title,
    });
  });
});

describe("resolveReferences", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("returns null for undefined references", () => {
    expect.assertions(1);

    const result = resolveReferences(undefined, new Map());

    expect(result).toBeNull();
  });
});

const mockEntries = createMockEntries([
  {
    collection: "pages",
    id: "en/pages/home",
    data: {
      i18n: { fr: { collection: "pages", id: "fr/pages/home" } },
      locale: "en",
    },
  },
  {
    collection: "pages",
    id: "fr/pages/home",
    data: {
      i18n: { en: { collection: "pages", id: "en/pages/home" } },
      locale: "fr",
    },
  },
  {
    collection: "pages",
    id: "en/pages/about",
    data: {
      i18n: { fr: { collection: "pages", id: "fr/pages/about" } },
      locale: "en",
    },
  },
  {
    collection: "pages",
    id: "fr/pages/about",
    data: {
      i18n: { en: { collection: "pages", id: "en/pages/about" } },
      locale: "fr",
    },
  },
  {
    collection: "pages",
    id: "en/pages/contact",
    data: {
      i18n: { fr: { collection: "pages", id: "fr/pages/contact" } },
      locale: "en",
    },
  },
  {
    collection: "pages",
    id: "fr/pages/contact",
    data: {
      i18n: { en: { collection: "pages", id: "en/pages/contact" } },
      locale: "fr",
    },
  },
]);
const mockEntriesIndex = new Map(
  mockEntries.map((entry) => [
    entry.id,
    { raw: entry, route: entry.id, slug: entry.id },
  ])
);

setupCollectionMocks(mockEntries);

describe("resolveTranslations", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("returns null for undefined translations", async () => {
    expect.assertions(1);

    const result = await resolveTranslations(undefined, mockEntriesIndex);

    expect(result).toBeNull();
  });

  it("returns null for empty translations object", async () => {
    expect.assertions(1);

    const result = await resolveTranslations({}, mockEntriesIndex);

    expect(result).toBeNull();
  });

  it("successfully resolves valid translations", async () => {
    expect.assertions(1);

    const translations = {
      en: { collection: "pages", id: "en/pages/about" },
      fr: { collection: "pages", id: "fr/pages/about" },
    } as const;

    const result = await resolveTranslations(translations, mockEntriesIndex);

    expect(result).toStrictEqual([
      { locale: "en", route: "en/pages/about" },
      { locale: "fr", route: "fr/pages/about" },
    ]);
  });

  it("filters out invalid language codes", async () => {
    expect.assertions(1);

    const translations = {
      en: { collection: "pages", id: "en/pages/home" },
      invalid: { collection: "pages", id: "invalid" },
    } as const;

    const result = await resolveTranslations(translations, mockEntriesIndex);

    expect(result).toStrictEqual([{ locale: "en", route: "en/pages/home" }]);
  });

  it("handles getEntry returning null", async () => {
    expect.assertions(1);

    const translations = {
      en: { collection: "pages", id: "home" },
    } as const;

    const result = await resolveTranslations(translations, mockEntriesIndex);

    expect(result).toBeNull();
  });

  it("handles entries without route data", async () => {
    expect.assertions(1);

    const translations = {
      en: { collection: "pages", id: "home" },
    } as const;

    const result = await resolveTranslations(translations, mockEntriesIndex);

    expect(result).toBeNull();
  });

  it("handles mixed valid and invalid entries", async () => {
    expect.assertions(1);

    const translations = {
      en: { collection: "pages", id: "en/pages/home" },
      fr: { collection: "pages", id: "nonexistent" },
    } as const;

    const result = await resolveTranslations(translations, mockEntriesIndex);

    expect(result).toStrictEqual([{ locale: "en", route: "en/pages/home" }]);
  });
});

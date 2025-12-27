import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  createLayoutMockEntries,
  createMockEntriesByCollection,
  mergeEntriesByCollection,
  setupCollectionMocks,
} from "../../../../tests/helpers/astro-content";
import { createMockI18n } from "../../../../tests/helpers/i18n";
import { clearEntriesIndexCache } from "../../../lib/astro/collections/indexes";
import type { QueriedEntry } from "../types";
import { convertToPreview } from "./entry-to-preview";

vi.mock("astro:content", async (importOriginal) => {
  const mod = await importOriginal<typeof import("astro:content")>();
  return {
    ...mod,
    getCollection: vi.fn(() => []),
    getEntry: vi.fn(),
  };
});

vi.mock("../../../utils/constants", async (importOriginal) => {
  const mod = await importOriginal<typeof import("../../../utils/constants")>();
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

vi.mock("./helpers/meta", async (importOriginal) => {
  const mod = await importOriginal<typeof import("./helpers/meta")>();
  return {
    ...mod,
    convertCollectionMetaToMetaItem: vi.fn(() => [
      { label: "mocked-meta", values: ["test"] },
    ]),
  };
});

function setupTestWithMockEntries() {
  const layoutEntries = createLayoutMockEntries(["en", "fr"]);
  // cSpell:ignore Étiquettes Catégories
  const entryPreviewMockEntries = createMockEntriesByCollection({
    "index.pages": [
      { collection: "index.pages", id: "en/tags", data: { title: "Tags" } },
      {
        collection: "index.pages",
        id: "fr/tags",
        data: { title: "Étiquettes" },
      },
      {
        collection: "index.pages",
        id: "en/blog/categories",
        data: { title: "Categories" },
      },
      {
        collection: "index.pages",
        id: "fr/blog/categories",
        data: { title: "Catégories" },
      },
    ],
  });
  const mergedMockEntries = mergeEntriesByCollection(
    layoutEntries,
    entryPreviewMockEntries
  );
  setupCollectionMocks(mergedMockEntries);
}

describe("convertToPreview", () => {
  const i18n = createMockI18n();

  beforeEach(() => {
    setupTestWithMockEntries();
  });

  afterEach(() => {
    clearEntriesIndexCache();
    vi.clearAllMocks();
  });

  it("should route blog entries to convertBlogToPreview", async () => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(2);

    const entry = {
      collection: "blogroll",
      title: "Test Blog",
      description: { en: "Test" },
      url: "https://test.com",
      meta: {},
    } as QueriedEntry<"blogroll", "preview">;
    const result = await convertToPreview(entry, {
      currentRoute: "/any-route",
      i18n,
    });

    expect(result.heading).toBeDefined();
    expect(result.description).toBe("Test");
  });

  it("should route blog post entries to convertBlogPostToPreview", async () => {
    expect.assertions(1);

    const entry = {
      collection: "blog.posts",
      title: "Test Post",
      description: "Test",
      route: "/blog/test",
      meta: {},
    } as QueriedEntry<"blog.posts", "preview">;
    const result = await convertToPreview(entry, {
      currentRoute: "/any-route",
      i18n,
    });

    expect(result.heading).toBeDefined();
  });

  it("should route categories entries to convertTaxonomyToPreview", async () => {
    expect.assertions(1);

    const entry = {
      collection: "blog.categories",
      title: "Test Category",
      description: "Test",
      route: "/category/test",
      meta: {},
    } as QueriedEntry<"blog.categories", "preview">;
    const result = await convertToPreview(entry, {
      currentRoute: "/any-route",
      i18n,
    });

    expect(result.heading).toBeDefined();
  });

  it("should route tags entries to convertTaxonomyToPreview", async () => {
    expect.assertions(1);

    const entry = {
      collection: "tags",
      title: "Test Tag",
      description: "Test",
      route: "/tags/test",
      meta: {},
    } as QueriedEntry<"tags", "preview">;
    const result = await convertToPreview(entry, {
      currentRoute: "/any-route",
      i18n,
    });

    expect(result.heading).toBeDefined();
  });
});

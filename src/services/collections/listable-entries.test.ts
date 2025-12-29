import type { CollectionKey } from "astro:content";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  createMockEntriesByCollection,
  createMockEntry,
  setupCollectionMocks,
} from "../../../tests/helpers/astro-content";
import { clearEntriesIndexCache } from "../../lib/astro/collections/indexes";
import type { AvailableLocale } from "../../types/tokens";
import {
  addRelatedItemsToPage,
  getPageRelatedCollectionKeys,
  isListingRelatedEntries,
} from "./listable-entries";
import { queryEntry } from "./query-entry";
import type { QueriedEntry } from "./types";

vi.mock("astro:content", async (importOriginal) => {
  const mod = await importOriginal<typeof import("astro:content")>();
  return {
    ...mod,
    getCollection: vi.fn(() => []),
    getEntry: vi.fn(),
  };
});

vi.mock("../../utils/constants", async (importOriginal) => {
  const mod = await importOriginal<typeof import("../../utils/constants")>();
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

type SetupTestWithMockEntryConfig<
  T extends Exclude<CollectionKey, "authors"> = Exclude<
    CollectionKey,
    "authors"
  >,
> = {
  testEntry: Parameters<typeof createMockEntry<T>>[0];
  pageQuery: {
    collection: CollectionKey;
    id: string;
    locale?: AvailableLocale;
  };
};

async function setupTestWithMockEntry<
  T extends Exclude<CollectionKey, "authors">,
>({
  pageQuery,
  testEntry,
}: SetupTestWithMockEntryConfig<T>): Promise<QueriedEntry<T>> {
  const mockEntry = createMockEntry(testEntry);
  setupCollectionMocks([mockEntry]);

  return queryEntry(pageQuery) as Promise<QueriedEntry<T>>;
}

describe("getPageRelatedCollectionKeys", () => {
  afterEach(() => {
    clearEntriesIndexCache();
    vi.clearAllMocks();
  });

  it("returns the collection name of entries to display on the page", async () => {
    expect.assertions(1);

    const indexPage = await setupTestWithMockEntry<"index.pages">({
      pageQuery: {
        collection: "index.pages",
        id: "projects",
        locale: "en",
      },
      testEntry: {
        collection: "index.pages",
        id: "en/projects",
      },
    });
    const collection = getPageRelatedCollectionKeys(indexPage);

    expect(collection).toBe("projects");
  });

  it("handles the homepage edge case", async () => {
    expect.assertions(1);

    const indexPage = await setupTestWithMockEntry({
      pageQuery: {
        collection: "pages",
        id: "home",
        locale: "en",
      },
      testEntry: {
        collection: "pages",
        id: "en/home",
      },
    });
    const collections = getPageRelatedCollectionKeys(indexPage);

    expect(collections).toMatchInlineSnapshot(`
      [
        "blog.posts",
        "blogroll",
        "bookmarks",
        "guides",
        "projects",
      ]
    `);
  });

  it("throws when the entry is not a valid index page", async () => {
    expect.assertions(1);

    const regularPage = await setupTestWithMockEntry({
      pageQuery: {
        collection: "guides",
        id: "any-guide",
        locale: "en",
      },
      testEntry: {
        collection: "guides",
        id: "en/any-guide",
      },
    });

    expect(() =>
      getPageRelatedCollectionKeys(regularPage)
    ).toThrowErrorMatchingInlineSnapshot(
      `[Error: The id doesn't match a valid listing page. Received: en/any-guide]`
    );
  });

  it("throws when the collection name is not supported", async () => {
    expect.assertions(1);

    const indexPage = await setupTestWithMockEntry({
      pageQuery: {
        collection: "index.pages",
        id: "non-existent",
        locale: "en",
      },
      testEntry: {
        collection: "index.pages",
        id: "en/non-existent",
      },
    });

    expect(() =>
      getPageRelatedCollectionKeys(indexPage)
    ).toThrowErrorMatchingInlineSnapshot(
      `[Error: The id doesn't match a valid listing page. Received: en/non-existent]`
    );
  });

  it("throws when the collection name does not support listing entries", async () => {
    expect.assertions(1);

    const indexPage = await setupTestWithMockEntry({
      pageQuery: {
        collection: "index.pages",
        id: "authors",
        locale: "en",
      },
      testEntry: {
        collection: "index.pages",
        id: "en/authors",
      },
    });

    expect(() =>
      getPageRelatedCollectionKeys(indexPage)
    ).toThrowErrorMatchingInlineSnapshot(
      `[Error: Invalid collection, authors does not support listing entries.]`
    );
  });
});

type SetupTestWithMockEntriesConfig<T extends CollectionKey> = {
  testEntries: Parameters<typeof createMockEntriesByCollection>[0];
  pageQuery: {
    collection: T;
    id: string;
    locale?: AvailableLocale;
  };
};

async function setupTestWithMockEntries<T extends CollectionKey>({
  pageQuery,
  testEntries,
}: SetupTestWithMockEntriesConfig<T>): Promise<QueriedEntry<T>> {
  const mockEntries = createMockEntriesByCollection(testEntries);
  setupCollectionMocks(mockEntries);

  return queryEntry(pageQuery);
}

describe("isListingRelatedEntries", () => {
  afterEach(() => {
    clearEntriesIndexCache();
    vi.clearAllMocks();
  });

  it("returns true for valid pageable entries", async () => {
    expect.assertions(1);

    const entry = await setupTestWithMockEntries({
      pageQuery: {
        collection: "index.pages",
        id: "projects",
        locale: "en",
      },
      testEntries: {
        "index.pages": [{ collection: "index.pages", id: "en/projects" }],
      },
    });

    expect(isListingRelatedEntries(entry)).toBe(true);
  });

  it("returns false for invalid pageable entries", async () => {
    expect.assertions(1);

    const entry = await setupTestWithMockEntries({
      pageQuery: {
        collection: "pages",
        id: "something",
        locale: "en",
      },
      testEntries: {
        pages: [{ collection: "pages", id: "en/something" }],
      },
    });

    expect(isListingRelatedEntries(entry)).toBe(false);
  });

  it("returns false for invalid collections", async () => {
    expect.assertions(1);

    const entry = await setupTestWithMockEntries({
      pageQuery: {
        collection: "authors",
        id: "john-doe",
      },
      testEntries: {
        authors: [{ collection: "authors", id: "john-doe" }],
      },
    });

    expect(isListingRelatedEntries(entry)).toBe(false);
  });
});

describe("addRelatedItemsToPage", () => {
  afterEach(() => {
    clearEntriesIndexCache();
    vi.clearAllMocks();
  });

  it("can add related items to a pageable entry", async () => {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory.
    expect.assertions(3);

    const entry = await setupTestWithMockEntries({
      pageQuery: {
        collection: "index.pages",
        id: "projects",
        locale: "en",
      },
      testEntries: {
        "index.pages": [{ collection: "index.pages", id: "en/projects" }],
        projects: [
          { collection: "projects", id: "en/project-1" },
          { collection: "projects", id: "en/project-2" },
        ],
      },
    });
    const result = await addRelatedItemsToPage(entry);

    expect(result.related.collection).toBe("projects");
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory.
    expect(result.related.total).toBe(2);
    expect(result.related.entries).toStrictEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "en/project-1" }),
        expect.objectContaining({ id: "en/project-2" }),
      ])
    );
  });
});

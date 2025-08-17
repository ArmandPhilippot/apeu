import type { CollectionKey } from "astro:content";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  createMockEntriesByCollection,
  createMockEntry,
  setupCollectionMocks,
} from "../../../tests/helpers/astro-content";
import { clearEntriesIndexCache } from "../../lib/astro/collections/indexes";
import type { AvailableLanguage } from "../../types/tokens";
import {
  addRelatedItemsToPage,
  getDisplayedCollectionName,
  isPageableEntry,
} from "./pageable-entries";
import { queryEntry, type QueriedEntry } from "./query-entry";

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

type SetupTestWithMockEntryConfig = {
  testEntry: Parameters<typeof createMockEntry>[0];
  pageQuery: {
    collection: CollectionKey;
    id: string;
    locale?: AvailableLanguage;
  };
};

async function setupTestWithMockEntry({
  pageQuery,
  testEntry,
}: SetupTestWithMockEntryConfig) {
  const mockEntry = createMockEntry(testEntry);
  setupCollectionMocks([mockEntry]);

  return queryEntry(pageQuery);
}

describe("getDisplayedCollectionName", () => {
  afterEach(() => {
    clearEntriesIndexCache();
    vi.clearAllMocks();
  });

  it("returns the collection name of entries to display on the page", async () => {
    expect.assertions(1);

    const indexPage = await setupTestWithMockEntry({
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
    const collection = getDisplayedCollectionName(indexPage);

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
    const collections = getDisplayedCollectionName(indexPage);

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
      getDisplayedCollectionName(regularPage)
    ).toThrowErrorMatchingInlineSnapshot(
      `[Error: Entry is not an index page, received collection: guides]`
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
      getDisplayedCollectionName(indexPage)
    ).toThrowErrorMatchingInlineSnapshot(
      `[Error: Collection not supported, received: non-existent]`
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
      getDisplayedCollectionName(indexPage)
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
    locale?: AvailableLanguage;
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

describe("isPageableEntry", () => {
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

    expect(isPageableEntry(entry)).toBe(true);
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

    expect(isPageableEntry(entry)).toBe(false);
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

    expect(isPageableEntry(entry)).toBe(false);
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

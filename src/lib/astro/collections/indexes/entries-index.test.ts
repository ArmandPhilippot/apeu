import { getCollection } from "astro:content";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  createMockEntries,
  createMockEntry,
  setupCollectionMocks,
} from "../../../../../tests/helpers/astro-content";
import { collections } from "../../../../content.config";
import { clearEntriesIndexCache, getEntriesIndex } from "./entries-index";
import { normalizePagesId } from "./utils";

vi.mock("astro:content", async (importOriginal) => {
  const mod = await importOriginal<typeof import("astro:content")>();
  return {
    ...mod,
    getCollection: vi.fn(() => []),
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

describe("getEntriesIndex", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    clearEntriesIndexCache();
  });

  it("should return indexes with byId and byRoute maps", async () => {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory.
    expect.assertions(4);

    const result = await getEntriesIndex();

    expect(result).toHaveProperty("byId");
    expect(result).toHaveProperty("byRoute");
    expect(result.byId).toBeInstanceOf(Map);
    expect(result.byRoute).toBeInstanceOf(Map);
  });

  it("should handle empty collections", async () => {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory.
    expect.assertions(2);

    setupCollectionMocks([]);

    const result = await getEntriesIndex();

    expect(result.byId.size).toBe(0);
    expect(result.byRoute.size).toBe(0);
  });

  it("should index routable entries correctly", async () => {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory.
    expect.assertions(2);

    const mockEntries = createMockEntries([
      { collection: "pages", id: "en/pages/about" },
      { collection: "pages", id: "en/pages/contact" },
    ]);

    setupCollectionMocks(mockEntries);

    const result = await getEntriesIndex();

    expect(result.byId.size).toBe(mockEntries.length);
    expect(result.byRoute.size).toBe(mockEntries.length);
  });

  it("should index non routable entries correctly", async () => {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory.
    expect.assertions(2);

    const mockEntries = createMockEntries([
      { collection: "authors", id: "john-doe" },
      { collection: "authors", id: "jane-doe" },
    ]);

    setupCollectionMocks(mockEntries);

    const result = await getEntriesIndex();

    expect(result.byId.size).toBe(mockEntries.length);
    expect(result.byRoute.size).toBe(0);
  });

  it("should create correct structure for routable entries", async () => {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory.
    expect.assertions(2);

    const mockEntry = createMockEntry({
      collection: "pages",
      id: "en/pages/about",
    });

    setupCollectionMocks([mockEntry]);

    const result = await getEntriesIndex();
    const normalizedId = normalizePagesId(mockEntry.id);
    const expectedRoute = `/${normalizedId.replace(/^en\//, "")}`;
    const expectedSlug = normalizedId.split("/").pop();
    const indexedEntryById = result.byId.get(normalizedId);
    const indexedEntryByRoute = result.byRoute.get(expectedRoute);

    expect(indexedEntryById).toStrictEqual({
      raw: { ...mockEntry, id: normalizedId },
      route: expectedRoute,
      slug: expectedSlug,
    });
    expect(indexedEntryByRoute).toStrictEqual({
      raw: { ...mockEntry, id: normalizedId },
      route: expectedRoute,
      slug: expectedSlug,
    });
  });

  it("should create correct structure for non routable entries", async () => {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory.
    expect.assertions(2);

    const mockEntry = createMockEntry({
      collection: "authors",
      id: "john-doe",
    });

    setupCollectionMocks([mockEntry]);

    const result = await getEntriesIndex();
    const indexedEntryById = result.byId.get(mockEntry.id);
    const indexedEntryByRoute = result.byRoute.get(mockEntry.id);

    expect(indexedEntryById).toStrictEqual({
      raw: mockEntry,
    });
    expect(indexedEntryByRoute).toBeUndefined();
  });

  it("should create correct route structure for routable entries using default language", async () => {
    expect.assertions(1);

    const mockEntry = createMockEntry({
      collection: "blog.posts",
      id: "en/blog/posts/post-1",
    });

    setupCollectionMocks([mockEntry]);

    const result = await getEntriesIndex();
    const indexedEntryById = result.byId.get(mockEntry.id);

    expect(indexedEntryById).toMatchObject({
      route: "/blog/posts/post-1",
    });
  });

  it("should create correct route structure for routable entries using a supported language", async () => {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory.
    expect.assertions(2);

    const mockEntry = createMockEntry({
      collection: "blog.posts",
      id: "es/blog/posts/post-1",
    });

    setupCollectionMocks([mockEntry]);

    const result = await getEntriesIndex();
    const indexedEntryById = result.byId.get(mockEntry.id);

    if (
      indexedEntryById === undefined ||
      !("locale" in indexedEntryById.raw.data)
    ) {
      throw new Error(
        "The indexed entry and its locale are expected to be defined."
      );
    }

    expect(indexedEntryById.raw.data.locale).not.toBe(mockEntry.data.locale);
    expect(indexedEntryById).toMatchObject({
      raw: { ...mockEntry, data: { ...mockEntry.data, locale: "es" } },
      route: "/es/blog/posts/post-1",
    });
  });

  it("should throw using a non supported language", async () => {
    expect.assertions(1);

    const mockEntry = createMockEntry({
      collection: "blog.posts",
      id: "ru/blog/posts/post-1",
    });

    setupCollectionMocks([mockEntry]);

    await expect(getEntriesIndex()).rejects.toThrowErrorMatchingInlineSnapshot(
      `[Error: "ru" is not a supported locale.]`
    );
  });

  it("should handle pages correctly", async () => {
    expect.assertions(1);

    const mockEntry = createMockEntry({
      collection: "pages",
      id: "en/pages/about",
    });

    setupCollectionMocks([mockEntry]);

    const result = await getEntriesIndex();
    const normalizedId = normalizePagesId(mockEntry.id);
    const indexedEntryById = result.byId.get(normalizedId);

    expect(indexedEntryById).toMatchObject({
      route: normalizedId.replace(/^en\//, "/"),
      slug: normalizedId.split("/").at(-1),
    });
  });

  it("should handle index pages correctly", async () => {
    expect.assertions(1);

    const mockEntry = createMockEntry({
      collection: "index.pages",
      id: "en/blog/posts",
    });

    setupCollectionMocks([mockEntry]);

    const result = await getEntriesIndex();
    const indexedEntryById = result.byId.get(mockEntry.id);

    expect(indexedEntryById).toMatchObject({
      route: "/blog/posts",
      slug: "posts",
    });
  });

  it("should handle multiple languages correctly", async () => {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory.
    expect.assertions(2);

    const mockEntries = createMockEntries([
      { collection: "pages", id: "en/pages/about" },
      { collection: "pages", id: "es/pages/about" },
      { collection: "pages", id: "fr/pages/about" },
    ]);

    setupCollectionMocks(mockEntries);

    const result = await getEntriesIndex();

    // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory.
    expect(result.byId.size).toBe(3);
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory.
    expect(result.byRoute.size).toBe(3);
  });

  it("should warn when duplicated ids are encountered in routable entries", async () => {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory.
    expect.assertions(3);

    const consoleSpy = vi.spyOn(console, "warn");
    const mockEntries = createMockEntries([
      { collection: "pages", id: "en/pages/projects" },
      { collection: "index.pages", id: "en/projects" },
    ]);

    setupCollectionMocks(mockEntries);

    const result = await getEntriesIndex();

    expect(consoleSpy).toHaveBeenCalledExactlyOnceWith(
      'Duplicate id "en/projects" in collections "pages" and "index.pages" — skipping.'
    );
    expect(result.byId.size).toBe(1);
    expect(result.byRoute.size).toBe(1);
  });

  it("should warn when duplicated ids are encountered in non routable entries", async () => {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory.
    expect.assertions(3);

    const consoleSpy = vi.spyOn(console, "warn");
    const mockEntries = createMockEntries([
      { collection: "blogroll", id: "duplicated" },
      { collection: "bookmarks", id: "duplicated" },
    ]);

    setupCollectionMocks(mockEntries);

    const result = await getEntriesIndex();

    expect(consoleSpy).toHaveBeenCalledExactlyOnceWith(
      'Duplicate key "duplicated" in collections "bookmarks" and "blogroll" — skipping.'
    );
    expect(result.byId.size).toBe(1);
    expect(result.byRoute.size).toBe(0);
  });

  it("should return the same cached instance on subsequent calls", async () => {
    expect.assertions(1);

    setupCollectionMocks([]);

    const first = await getEntriesIndex();
    const second = await getEntriesIndex();

    expect(first).toBe(second);
  });

  it("should only fetch collections once due to caching", async () => {
    expect.assertions(1);

    setupCollectionMocks([]);

    await getEntriesIndex();
    await getEntriesIndex();

    // Should only call getCollection once per collection type due to caching
    expect(vi.mocked(getCollection).mock.calls).toHaveLength(
      Object.keys(collections).length
    );
  });

  it("should use permaslug to localize routes and slugs", async () => {
    expect.assertions(1);

    const mockEntry = createMockEntry({
      collection: "index.pages",
      id: "fr/blog",
      data: {
        permaslug: "journal",
      },
    });

    setupCollectionMocks([mockEntry]);

    const result = await getEntriesIndex();
    const indexedEntryById = result.byId.get(mockEntry.id);

    expect(indexedEntryById).toMatchObject({
      raw: { ...mockEntry, data: { ...mockEntry.data, locale: "fr" } },
      route: `/${mockEntry.id.replace("blog", "journal")}`,
      slug: mockEntry.data.permaslug,
    });
  });

  it("should use nested permaslug to localize routes and slugs", async () => {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory.
    expect.assertions(3);

    // cSpell:ignore projets
    const mockEntries = createMockEntries([
      {
        collection: "index.pages",
        id: "fr/projects",
        data: { permaslug: "projets" },
      },
      {
        collection: "index.pages",
        id: "fr/projects/websites",
        data: { permaslug: "sites-web" },
      },
      {
        collection: "projects",
        id: "fr/projects/websites/website-1",
        data: { permaslug: "site-web-1" },
      },
    ]);

    setupCollectionMocks(mockEntries);

    const result = await getEntriesIndex();

    expect(result.byRoute.get("/fr/projets")).toBeDefined();
    expect(result.byRoute.get("/fr/projets/sites-web")).toBeDefined();
    expect(
      result.byRoute.get("/fr/projets/sites-web/site-web-1")
    ).toBeDefined();
  });
});

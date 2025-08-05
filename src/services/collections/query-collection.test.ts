import type { CollectionEntry, CollectionKey } from "astro:content";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  createMockEntriesByCollection,
  setupCollectionMocks,
} from "../../../tests/helpers/astro-content";
import { clearEntriesIndexCache } from "../../lib/astro/collections/indexes";
import { queryCollection } from "./query-collection";

vi.mock("astro:content", async () => {
  const originalModule = await vi.importActual("astro:content");
  return {
    ...originalModule,
    getCollection: vi.fn(),
    getEntry: vi.fn(),
  };
});

type Fixtures = {
  entries: CollectionEntry<CollectionKey>[];
};

const mockEntries = createMockEntriesByCollection({
  authors: [
    { collection: "authors", id: "author1" },
    { collection: "authors", id: "author2" },
  ],
  "blog.posts": [
    {
      collection: "blog.posts",
      id: "en/post-1",
      data: {
        meta: {
          authors: [{ collection: "authors", id: "author1" }],
          category: { collection: "blog.categories", id: "category2" },
          isDraft: false,
          publishedOn: new Date("2024-09-22T21:10:11.400Z"),
          tags: [{ collection: "tags", id: "tag1" }],
          updatedOn: new Date("2024-09-22T21:10:11.400Z"),
        },
      },
    },
    {
      collection: "blog.posts",
      id: "en/post-2",
      data: {
        meta: {
          authors: [{ collection: "authors", id: "author2" }],
          category: { collection: "blog.categories", id: "category1" },
          isDraft: false,
          publishedOn: new Date("2024-09-23T11:20:15.200Z"),
          tags: [],
          updatedOn: new Date("2024-09-23T11:20:15.200Z"),
        },
      },
    },
  ],
  blogroll: [
    {
      collection: "blogroll",
      id: "awesome-site",
      data: {
        description: {
          en: "An English description.",
          fr: "Une description en français.",
        },
        title: "Awesome site",
      },
    },
  ],
  guides: [
    {
      collection: "guides",
      id: "en/guide-1",
      data: {
        meta: {
          authors: [{ collection: "authors", id: "author1" }],
          isDraft: false,
          publishedOn: new Date("2024-09-20T20:10:11.400Z"),
          tags: [{ collection: "tags", id: "tag2" }],
          updatedOn: new Date("2024-09-22T21:10:11.400Z"),
        },
      },
    },
    {
      collection: "guides",
      id: "en/guide-2",
      data: {
        meta: {
          authors: [{ collection: "authors", id: "author2" }],
          isDraft: false,
          publishedOn: new Date("2024-10-12T10:50:15.400Z"),
          tags: [{ collection: "tags", id: "tag1" }],
          updatedOn: new Date("2024-10-12T10:50:15.400Z"),
        },
      },
    },
  ],
  notes: [{ collection: "notes", id: "en/note1" }],
  projects: [
    {
      collection: "projects",
      id: "fr/project-1",
      data: {
        meta: {
          isArchived: false,
          isDraft: false,
          kind: "app",
          publishedOn: new Date("2024-09-20T20:10:11.400Z"),
          repository: { name: "repo", url: "https://repo.test/owner/repo" },
          tags: [{ collection: "tags", id: "tag2" }],
          updatedOn: new Date("2024-09-22T21:10:11.400Z"),
        },
      },
    },
  ],
});

describe("queryCollection", () => {
  beforeEach<Fixtures>((context) => {
    context.entries = Object.values(mockEntries).flat();
    setupCollectionMocks(mockEntries);
    vi.clearAllMocks();
    vi.stubEnv("PROD", false);
  });

  afterEach(() => {
    clearEntriesIndexCache();
    vi.restoreAllMocks();
  });

  it("can filter entries by authors", async () => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(2);

    const result = await queryCollection("blog.posts", {
      where: { authors: ["author2"] },
    });

    expect(result.entries).toHaveLength(1);
    expect(result.entries[0]?.id).toBe("en/post-2");
  });

  it("can filter entries by categories", async () => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(2);

    const result = await queryCollection("blog.posts", {
      where: { categories: ["category1"] },
    });

    expect(result.entries).toHaveLength(1);
    expect(result.entries[0]?.id).toBe("en/post-2");
  });

  it("can filter entries by tags", async () => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(2);

    const result = await queryCollection("blog.posts", {
      where: { tags: ["tag1"] },
    });

    expect(result.entries).toHaveLength(1);
    expect(result.entries[0]?.id).toBe("en/post-1");
  });

  it("can filter entries by locale", async () => {
    expect.assertions(1);

    const result = await queryCollection("blog.posts", {
      where: { locale: "en" },
    });

    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect(result.entries).toHaveLength(2);
  });

  it("can order the entries using the given key", async () => {
    expect.assertions(1);

    const result = await queryCollection("blog.posts", {
      orderBy: { key: "publishedOn", order: "DESC" },
    });

    expect(result.entries).toStrictEqual([
      expect.objectContaining({ id: "en/post-2" }),
      expect.objectContaining({ id: "en/post-1" }),
    ]);
  });

  it("should support pagination", async () => {
    expect.assertions(1);

    const result = await queryCollection("blog.posts", {
      first: 1,
      after: 1,
    });

    expect(result.entries).toHaveLength(1);
  });

  it<Fixtures>("should filter out draft entries in production", async ({
    entries,
  }) => {
    expect.assertions(1);

    vi.stubEnv("PROD", true);

    const result = await queryCollection("guides");

    expect(result.entries).toHaveLength(
      entries.filter(
        (entry) => entry.collection === "guides" && !entry.data.meta.isDraft
      ).length
    );
  });

  it("can filter entries by locale when locale is in description", async () => {
    expect.assertions(1);

    const result = await queryCollection("blogroll", {
      where: { locale: "fr" },
    });

    expect(result.entries).toHaveLength(1);
  });

  it("can filter entries by locale when locale is a direct property", async () => {
    expect.assertions(1);

    const result = await queryCollection("projects", {
      where: { locale: "fr" },
    });

    expect(result.entries).toHaveLength(1);
  });

  it("includes entries without locale information when filtering by locale", async () => {
    expect.assertions(1);

    const result = await queryCollection("authors", {
      where: { locale: "en" },
    });

    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Two authors in mockEntries. */
    expect(result.entries).toHaveLength(2);
  });

  it<Fixtures>("can query multiple collections", async ({ entries }) => {
    expect.assertions(1);

    const queriedCollections = [
      "blog.posts",
      "guides",
      "projects",
    ] as const satisfies CollectionKey[];
    const result = await queryCollection(queriedCollections);
    const filteredMockEntries = entries.filter((entry) =>
      (queriedCollections as string[]).includes(entry.collection)
    );

    expect(result.entries).toHaveLength(filteredMockEntries.length);
  });

  it<Fixtures>("can apply filters across multiple collections", async ({
    entries,
  }) => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(2);

    const result = await queryCollection(["blog.posts", "guides"], {
      where: { authors: ["author2"] },
    });
    const filteredMockEntries = entries.filter(
      (entry) =>
        "meta" in entry.data &&
        "authors" in entry.data.meta &&
        entry.data.meta.authors.some((author) => author.id === "author2")
    );

    expect(result.entries).toHaveLength(filteredMockEntries.length);
    expect(result.entries).toStrictEqual([
      expect.objectContaining({ id: "en/guide-2" }),
      expect.objectContaining({ id: "en/post-2" }),
    ]);
  });
});

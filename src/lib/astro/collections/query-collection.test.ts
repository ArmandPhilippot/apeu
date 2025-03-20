import type * as astro from "astro:content";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  authorFixture,
  blogPostFixture,
  blogrollFixture,
  guideFixture,
  projectFixture,
} from "../../../../tests/fixtures/collections";
import { queryCollection } from "./query-collection";

const ONE_DAY_IN_MS = 86_400_000; // 24 * 60 * 60 * 1000
const mockEntries = [
  authorFixture,
  {
    ...blogPostFixture,
    id: "post-1",
    data: {
      ...blogPostFixture.data,
      meta: {
        ...blogPostFixture.data.meta,
        tags: [{ collection: "tags", id: "tag1" }],
      },
    },
  },
  {
    ...blogPostFixture,
    id: "post-2",
    data: {
      ...blogPostFixture.data,
      meta: {
        ...blogPostFixture.data.meta,
        authors: [{ collection: "authors", id: "author2" }],
        category: { collection: "blogCategories", id: "category1" },
        publishedOn: new Date(
          blogPostFixture.data.meta.publishedOn.getTime() + ONE_DAY_IN_MS
        ),
      },
      title: "Post 2",
    },
  },
  blogrollFixture,
  {
    ...blogrollFixture,
    id: "blog2",
    data: {
      ...blogrollFixture.data,
      description: {
        fr: "A description in French.",
      },
    },
  },
  guideFixture,
  {
    ...guideFixture,
    id: "guide-2",
    data: {
      ...guideFixture.data,
      meta: {
        ...guideFixture.data.meta,
        authors: [{ collection: "authors", id: "author2" }],
      },
      title: "Guide 2",
    },
  },
  projectFixture,
  {
    ...projectFixture,
    id: "project-2",
    data: {
      ...projectFixture.data,
      locale: "fr",
    },
  },
] satisfies astro.CollectionEntry<
  "authors" | "blogPosts" | "blogroll" | "guides" | "projects"
>[];

vi.mock("astro:content", async () => {
  const originalModule = await vi.importActual("astro:content");
  return {
    ...originalModule,
    getCollection: vi.fn((collection, filterFn) =>
      mockEntries.filter((entry) => {
        const matchesCollection = entry.collection === collection;
        const passesFilter =
          typeof filterFn === "function" ? Boolean(filterFn(entry)) : true;
        return matchesCollection && passesFilter;
      })
    ),
  };
});

describe("queryCollection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("PROD", false);
  });

  it("can filter entries by authors", async () => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(2);

    const result = await queryCollection("blogPosts", {
      where: { authors: ["author2"] },
    });

    expect(result.entries).toHaveLength(1);
    expect(result.entries[0]?.id).toBe("post-2");
  });

  it("can filter entries by categories", async () => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(2);

    const result = await queryCollection("blogPosts", {
      where: { categories: ["category1"] },
    });

    expect(result.entries).toHaveLength(1);
    expect(result.entries[0]?.id).toBe("post-2");
  });

  it("can filter entries by tags", async () => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(2);

    const result = await queryCollection("blogPosts", {
      where: { tags: ["tag1"] },
    });

    expect(result.entries).toHaveLength(1);
    expect(result.entries[0]?.id).toBe("post-1");
  });

  it("can filter entries by locale", async () => {
    expect.assertions(1);

    const result = await queryCollection("blogPosts", {
      where: { locale: "en" },
    });

    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect(result.entries).toHaveLength(2);
  });

  it("can order the entries using the given key", async () => {
    expect.assertions(1);

    const result = await queryCollection("blogPosts", {
      orderBy: { key: "publishedOn", order: "DESC" },
    });

    expect(result.entries).toStrictEqual([
      expect.objectContaining({ id: "post-2" }),
      expect.objectContaining({ id: "post-1" }),
    ]);
  });

  it("should support pagination", async () => {
    expect.assertions(1);

    const result = await queryCollection("blogPosts", {
      first: 1,
      after: 1,
    });

    expect(result.entries).toHaveLength(1);
  });

  it("should filter out draft entries in production", async () => {
    expect.assertions(1);

    vi.stubEnv("PROD", true);

    const result = await queryCollection("guides");

    expect(result.entries).toHaveLength(
      mockEntries.filter(
        /* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- This is mock, and some entries could have true as value in the future. */
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

    expect(result.entries).toHaveLength(1);
  });

  it("can query multiple collections", async () => {
    expect.assertions(1);

    const result = await queryCollection(["blogPosts", "guides", "projects"]);
    const filteredMockedEntries = mockEntries.filter((entry) =>
      ["blogPosts", "guides", "projects"].includes(entry.collection)
    );

    expect(result.entries).toHaveLength(filteredMockedEntries.length);
  });

  it("can apply filters across multiple collections", async () => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(2);

    const result = await queryCollection(["blogPosts", "guides"], {
      where: { authors: ["author2"] },
    });

    expect(result.entries).toHaveLength(
      mockEntries.filter(
        (entry) =>
          "meta" in entry.data &&
          "authors" in entry.data.meta &&
          entry.data.meta.authors.some((author) => author.id === "author2")
      ).length
    );
    expect(result.entries.map((e) => e.id)).toStrictEqual([
      "post-2",
      "guide-2",
    ]);
  });
});

import type * as astro from "astro:content";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { queryCollection, queryCollections } from "./query-collection";

const mockEntries = [
  {
    collection: "blogPosts",
    id: "post-1",
    data: {
      description: "Description of post 1",
      locale: "en",
      meta: {
        authors: [{ collection: "authors", id: "author1" }],
        category: { collection: "blogCategories", id: "category1" },
        isDraft: false,
        publishedOn: new Date("2024-09-22T21:10:11.400Z"),
        tags: [{ collection: "tags", id: "tag1" }],
        updatedOn: new Date("2024-09-22T21:10:11.400Z"),
      },
      route: "/posts/post-1",
      seo: {
        description: "Vero numquam quisquam.",
        title: "optio quibusdam et",
      },
      slug: "post-1",
      title: "Post 1",
    },
  },
  {
    collection: "blogPosts",
    id: "post-2",
    data: {
      description: "Description of post 2.",
      locale: "en",
      meta: {
        authors: [{ collection: "authors", id: "author2" }],
        category: { collection: "blogCategories", id: "category2" },
        isDraft: false,
        publishedOn: new Date("2024-10-11T12:30:15.400Z"),
        tags: [{ collection: "tags", id: "tag2" }],
        updatedOn: new Date("2024-11-05T11:20:11.400Z"),
      },
      route: "/posts/post-2",
      seo: {
        description:
          "Voluptas totam dolores atque perferendis ea consequatur quam earum.",
        title: "quaerat ut natus",
      },
      slug: "post-2",
      title: "Post 2",
    },
  },
  {
    collection: "guides",
    id: "guide-1",
    data: {
      description: "Description of guide 1.",
      locale: "en",
      meta: {
        authors: [{ collection: "authors", id: "author2" }],
        isDraft: false,
        publishedOn: new Date("2024-10-11T12:30:15.400Z"),
        tags: [{ collection: "tags", id: "tag2" }],
        updatedOn: new Date("2024-11-05T11:20:11.400Z"),
      },
      route: "/guides/guide-1",
      seo: {
        description:
          "Accusamus veniam et enim numquam modi modi est est dicta.",
        title: "dolorem quia provident",
      },
      slug: "guide-1",
      title: "Guide 1",
    },
  },
  {
    collection: "guides",
    id: "guide-2",
    data: {
      description: "Description of guide 2.",
      locale: "en",
      meta: {
        authors: [{ collection: "authors", id: "author2" }],
        isDraft: true,
        publishedOn: new Date("2024-10-11T12:30:15.400Z"),
        tags: [{ collection: "tags", id: "tag2" }],
        updatedOn: new Date("2024-11-05T11:20:11.400Z"),
      },
      route: "/guides/guide-2",
      seo: {
        description: "Est hic repellat aliquid nam unde.",
        title: "velit est hic",
      },
      slug: "guide-2",
      title: "Guide 2",
    },
  },
  {
    collection: "projects",
    id: "project-1",
    data: {
      description: "Description of project 1.",
      locale: "en",
      meta: {
        isDraft: false,
        kind: "theme",
        publishedOn: new Date("2024-10-11T12:30:15.400Z"),
        repository: "https://example.test",
        tags: [{ collection: "tags", id: "tag1" }],
        updatedOn: new Date("2024-11-05T11:20:11.400Z"),
      },
      route: "/projects/project-1",
      seo: {
        description: "Maxime qui culpa ratione est et dolores eum a quod.",
        title: "velit eos voluptas",
      },
      slug: "project-1",
      title: "Project 1",
    },
  },
] satisfies astro.CollectionEntry<"blogPosts" | "guides" | "projects">[];

vi.mock("astro:content", async () => {
  const originalModule = await vi.importActual("astro:content");
  return {
    ...originalModule,
    getCollection: vi.fn((collection, filterFn) =>
      Promise.resolve(
        mockEntries.filter(
          (entry) =>
            entry.collection === collection && (!filterFn || filterFn(entry)),
        ),
      ),
    ),
  };
});

describe("queryCollection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("PROD", false);
  });

  it("can filter entries by authors", async () => {
    const result = await queryCollection("blogPosts", {
      where: { authors: ["author1"] },
    });

    expect.assertions(2);

    expect(result.entries).toHaveLength(1);
    expect(result.entries[0]?.id).toBe("post-1");
  });

  it("can filter entries by categories", async () => {
    const result = await queryCollection("blogPosts", {
      where: { categories: ["category1"] },
    });

    expect.assertions(2);

    expect(result.entries).toHaveLength(1);
    expect(result.entries[0]?.id).toBe("post-1");
  });

  it("can filter entries by tags", async () => {
    const result = await queryCollection("blogPosts", {
      where: { tags: ["tag1"] },
    });

    expect.assertions(2);

    expect(result.entries).toHaveLength(1);
    expect(result.entries[0]?.id).toBe("post-1");
  });

  it("can filter entries by locale", async () => {
    const result = await queryCollection("blogPosts", {
      where: { locale: "en" },
    });

    expect.assertions(1);

    expect(result.entries).toHaveLength(2);
  });

  it("can order the entries using the given key", async () => {
    const result = await queryCollection("blogPosts", {
      orderBy: { key: "publishedOn", order: "DESC" },
    });

    expect.assertions(1);

    expect(result.entries).toEqual([
      expect.objectContaining({ id: "post-2" }),
      expect.objectContaining({ id: "post-1" }),
    ]);
  });

  it("should support pagination", async () => {
    const result = await queryCollection("blogPosts", {
      first: 1,
      after: 1,
    });

    expect.assertions(1);

    expect(result.entries).toHaveLength(1);
  });

  it("should filter out draft entries in production", async () => {
    vi.stubEnv("PROD", true);

    const result = await queryCollection("guides");

    expect.assertions(1);

    expect(result.entries).toHaveLength(
      mockEntries.filter(
        (entry) => entry.collection === "guides" && !entry.data.meta.isDraft,
      ).length,
    );
  });
});

describe("queryCollections", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("PROD", false);
  });

  it("can query multiple collections", async () => {
    const result = await queryCollections(["blogPosts", "guides", "projects"]);

    expect.assertions(1);

    expect(result.entries).toHaveLength(mockEntries.length);
  });

  it("can apply filters across multiple collections", async () => {
    const result = await queryCollections(["blogPosts", "guides"], {
      where: { authors: ["author2"] },
    });

    expect.assertions(2);

    expect(result.entries).toHaveLength(
      mockEntries.filter((entry) =>
        entry.data.meta.authors?.some((author) => author.id === "author2"),
      ).length,
    );
    expect(result.entries.map((e) => e.id)).toEqual([
      "post-2",
      "guide-1",
      "guide-2",
    ]);
  });
});

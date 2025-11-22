import { describe, expect, it, vi } from "vitest";
import { createMockI18n } from "../../../../../tests/helpers/i18n";
import type { QueriedEntry } from "../../types";
import {
  convertCollectionMetaToMetaItem,
  removeCategoryByRoute,
  removeTagByRoute,
} from "./meta";

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

function createMockOptions() {
  const i18n = createMockI18n();

  return {
    i18n,
    icons: {
      kind: { name: "project" as const, size: 24 },
      publishedOn: { name: "blog" as const, size: 20 },
    },
  };
}

describe("convertCollectionMetaToMetaItem", () => {
  describe("empty data", () => {
    it("should return an empty array when all fields are undefined", () => {
      const data = {};
      const options = createMockOptions();
      const result = convertCollectionMetaToMetaItem(data, options);

      expect(result).toStrictEqual([]);
    });

    it("should return an empty array when all fields are null", () => {
      const data = { category: null, tags: null };
      const options = createMockOptions();
      const result = convertCollectionMetaToMetaItem(data, options);

      expect(result).toStrictEqual([]);
    });

    it("should return an empty array when receiving an empty array", () => {
      const data = { authors: [] };
      const options = createMockOptions();
      const result = convertCollectionMetaToMetaItem(data, options);

      expect(result).toStrictEqual([]);
    });
  });

  describe("individual fields", () => {
    it("should transform archived status", () => {
      const data = { isArchived: true };
      const options = createMockOptions();
      const result = convertCollectionMetaToMetaItem(data, options);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        label: "meta.label.status",
      });
      expect(options.i18n.translate).toHaveBeenCalledWith(
        "meta.value.status.archived"
      );
    });

    it("should not include status when not archived", () => {
      const data = { isArchived: false };
      const options = createMockOptions();
      const result = convertCollectionMetaToMetaItem(data, options);

      expect(result).toHaveLength(0);
    });

    it("should transform authors with names only", () => {
      const data = {
        authors: [
          { name: "Alice", isWebsiteOwner: true },
          { name: "Bob", isWebsiteOwner: false },
        ],
      };
      const options = createMockOptions();
      const result = convertCollectionMetaToMetaItem(data, options);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        values: ["Alice", "Bob"],
      });
      expect(options.i18n.translatePlural).toHaveBeenCalledWith(
        "meta.label.authors",
        {
          count: 2,
        }
      );
    });

    it("should transform authors with external websites as Route objects", () => {
      const data = {
        authors: [
          {
            name: "Alice",
            website: "https://example.test",
            isWebsiteOwner: false,
          },
          { name: "Bob", isWebsiteOwner: true },
        ],
      };
      const options = createMockOptions();
      const result = convertCollectionMetaToMetaItem(data, options);

      expect(result[0]?.values).toStrictEqual([
        { label: "Alice", path: "https://example.test" },
        "Bob",
      ]);
    });

    it("should not link website owner's website", () => {
      const data = {
        authors: [
          {
            name: "Owner",
            website: "https://example.test",
            isWebsiteOwner: true,
          },
        ],
      };
      const options = createMockOptions();
      const result = convertCollectionMetaToMetaItem(data, options);

      expect(result[0]?.values).toStrictEqual(["Owner"]);
    });

    it("should transform category", () => {
      const data = {
        category: { label: "Tutorial", path: "/category/tutorial" },
      };
      const options = createMockOptions();
      const result = convertCollectionMetaToMetaItem(data, options);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        label: "meta.label.category",
        values: [{ label: "Tutorial", path: "/category/tutorial" }],
      });
    });

    it("should transform kind field correctly", () => {
      const data = { kind: "site" as const };
      const options = createMockOptions();
      const result = convertCollectionMetaToMetaItem(data, options);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        label: "meta.label.project.kind",
        values: ["meta.value.project.kind.site"],
      });
    });

    it("should include icon for kind if provided", () => {
      const data = { kind: "app" as const };
      const options = createMockOptions();
      const result = convertCollectionMetaToMetaItem(data, options);

      expect(result[0]?.icon).toStrictEqual({ name: "project", size: 24 });
    });

    it("should transform single language", () => {
      const data = { inLanguage: "en" as const };
      const options = createMockOptions();
      const result = convertCollectionMetaToMetaItem(data, options);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        label: "meta.label.language",
      });
      expect(options.i18n.translate).toHaveBeenCalledWith("language.name.en");
    });

    it("should transform multiple languages", () => {
      const data = { inLanguages: ["en" as const, "fr" as const] };
      const options = createMockOptions();
      const result = convertCollectionMetaToMetaItem(data, options);

      expect(result).toHaveLength(1);
      expect(options.i18n.translate).toHaveBeenCalledWith("language.name.en");
      expect(options.i18n.translate).toHaveBeenCalledWith("language.name.fr");
      expect(options.i18n.translatePlural).toHaveBeenCalledWith(
        "meta.label.languages",
        {
          count: 2,
        }
      );
    });

    it("should transform publishedOn correctly", () => {
      const publishedDate = new Date("2024-01-15");
      const data = { publishedOn: publishedDate };
      const options = createMockOptions();
      const result = convertCollectionMetaToMetaItem(data, options);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        label: "meta.label.published.on",
        values: [publishedDate],
      });
    });

    it("should transform updatedOn when different from publishedOn", () => {
      const publishedDate = new Date("2024-01-15");
      const updatedDate = new Date("2024-02-20");
      const data = { publishedOn: publishedDate, updatedOn: updatedDate };
      const options = createMockOptions();
      const result = convertCollectionMetaToMetaItem(data, options);

      /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
      expect(result).toHaveLength(2);
      expect(result).toContainEqual(
        expect.objectContaining({
          label: "meta.label.last.update",
          values: [updatedDate],
        })
      );
    });

    it("should not include updatedOn when same as publishedOn", () => {
      const date = new Date("2024-01-15");
      const data = {
        publishedOn: date,
        updatedOn: new Date(date.toISOString()), // Same date
      };
      const options = createMockOptions();
      const result = convertCollectionMetaToMetaItem(data, options);

      expect(result).toHaveLength(1);
    });

    it("should transform reading time with all metadata", () => {
      const data = {
        readingTime: {
          inMinutes: 5,
          inMinutesAndSeconds: { minutes: 5, seconds: 30 },
          wordsPerMinute: 200,
          wordsCount: 1000,
        },
      };
      const options = createMockOptions();
      const result = convertCollectionMetaToMetaItem(data, options);

      expect(result).toHaveLength(1);
      expect(options.i18n.translatePlural).toHaveBeenCalledWith(
        "meta.value.reading.time.in.minutes",
        { count: 5 }
      );
      expect(options.i18n.translate).toHaveBeenCalledWith(
        "meta.description.reading.time",
        {
          minutes: 5,
          seconds: 30,
          speed: 200,
          words: 1000,
        }
      );
      expect(result[0]?.description).toBeDefined();
    });

    it("should transform repository as Route object", () => {
      const data = {
        repository: {
          name: "my-repo",
          url: "https://github.com/user/my-repo",
        },
      };
      const options = createMockOptions();
      const result = convertCollectionMetaToMetaItem(data, options);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        label: "meta.label.repository",
        values: [{ label: "my-repo", path: "https://github.com/user/my-repo" }],
      });
    });

    it("should transform tags", () => {
      const data = {
        tags: [
          { label: "javascript", path: "/tags/javascript" },
          { label: "typescript", path: "/tags/typescript" },
        ],
      };
      const options = createMockOptions();
      const result = convertCollectionMetaToMetaItem(data, options);

      expect(result).toHaveLength(1);
      /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
      expect(result[0]?.values).toHaveLength(2);
      expect(options.i18n.translatePlural).toHaveBeenCalledWith(
        "meta.label.tags",
        {
          count: 2,
        }
      );
    });
  });
});

describe("removeCategoryByRoute", () => {
  it("replaces a meta category with null when the route matches", () => {
    const date = new Date("2025-11-16T14:23:02.431Z");
    const fakeEntry = {
      collection: "blog.posts",
      description: "A description",
      id: "post-1",
      locale: "en",
      meta: {
        authors: [{ name: "John Doe", isWebsiteOwner: false }],
        category: {
          label: "Category",
          path: "/a-cat-path",
        },
        publishedOn: date,
        tags: null,
        updatedOn: date,
      },
      route: "/post-1",
      slug: "post-1",
      title: "Post 1",
    } satisfies QueriedEntry<"blog.posts", "preview">;
    const result = removeCategoryByRoute(fakeEntry, "/a-cat-path");

    expect(result).toStrictEqual(
      expect.objectContaining({
        ...fakeEntry,
        meta: {
          authors: [{ name: "John Doe", isWebsiteOwner: false }],
          category: null,
          publishedOn: date,
          tags: null,
          updatedOn: date,
        },
      })
    );
  });

  it("keeps the category when the route doesn't match", () => {
    const date = new Date("2025-11-16T14:23:02.431Z");
    const fakeEntry = {
      collection: "blog.posts",
      description: "A description",
      id: "post-1",
      locale: "en",
      meta: {
        authors: [{ name: "John Doe", isWebsiteOwner: false }],
        category: {
          label: "Category",
          path: "/a-cat-path",
        },
        publishedOn: date,
        tags: null,
        updatedOn: date,
      },
      route: "/post-1",
      slug: "post-1",
      title: "Post 1",
    } satisfies QueriedEntry<"blog.posts", "preview">;
    const result = removeCategoryByRoute(fakeEntry, "/wrong-path");

    expect(result).toStrictEqual(
      expect.objectContaining({
        ...fakeEntry,
        meta: {
          authors: [{ name: "John Doe", isWebsiteOwner: false }],
          category: {
            label: "Category",
            path: "/a-cat-path",
          },
          publishedOn: date,
          tags: null,
          updatedOn: date,
        },
      })
    );
  });
});

describe("removeTagByRoute", () => {
  it("removes a tag in an entry meta when the route matches", () => {
    const date = new Date("2025-11-16T14:23:02.431Z");
    const fakeEntry = {
      collection: "guides",
      description: "A description",
      id: "guide-1",
      locale: "en",
      meta: {
        authors: [{ name: "John Doe", isWebsiteOwner: false }],
        publishedOn: date,
        tags: [
          { label: "Tag 1", path: "/tag-1" },
          { label: "Tag 2", path: "/tag-2" },
        ],
        updatedOn: date,
      },
      route: "/guide-1",
      slug: "guide-1",
      title: "Guide 1",
    } satisfies QueriedEntry<"guides", "preview">;
    const result = removeTagByRoute(fakeEntry, "/tag-1");

    expect(result).toStrictEqual(
      expect.objectContaining({
        ...fakeEntry,
        meta: {
          authors: [{ name: "John Doe", isWebsiteOwner: false }],
          publishedOn: date,
          tags: [{ label: "Tag 2", path: "/tag-2" }],
          updatedOn: date,
        },
      })
    );
  });

  it("keeps all the tags in an entry meta when the route doesn't match", () => {
    const date = new Date("2025-11-16T14:23:02.431Z");
    const fakeEntry = {
      collection: "guides",
      description: "A description",
      id: "guide-1",
      locale: "en",
      meta: {
        authors: [{ name: "John Doe", isWebsiteOwner: false }],
        publishedOn: date,
        tags: [
          { label: "Tag 1", path: "/tag-1" },
          { label: "Tag 2", path: "/tag-2" },
        ],
        updatedOn: date,
      },
      route: "/guide-1",
      slug: "guide-1",
      title: "Guide 1",
    } satisfies QueriedEntry<"guides", "preview">;
    const result = removeTagByRoute(fakeEntry, "/wrong-path");

    expect(result).toStrictEqual(
      expect.objectContaining({
        ...fakeEntry,
        meta: {
          authors: [{ name: "John Doe", isWebsiteOwner: false }],
          publishedOn: date,
          tags: [
            { label: "Tag 1", path: "/tag-1" },
            { label: "Tag 2", path: "/tag-2" },
          ],
          updatedOn: date,
        },
      })
    );
  });
});

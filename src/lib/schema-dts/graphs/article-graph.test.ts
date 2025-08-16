import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import type { Person } from "schema-dts";
import { CONFIG } from "../../../utils/constants";
import { clearEntriesIndexCache } from "../../astro/collections/indexes";
import {
  createMockEntries,
  setupCollectionMocks,
} from "../../../../tests/helpers/astro-content";
import { getArticleGraph } from "./article-graph";

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
        AVAILABLE: ["en", "fr"],
        DEFAULT: "en",
      },
    },
  };
});

vi.mock("../../../utils/url", async (importOriginal) => {
  const mod = await importOriginal<typeof import("../../../utils/url")>();
  return {
    ...mod,
    getWebsiteUrl: () => "https://example.test",
  };
});

describe("getArticleGraph", () => {
  beforeAll(() => {
    const mockEntries = createMockEntries([
      { collection: "pages", id: "en/home" },
      { collection: "pages", id: "en/blog" },
    ]);
    setupCollectionMocks(mockEntries);
  });

  afterAll(() => {
    clearEntriesIndexCache();
  });

  describe("Basic article structure", () => {
    it("returns an Article with correct type and identifiers", async () => {
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory.
      expect.assertions(4);

      const graph = await getArticleGraph({
        collection: "notes",
        cover: null,
        description: "Quam omnis in temporibus.",
        locale: CONFIG.LANGUAGES.DEFAULT,
        meta: {
          publishedOn: new Date("2024-10-09T13:55:57.813Z"),
          updatedOn: new Date("2024-10-09T13:55:57.813Z"),
        },
        route: "/some-route",
        title: "beatae autem in",
      });

      expect(graph["@type"]).toBe("Article");
      expect(graph["@id"]).toBe("https://example.test/some-route#article");
      expect(graph.url).toBe("https://example.test/some-route");
      expect(graph.mainEntityOfPage).toStrictEqual({
        "@id": "https://example.test/some-route",
      });
    });

    it("includes correct content metadata", async () => {
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory.
      expect.assertions(4);

      const graph = await getArticleGraph({
        collection: "notes",
        cover: null,
        description: "Quam omnis in temporibus.",
        locale: CONFIG.LANGUAGES.DEFAULT,
        meta: {
          publishedOn: new Date("2024-10-09T13:55:57.813Z"),
          updatedOn: new Date("2024-10-09T13:55:57.813Z"),
        },
        route: "/some-route",
        title: "beatae autem in",
      });

      expect(graph.headline).toBe("beatae autem in");
      expect(graph.name).toBe("beatae autem in");
      expect(graph.description).toBe("Quam omnis in temporibus.");
      expect(graph.isAccessibleForFree).toBe(true);
    });

    it("includes correct date information", async () => {
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory.
      expect.assertions(4);

      const graph = await getArticleGraph({
        collection: "notes",
        cover: null,
        description: "Quam omnis in temporibus.",
        locale: CONFIG.LANGUAGES.DEFAULT,
        meta: {
          publishedOn: new Date("2024-10-09T13:55:57.813Z"),
          updatedOn: new Date("2024-10-09T13:55:57.813Z"),
        },
        route: "/some-route",
        title: "beatae autem in",
      });

      expect(graph.dateCreated).toBe("2024-10-09T13:55:57.813Z");
      expect(graph.dateModified).toBe("2024-10-09T13:55:57.813Z");
      expect(graph.datePublished).toBe("2024-10-09T13:55:57.813Z");
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory.
      expect(graph.copyrightYear).toBe(2024);
    });

    it("includes correct publisher and license information", async () => {
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory.
      expect.assertions(4);

      const graph = await getArticleGraph({
        collection: "notes",
        cover: null,
        description: "Quam omnis in temporibus.",
        locale: CONFIG.LANGUAGES.DEFAULT,
        meta: {
          publishedOn: new Date("2024-10-09T13:55:57.813Z"),
          updatedOn: new Date("2024-10-09T13:55:57.813Z"),
        },
        route: "/some-route",
        title: "beatae autem in",
      });

      expect(graph.editor).toStrictEqual({
        "@id": "https://example.test#author",
      });
      expect(graph.publisher).toStrictEqual({
        "@id": "https://example.test#author",
      });
      expect(graph.license).toBe(
        "https://creativecommons.org/licenses/by-sa/4.0/deed"
      );
      expect(graph.inLanguage).toMatchInlineSnapshot(`
        {
          "@type": "Language",
          "alternateName": "en",
          "name": "English",
        }
      `);
    });
  });

  describe("Optional properties", () => {
    it("includes author information when provided", async () => {
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory.
      expect.assertions(4);

      const graph = await getArticleGraph({
        collection: "guides",
        description: "Description",
        locale: CONFIG.LANGUAGES.DEFAULT,
        meta: {
          authors: [
            { isWebsiteOwner: false, name: "John Doe" },
            { isWebsiteOwner: true, name: "Armand" },
          ],
          publishedOn: new Date("2024-10-09T13:55:57.813Z"),
          updatedOn: new Date("2024-10-09T13:55:57.813Z"),
        },
        route: "/route",
        title: "Title",
      });

      expect(Array.isArray(graph.author)).toBe(true);

      const authors = graph.author as Person[];

      // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory.
      expect(authors).toHaveLength(2);
      expect(authors[0]).toStrictEqual({
        "@type": "Person",
        name: "John Doe",
      });
      expect(graph.copyrightHolder).toStrictEqual(graph.author);
    });

    it("includes image-related properties when cover is provided", async () => {
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory.
      expect.assertions(2);

      const graph = await getArticleGraph({
        collection: "guides",
        cover: {
          alt: "ea consectetur perferendis",
          height: 480,
          src: "https://picsum.photos/640/480",
          width: 640,
        },
        description: "Description",
        locale: CONFIG.LANGUAGES.DEFAULT,
        meta: {
          publishedOn: new Date("2024-10-09T13:55:57.813Z"),
          updatedOn: new Date("2024-10-09T13:55:57.813Z"),
        },
        route: "/route",
        title: "Title",
      });

      expect(graph.image).toBe("https://picsum.photos/640/480");
      expect(graph.thumbnailUrl).toBe("https://picsum.photos/640/480");
    });

    it("includes reading time information when available", async () => {
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory.
      expect.assertions(2);

      const graph = await getArticleGraph({
        collection: "guides",
        description: "Description",
        locale: CONFIG.LANGUAGES.DEFAULT,
        meta: {
          publishedOn: new Date("2024-10-09T13:55:57.813Z"),
          updatedOn: new Date("2024-10-09T13:55:57.813Z"),
          readingTime: {
            inMinutes: 2,
            inMinutesAndSeconds: { minutes: 1, seconds: 55 },
            wordsCount: 250,
            wordsPerMinute: 80,
          },
        },
        route: "/route",
        title: "Title",
      });

      expect(graph.timeRequired).toBe("PT1M55S");
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory.
      expect(graph.wordCount).toBe(250);
    });

    it("includes keywords when tags are provided", async () => {
      expect.assertions(1);

      const graph = await getArticleGraph({
        collection: "guides",
        description: "Description",
        locale: CONFIG.LANGUAGES.DEFAULT,
        meta: {
          publishedOn: new Date("2024-10-09T13:55:57.813Z"),
          updatedOn: new Date("2024-10-09T13:55:57.813Z"),
          tags: [
            { title: "tenetur", route: "/tenetur" },
            { title: "iste", route: "/iste" },
          ],
        },
        route: "/route",
        title: "Title",
      });

      expect(graph.keywords).toBe("tenetur,iste");
    });
  });

  describe("Specialized article types", () => {
    it("uses BlogPosting type for blog posts with blog-specific properties", async () => {
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory.
      expect.assertions(3);

      const graph = await getArticleGraph({
        collection: "blog.posts",
        cover: null,
        description: "Blog description",
        locale: CONFIG.LANGUAGES.DEFAULT,
        meta: {
          authors: [{ isWebsiteOwner: false, name: "John Doe" }],
          category: { title: "animi", route: "/animi" },
          publishedOn: new Date("2024-10-09T13:55:57.813Z"),
          updatedOn: new Date("2024-10-09T13:55:57.813Z"),
        },
        route: "/blog-post",
        title: "Blog Title",
      });

      expect(graph["@type"]).toBe("BlogPosting");
      expect(graph.isPartOf).toStrictEqual({
        "@id": "https://example.test/blog#blog",
      });
      expect(graph.author).toHaveLength(1);
    });
  });

  describe("Comprehensive article structure", () => {
    it("contains all expected keys for a complete article", async () => {
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory.
      expect.assertions(2);

      const testData = {
        collection: "guides" as const,
        cover: {
          alt: "ea consectetur perferendis",
          height: 480,
          src: "https://picsum.photos/640/480",
          width: 640,
        },
        description: "Quam omnis in temporibus.",
        locale: CONFIG.LANGUAGES.DEFAULT,
        meta: {
          authors: [
            { isWebsiteOwner: false, name: "John Doe" },
            { isWebsiteOwner: true, name: "Armand" },
          ],
          publishedOn: new Date("2024-10-09T13:55:57.813Z"),
          readingTime: {
            inMinutes: 2,
            inMinutesAndSeconds: { minutes: 1, seconds: 55 },
            wordsCount: 250,
            wordsPerMinute: 80,
          },
          tags: [
            { title: "tenetur", route: "/tenetur" },
            { title: "iste", route: "/iste" },
          ],
          updatedOn: new Date("2024-10-09T13:55:57.813Z"),
        },
        route: "/some-route",
        title: "beatae autem in",
      };

      const graph = await getArticleGraph(testData);

      // Verify all expected keys are present
      const expectedKeys = [
        "@id",
        "@type",
        "author",
        "copyrightHolder",
        "copyrightYear",
        "dateCreated",
        "dateModified",
        "datePublished",
        "description",
        "editor",
        "headline",
        "image",
        "inLanguage",
        "isAccessibleForFree",
        "keywords",
        "license",
        "mainEntityOfPage",
        "name",
        "publisher",
        "thumbnailUrl",
        "timeRequired",
        "url",
        "wordCount",
      ];

      expect(Object.keys(graph).sort()).toStrictEqual(expectedKeys.sort());

      // Use a small structural snapshot
      const structure = {
        type: graph["@type"],
        hasAuthor: graph.author !== undefined,
        authorCount: Array.isArray(graph.author) ? graph.author.length : 0,
        hasImage: Boolean(graph.image),
        hasReadingTime: Boolean(graph.timeRequired),
        hasKeywords: Boolean(graph.keywords),
      };

      expect(structure).toMatchInlineSnapshot(`
        {
          "authorCount": 2,
          "hasAuthor": true,
          "hasImage": true,
          "hasKeywords": true,
          "hasReadingTime": true,
          "type": "Article",
        }
      `);
    });
  });
});

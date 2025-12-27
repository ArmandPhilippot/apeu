import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { ComponentProps } from "astro/types";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  createLayoutMockEntries,
  createMockEntriesByCollection,
  mergeEntriesByCollection,
  setupCollectionMocks,
} from "../../../tests/helpers/astro-content";
import { clearEntriesIndexCache } from "../../lib/astro/collections/indexes";
import {
  addRelatedItemsToPage,
  queryEntry,
  type PageableCollection,
} from "../../services/collections";
import type { AvailableLocale } from "../../types/tokens";
import CollectionListingView from "./collection-listing-view.astro";

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
        AVAILABLE: ["en", "fr"],
      },
    },
  };
});

vi.mock("../../services/i18n", async (importOriginal) => {
  const mod = await importOriginal<typeof import("../../services/i18n")>();
  return {
    ...mod,
    useI18n: () => {
      return {
        locale: "en",
        translate: vi.fn((key: string, params?: Record<string, unknown>) => {
          const translations: Record<string, string> = {
            "cta.read.more": "Read more",
            "cta.read.more.a11y": `Read more about ${typeof params?.title === "string" ? params.title : "item"}`,
            "cta.open.website": "Open website",
            "cta.open.website.a11y": "Open website",
            "cta.discover": "Discover",
            "cta.discover.a11y": `Discover ${typeof params?.title === "string" ? params.title : "project"}`,
            "pagination.a11y": "Pagination",
          };
          return translations[key] ?? key;
        }),
        translatePlural: vi.fn(
          (key: string, params?: Record<string, unknown>) => {
            const count = typeof params?.count === "number" ? params.count : 0;
            const pluralTranslations: Record<string, string> = {
              "meta.value.total.blog.categories": `${count} categories`,
              "meta.value.total.blog.posts": `${count} posts`,
              "meta.value.total.blogroll": `${count} sites`,
              "meta.value.total.bookmarks": `${count} bookmarks`,
              "meta.value.total.guides": `${count} guides`,
              "meta.value.total.entries": `${count} entries`,
              "meta.value.total.notes": `${count} notes`,
              "meta.value.total.projects": `${count} projects`,
              "meta.value.total.tags": `${count} tags`,
            };
            return pluralTranslations[key] ?? `${count} items`;
          }
        ),
      };
    },
  };
});

vi.mock("../../services/breadcrumb", async (importOriginal) => {
  const mod =
    await importOriginal<typeof import("../../services/breadcrumb")>();
  return {
    ...mod,
    getBreadcrumb: vi.fn().mockResolvedValue([
      { label: "Home", href: "/" },
      { label: "Blog", href: "/blog" },
    ]),
  };
});

vi.mock("../../lib/schema-dts/graphs/webpage-graph", async (importOriginal) => {
  const mod =
    await importOriginal<
      typeof import("../../lib/schema-dts/graphs/webpage-graph")
    >();
  return {
    ...mod,
    getWebPageGraph: vi.fn().mockResolvedValue({
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Test Page",
    }),
  };
});

vi.mock("../../services/pagination", async (importOriginal) => {
  const mod =
    await importOriginal<typeof import("../../services/pagination")>();
  return {
    ...mod,
    renderPaginationLink: vi.fn().mockReturnValue(
      (route: string = "/blog/page/") =>
        (page: number) =>
          `${route}${page}`
    ),
  };
});

type SetupTestWithMockEntriesConfig = {
  testEntries: Parameters<typeof createMockEntriesByCollection>[0];
  pageQuery: {
    collection: PageableCollection;
    id: string;
    locale?: AvailableLocale;
  };
};

async function setupTestWithMockEntries({
  pageQuery,
  testEntries,
}: SetupTestWithMockEntriesConfig) {
  const layoutEntries = createLayoutMockEntries(["en", "fr"]);
  // cSpell:ignore Étiquettes Catégories
  const collectionListingViewRequiredEntries = createMockEntriesByCollection({
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
  const mockEntries = createMockEntriesByCollection(testEntries);
  const mergedMockEntries = mergeEntriesByCollection(
    layoutEntries,
    mergeEntriesByCollection(collectionListingViewRequiredEntries, mockEntries)
  );
  setupCollectionMocks(mergedMockEntries);

  const page = await queryEntry(pageQuery);
  const enrichedPage = await addRelatedItemsToPage(page, { format: "preview" });

  return enrichedPage;
}

type LocalTestContext = {
  container: AstroContainer;
};

describe("CollectionListingView", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
  });

  afterEach(() => {
    clearEntriesIndexCache();
    vi.clearAllMocks();
  });

  describe("Collections", () => {
    it<LocalTestContext>("renders blog posts collection correctly", async ({
      container,
    }) => {
      /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
      expect.assertions(4);

      const entry = await setupTestWithMockEntries({
        pageQuery: {
          collection: "index.pages",
          id: "blog/posts",
          locale: "en",
        },
        testEntries: {
          "blog.posts": [
            {
              collection: "blog.posts",
              id: "en/blog/posts/post-1",
              data: { title: "First blog post" },
            },
            {
              collection: "blog.posts",
              id: "en/blog/posts/post-2",
              data: { title: "Second blog post" },
            },
          ],
          "index.pages": [
            {
              collection: "index.pages",
              id: "en/blog/posts",
              data: { title: "Blog posts" },
            },
          ],
        },
      });

      const props = {
        entry,
        pagination: { currentPage: 1, lastPage: 1 },
      } satisfies ComponentProps<typeof CollectionListingView>;

      const result = await container.renderToString(CollectionListingView, {
        props,
      });

      expect(result).toContain("Blog posts");
      expect(result).toContain("First blog post");
      expect(result).toContain("Second blog post");
      expect(result).toContain("2 posts");
    });

    it<LocalTestContext>("renders blogroll collection with external links", async ({
      container,
    }) => {
      /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
      expect.assertions(4);

      const entry = await setupTestWithMockEntries({
        pageQuery: {
          collection: "pages",
          id: "blogroll",
          locale: "en",
        },
        testEntries: {
          blogroll: [
            {
              collection: "blogroll",
              id: "blogroll/blog-1",
              data: { title: "First blog", url: "https://example1.test" },
            },
            {
              collection: "blogroll",
              id: "blogroll/blog-2",
              data: {
                title: "Second blog",
                url: "https://example2.test",
              },
            },
          ],
          pages: [{ collection: "pages", id: "en/blogroll" }],
        },
      });

      const props = {
        entry,
        pagination: { currentPage: 1, lastPage: 1 },
      } satisfies ComponentProps<typeof CollectionListingView>;

      const result = await container.renderToString(CollectionListingView, {
        props,
      });

      expect(result).toContain("First blog");
      expect(result).toContain("Second blog");
      expect(result).toContain("Open website");
      expect(result).toContain("2 sites");
    });

    it<LocalTestContext>("renders projects collection with CTA", async ({
      container,
    }) => {
      /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
      expect.assertions(3);

      const entry = await setupTestWithMockEntries({
        pageQuery: {
          collection: "index.pages",
          id: "projects",
          locale: "en",
        },
        testEntries: {
          projects: [
            {
              collection: "projects",
              id: "en/projects/project-1",
              data: { title: "First project" },
            },
          ],
          "index.pages": [{ collection: "index.pages", id: "en/projects" }],
        },
      });

      const props = {
        entry,
        pagination: { currentPage: 1, lastPage: 1 },
      } satisfies ComponentProps<typeof CollectionListingView>;

      const result = await container.renderToString(CollectionListingView, {
        props,
      });

      expect(result).toContain("First project");
      expect(result).toContain("Discover");
      expect(result).toContain("1 projects");
    });

    it<LocalTestContext>("renders categories without CTA buttons", async ({
      container,
    }) => {
      /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
      expect.assertions(3);

      const entry = await setupTestWithMockEntries({
        pageQuery: {
          collection: "index.pages",
          id: "blog/categories",
          locale: "en",
        },
        testEntries: {
          "blog.categories": [
            {
              collection: "blog.categories",
              id: "en/blog/categories/cat-1",
              data: { title: "First category" },
            },
            {
              collection: "blog.categories",
              id: "en/blog/categories/cat-2",
              data: { title: "Second category" },
            },
          ],
          "index.pages": [
            { collection: "index.pages", id: "en/blog/categories" },
          ],
        },
      });

      const props = {
        entry,
        pagination: { currentPage: 1, lastPage: 1 },
      } satisfies ComponentProps<typeof CollectionListingView>;

      const result = await container.renderToString(CollectionListingView, {
        props,
      });

      expect(result).toContain("First category");
      expect(result).toContain("Second category");
      expect(result).toContain("2 categories");
    });

    it<LocalTestContext>("renders individual categories", async ({
      container,
    }) => {
      /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
      expect.assertions(2);

      const entry = await setupTestWithMockEntries({
        pageQuery: {
          collection: "blog.categories",
          id: "blog/categories/cat-1",
          locale: "en",
        },
        testEntries: {
          "blog.categories": [
            {
              collection: "blog.categories",
              id: "en/blog/categories/cat-1",
              data: { title: "First category" },
            },
          ],
          "blog.posts": [
            {
              collection: "blog.posts",
              id: "en/blog/posts/post-1",
              data: {
                meta: {
                  category: {
                    collection: "blog.categories",
                    id: "en/blog/categories/cat-1",
                  },
                },
                title: "First post",
              },
            },
          ],
          "index.pages": [
            { collection: "index.pages", id: "en/blog/categories" },
          ],
          tags: [], // ADD THIS - empty array is fine
        },
      });

      const props = {
        entry,
        pagination: { currentPage: 1, lastPage: 1 },
      } satisfies ComponentProps<typeof CollectionListingView>;

      const result = await container.renderToString(CollectionListingView, {
        props,
      });

      expect(result).toContain("First post");
      expect(result).toContain("1 posts");
    });

    it<LocalTestContext>("renders tags without CTA buttons", async ({
      container,
    }) => {
      /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
      expect.assertions(3);

      const entry = await setupTestWithMockEntries({
        pageQuery: {
          collection: "index.pages",
          id: "tags",
          locale: "en",
        },
        testEntries: {
          tags: [
            {
              collection: "tags",
              id: "en/tags/tag-1",
              data: {
                title: "First tag",
              },
            },
            {
              collection: "tags",
              id: "en/tags/tag-2",
              data: {
                title: "Second tag",
              },
            },
          ],
          "index.pages": [{ collection: "index.pages", id: "en/tags" }],
        },
      });

      const props = {
        entry,
        pagination: { currentPage: 1, lastPage: 1 },
      } satisfies ComponentProps<typeof CollectionListingView>;

      const result = await container.renderToString(CollectionListingView, {
        props,
      });

      expect(result).toContain("First tag");
      expect(result).toContain("Second tag");
      expect(result).toContain("2 tags");
    });

    it<LocalTestContext>("handles mixed collections on individual tags page", async ({
      container,
    }) => {
      /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
      expect.assertions(3);

      const entry = await setupTestWithMockEntries({
        pageQuery: {
          collection: "tags",
          id: "tags/tag-1",
          locale: "en",
        },
        testEntries: {
          "blog.posts": [
            {
              collection: "blog.posts",
              id: "en/post-1",
              data: {
                title: "First post",
                meta: { tags: [{ collection: "tags", id: "en/tags/tag-1" }] },
              },
            },
          ],
          projects: [
            {
              collection: "projects",
              id: "en/project-1",
              data: {
                title: "First project",
                meta: { tags: [{ collection: "tags", id: "en/tags/tag-1" }] },
              },
            },
          ],
          "index.pages": [{ collection: "index.pages", id: "en/tags" }],
          tags: [{ collection: "tags", id: "en/tags/tag-1" }],
        },
      });

      const props = {
        entry,
        pagination: { currentPage: 1, lastPage: 1 },
      } satisfies ComponentProps<typeof CollectionListingView>;

      const result = await container.renderToString(CollectionListingView, {
        props,
      });

      expect(result).toContain("First post");
      expect(result).toContain("First project");
      expect(result).toContain("2 entries");
    });
  });

  describe("Pagination", () => {
    it<LocalTestContext>("shows pagination when there are multiple pages", async ({
      container,
    }) => {
      /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
      expect.assertions(2);

      const entry = await setupTestWithMockEntries({
        pageQuery: {
          collection: "index.pages",
          id: "guides",
          locale: "en",
        },
        testEntries: {
          guides: [
            {
              collection: "guides",
              id: "en/guides/guide-1",
              data: {
                title: "First guide",
              },
            },
          ],
          "index.pages": [{ collection: "index.pages", id: "en/guides" }],
        },
      });

      const props = {
        entry: {
          ...entry,
          related: {
            ...entry.related,
            total: 25,
          },
        },
        pagination: { currentPage: 2, lastPage: 3 },
      } satisfies ComponentProps<typeof CollectionListingView>;

      const result = await container.renderToString(CollectionListingView, {
        props,
      });

      expect(result).toContain("25 guides");
      expect(result).toContain("pagination");
    });

    it<LocalTestContext>("hides pagination when there's only one page", async ({
      container,
    }) => {
      /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
      expect.assertions(2);

      const entry = await setupTestWithMockEntries({
        pageQuery: {
          collection: "index.pages",
          id: "guides",
          locale: "en",
        },
        testEntries: {
          guides: [
            {
              collection: "guides",
              id: "en/guides/guide-1",
              data: {
                title: "First guide",
              },
            },
          ],
          "index.pages": [{ collection: "index.pages", id: "en/guides" }],
        },
      });

      const props = {
        entry,
        pagination: { currentPage: 1, lastPage: 1 },
      } satisfies ComponentProps<typeof CollectionListingView>;

      const result = await container.renderToString(CollectionListingView, {
        props,
      });

      expect(result).toContain("1 guides");
      expect(result).not.toContain("pagination");
    });
  });
});

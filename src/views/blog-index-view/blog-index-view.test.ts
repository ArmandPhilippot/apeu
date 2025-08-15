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
import BlogIndexView from "./blog-index-view.astro";

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

vi.mock("../../utils/i18n", async (importOriginal) => {
  const mod = await importOriginal<typeof import("../../utils/i18n")>();
  return {
    ...mod,
    useI18n: vi.fn().mockReturnValue({
      locale: "en",
      translate: vi.fn().mockImplementation((key: string) => {
        const mockTranslations: Record<string, string> = {
          "cta.read.more.a11y": "a11y read more",
          "cta.read.more": "read more cta",
          "cta.subscribe.a11y": "Subscribe a11y",
          "page.blog.section.recent.posts.heading": "Recent posts",
          "page.blog.section.categories.heading": "All categories",
          "page.blog.posts.title": "Blog posts page",
        };

        return mockTranslations[key] ?? key;
      }),
      translatePlural: vi.fn().mockImplementation((key: string) => {
        const mockTranslations: Record<string, string> = {
          "cta.see.all.posts": "See all posts",
        };

        return mockTranslations[key] ?? key;
      }),
    }),
  };
});

const defaultProps = {
  entry: {
    Content: vi.fn().mockImplementation(() => null),
    collection: "index.pages",
    description: "The blog index view.",
    hasContent: false,
    headings: [],
    id: "en/blog",
    locale: "en",
    meta: {
      publishedOn: new Date(),
      updatedOn: new Date(),
    },
    route: "/blog",
    seo: {
      description: "",
      title: "Blog",
    },
    slug: "blog",
    title: "Blog",
  },
} satisfies ComponentProps<typeof BlogIndexView>;

function setupTestWithMockEntries(
  testEntries: Parameters<typeof createMockEntriesByCollection>[0]
) {
  const layoutEntries = createLayoutMockEntries(["en", "fr"]);
  const mockEntries = createMockEntriesByCollection(testEntries);
  const mergedMockEntries = mergeEntriesByCollection(
    layoutEntries,
    mockEntries
  );
  setupCollectionMocks(mergedMockEntries);
}

type LocalTestContext = {
  container: AstroContainer;
};

describe("BlogIndexView", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
    setupTestWithMockEntries({
      "index.pages": [{ collection: "index.pages", id: "en/blog/posts" }],
    });
  });

  afterEach(() => {
    clearEntriesIndexCache();
    vi.clearAllMocks();
  });

  it<LocalTestContext>("renders the blog sections", async ({ container }) => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(2);

    const result = await container.renderToString(BlogIndexView, {
      props: defaultProps,
    });

    expect(result).toContain("Recent posts");
    expect(result).toContain("All categories");
  });

  it<LocalTestContext>("renders the blog posts CTA", async ({ container }) => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(2);

    const result = await container.renderToString(BlogIndexView, {
      props: defaultProps,
    });

    expect(result).toContain("See all posts");
    expect(result).toContain("Subscribe a11y");
  });
});

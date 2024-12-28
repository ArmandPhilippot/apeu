import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { ComponentProps } from "astro/types";
import { beforeEach, describe, expect, it, vi } from "vitest";
import CollectionCard from "./collection-card.astro";

vi.mock("../../../utils/i18n", async () => {
  const originalModule = await vi.importActual("../../../utils/i18n");
  return {
    ...originalModule,
    useI18n: vi.fn(() => ({
      locale: "en",
      translate: (key: string) => `translated_${key}`,
      translatePlural: (key: string, { count }: { count: number }) =>
        `translated_${key}_${count}`,
    })),
  };
});

type LocalTestContext = {
  container: AstroContainer;
};

describe("CollectionCard", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
  });

  it<LocalTestContext>("renders basic card with required props", async ({
    container,
  }) => {
    const props = {
      entry: {
        collection: "blogPosts",
        id: "blog-post",
        description: "Test description",
        locale: "en",
        route: "/test",
        title: "Test Post",
      },
    } satisfies ComponentProps<typeof CollectionCard>;

    const result = await container.renderToString(CollectionCard, { props });

    expect(result).toContain("Test Post");
    expect(result).toContain("Test description");
    expect(result).toContain('href="/test"');
    expect(result).toContain("collection-card");
  });

  it<LocalTestContext>("renders card with featured meta", async ({
    container,
  }) => {
    const props = {
      entry: {
        collection: "blogPosts",
        description: "Test description",
        id: "blog-post",
        locale: "en",
        meta: {
          publishedOn: new Date("2024-01-01"),
        },
        route: "/test",
        title: "Test Post",
      },
      featuredMeta: {
        key: "publishedOn",
        icon: "arrow-right",
      },
    } satisfies ComponentProps<typeof CollectionCard>;

    const result = await container.renderToString(CollectionCard, { props });

    expect(result).toContain("2024-01-01");
  });

  it<LocalTestContext>("renders card with CTA button", async ({
    container,
  }) => {
    const props = {
      cta: {
        label: "Read More",
        icon: "arrow-right",
      },
      entry: {
        collection: "blogPosts",
        description: "Test description",
        id: "blog-post",
        locale: "en",
        route: "/test",
        title: "Test Post",
      },
    } satisfies ComponentProps<typeof CollectionCard>;

    const result = await container.renderToString(CollectionCard, { props });

    expect(result).toContain("Read More");
  });

  it<LocalTestContext>("renders card with cover image", async ({
    container,
  }) => {
    const props = {
      entry: {
        collection: "blogPosts",
        cover: {
          src: {
            format: "webp",
            height: 480,
            src: "/test-image.jpg",
            width: 640,
          },
          alt: "Test Image",
        },
        description: "Test description",
        id: "post",
        locale: "en",
        route: "/test",
        title: "Test Post",
      },
    } satisfies ComponentProps<typeof CollectionCard>;

    const result = await container.renderToString(CollectionCard, { props });

    expect(result).toContain("test-image.jpg");
    expect(result).toContain('alt="Test Image"');
    expect(result).toContain('width="640"');
    expect(result).toContain('height="480"');
  });

  it<LocalTestContext>("renders card with localized description", async ({
    container,
  }) => {
    const props = {
      entry: {
        collection: "blogroll",
        description: {
          en: "English description",
        },
        id: "blog",
        title: "Test blog",
        url: "/test",
      },
    } satisfies ComponentProps<typeof CollectionCard>;

    const result = await container.renderToString(CollectionCard, { props });

    expect(result).toContain("English description");
  });

  it<LocalTestContext>("renders card with feed button when available", async ({
    container,
  }) => {
    const props = {
      entry: {
        collection: "blogroll",
        description: {
          en: "Test description",
        },
        feed: "/feed.xml",
        id: "blog",
        title: "Test blog",
        url: "/test",
      },
      cta: {
        label: "Read More",
      },
    } satisfies ComponentProps<typeof CollectionCard>;

    const result = await container.renderToString(CollectionCard, { props });

    expect(result).toContain('href="/feed.xml"');
    expect(result).toContain("translated_cta.open.feed");
  });

  it<LocalTestContext>("sets correct heading level", async ({ container }) => {
    const props = {
      entry: {
        collection: "blogPosts",
        description: "Test description",
        id: "post",
        locale: "en",
        route: "/test",
        title: "Test Post",
      },
      headingLvl: "h3",
    } satisfies ComponentProps<typeof CollectionCard>;

    const result = await container.renderToString(CollectionCard, { props });

    expect(result).toContain("<h3");
  });

  it<LocalTestContext>("handles external CTA links", async ({ container }) => {
    const props = {
      entry: {
        collection: "bookmarks",
        description: "Test description",
        id: "bookmark",
        isQuote: false,
        title: "Test Post",
        url: "https://external-site.com",
      },
      cta: {
        label: "Visit Site",
        isExternal: true,
      },
    } satisfies ComponentProps<typeof CollectionCard>;

    const result = await container.renderToString(CollectionCard, { props });

    expect(result).toContain('href="https://external-site.com"');
  });

  it<LocalTestContext>("renders CTA with custom aria-label", async ({
    container,
  }) => {
    const props = {
      entry: {
        collection: "blogPosts",
        description: "Test description",
        id: "post",
        locale: "en",
        route: "/test",
        title: "Test Post",
      },
      cta: {
        label: "Read More",
        ariaLabel: "Read more about Test Post",
        icon: "arrow-right",
      },
    } satisfies ComponentProps<typeof CollectionCard>;

    const result = await container.renderToString(CollectionCard, { props });

    expect(result).toContain('aria-label="Read more about Test Post"');
  });

  it<LocalTestContext>("renders collection icon and label when showCollection is true", async ({
    container,
  }) => {
    const props = {
      entry: {
        collection: "blogPosts",
        description: "Test description",
        id: "post",
        locale: "en",
        route: "/test",
        title: "Test Post",
      },
      showCollection: true,
    } satisfies ComponentProps<typeof CollectionCard>;

    const result = await container.renderToString(CollectionCard, { props });

    expect(result).toContain('data-icon="blog"');
    expect(result).toContain("translated_meta.value.content.kind.blog.post");
    expect(result).toContain("collection-card-frontmatter");
  });

  it<LocalTestContext>("does not render CTA section when cta is undefined", async ({
    container,
  }) => {
    const props = {
      entry: {
        collection: "blogPosts",
        description: "Test description",
        id: "post",
        locale: "en",
        route: "/test",
        title: "Test Post",
      },
    } satisfies ComponentProps<typeof CollectionCard>;

    const result = await container.renderToString(CollectionCard, { props });

    expect(result).not.toContain("collection-card-cta");
  });
});

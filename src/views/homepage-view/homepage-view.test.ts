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
import HomepageView from "./homepage-view.astro";

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

vi.mock("../../services/i18n", async (importOriginal) => {
  const mod = await importOriginal<typeof import("../../services/i18n")>();
  return {
    ...mod,
    useI18n: vi.fn().mockReturnValue({
      locale: "en",
      translate: vi.fn().mockImplementation((key: string) => {
        const mockTranslations: Record<string, string> = {
          "page.home.section.about.heading": "About",
          "page.home.section.contact.heading": "Contact",
          "page.home.section.collections.heading": "Collections",
          "cta.subscribe.to.website": "Subscribe to website",
          "cta.subscribe": "Subscribe",
        };

        return mockTranslations[key] ?? key;
      }),
      translatePlural: vi.fn(),
    }),
  };
});

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

const defaultProps = {
  entry: {
    Content: vi.fn().mockImplementation(() => null),
    collection: "pages" as const,
    description: "The homepage view.",
    hasContent: false,
    headings: [],
    id: "en/home",
    locale: "en" as const,
    meta: {
      publishedOn: new Date(),
      updatedOn: new Date(),
    },
    route: "/",
    seo: {
      title: "Home",
      description: "Homepage description",
    },
    slug: "",
    title: "Home",
  },
} satisfies ComponentProps<typeof HomepageView>;

describe("HomepageView", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
    setupTestWithMockEntries({
      authors: [
        {
          collection: "authors",
          id: "armand-philippot",
          data: {
            avatar: {
              src: { format: "jpg", height: 80, src: "/avatar.jpg", width: 80 },
            },
            name: "John Doe",
          },
        },
      ],
    });
  });

  afterEach(() => {
    clearEntriesIndexCache();
    vi.clearAllMocks();
  });

  it<LocalTestContext>("renders all sections except homepage-content by default", async ({
    container,
  }) => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(5);

    const result = await container.renderToString(HomepageView, {
      props: defaultProps,
    });

    expect(result).toContain("homepage-greetings");
    expect(result).toContain("homepage-about");
    expect(result).toContain("homepage-contact");
    expect(result).toContain("homepage-collections");
    expect(result).not.toContain("homepage-content");
  });

  it<LocalTestContext>("renders collections section with feed link", async ({
    container,
  }) => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(3);

    const result = await container.renderToString(HomepageView, {
      props: defaultProps,
    });

    expect(result).toContain("Collections");
    expect(result).toContain("Subscribe");
    expect(result).toContain("feed.xml");
  });
});

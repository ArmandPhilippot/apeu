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
import FeedsView from "./feeds-view.astro";

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
          "page.feeds.global.feed.introduction": "Global Introduction",
          "page.feeds.individual.feeds.introduction": "Individual Introduction",
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
    description: "The feeds view.",
    hasContent: false,
    headings: [],
    id: "en/feeds",
    locale: "en" as const,
    meta: {
      publishedOn: new Date(),
      updatedOn: new Date(),
    },
    route: "/feeds",
    seo: {
      title: "Feeds",
      description: "The feeds page description",
    },
    slug: "feeds",
    title: "Feeds",
  },
} satisfies ComponentProps<typeof FeedsView>;

describe("FeedsView", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
    setupTestWithMockEntries({});
  });

  afterEach(() => {
    clearEntriesIndexCache();
    vi.clearAllMocks();
  });

  it<LocalTestContext>("renders the global and per collection feeds", async ({
    container,
  }) => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(4);

    const result = await container.renderToString(FeedsView, {
      props: defaultProps,
    });

    expect(result).toContain("Global Introduction");
    expect(result).toContain("Subscribe to website");
    expect(result).toContain("feed.xml");
    expect(result).toContain("Individual Introduction");
  });
});

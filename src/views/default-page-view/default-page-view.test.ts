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
import DefaultPageView from "./default-page-view.astro";

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
    description: "The page description.",
    hasContent: false,
    headings: [],
    id: "en/any-page",
    locale: "en" as const,
    meta: {
      publishedOn: new Date(),
      updatedOn: new Date(),
    },
    route: "/any-page",
    seo: {
      title: "Any page",
      description: "The page description",
    },
    slug: "any-page",
    title: "Any page",
  },
} satisfies ComponentProps<typeof DefaultPageView>;

describe("DefaultPageView", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
    setupTestWithMockEntries({});
  });

  afterEach(() => {
    clearEntriesIndexCache();
    vi.clearAllMocks();
  });

  it<LocalTestContext>("renders correctly the view", async ({ container }) => {
    expect.assertions(1);

    const result = await container.renderToString(DefaultPageView, {
      props: defaultProps,
    });

    expect(result).toContain(defaultProps.entry.title);
  });
});

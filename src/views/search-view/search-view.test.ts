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
import SearchView from "./search-view.astro";

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

describe("SearchView", () => {
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

  it<LocalTestContext>("renders the pagefind UI", async ({ container }) => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(2);

    const props = {
      entry: {
        Content: vi.fn().mockImplementation(() => null),
        collection: "pages",
        description: "The search page.",
        hasContent: false,
        headings: [],
        id: "en/search",
        locale: "en",
        meta: {
          publishedOn: new Date(),
          updatedOn: new Date(),
        },
        route: "/search",
        seo: {
          description: "",
          title: "Search",
        },
        slug: "search",
        title: "Search",
      },
    } satisfies ComponentProps<typeof SearchView>;
    const result = await container.renderToString(SearchView, {
      props,
    });

    expect(result).toContain("</ap-pagefind-search>");
    expect(result).toContain(`id="pagefind"`);
  });
});

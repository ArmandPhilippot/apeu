import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import {
  createMockEntries,
  setupCollectionMocks,
} from "../../../../tests/helpers/astro-content";
import { CONFIG } from "../../../utils/constants";
import { clearEntriesIndexCache } from "../../astro/collections/indexes";
import { getWebPageGraph } from "./webpage-graph";

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

vi.mock("../../../utils/images", () => {
  return {
    getImgSrc: (cover: Record<"src", string>) => cover.src,
  };
});

vi.mock("../../../services/i18n", async (importOriginal) => {
  const mod = await importOriginal<typeof import("../../../services/i18n")>();

  return {
    ...mod,
    useI18n: () => {
      return {
        translate: () => "https://creativecommons.org/licenses/by-sa/4.0/deed",
      };
    },
  };
});

type LocalTestContext = {
  basePageData: Parameters<typeof getWebPageGraph>[0];
};

describe("getWebPageGraph", () => {
  beforeAll(() => {
    const mockEntries = createMockEntries([
      { collection: "pages", id: "en/home" },
      { collection: "pages", id: "en/search" },
    ]);
    setupCollectionMocks(mockEntries);
  });

  beforeEach<LocalTestContext>((context) => {
    context.basePageData = {
      description: "Page description",
      locale: CONFIG.LANGUAGES.DEFAULT,
      meta: {
        publishedOn: new Date("2024-10-09T13:00:00.000Z"),
        updatedOn: new Date("2024-10-09T13:00:00.000Z"),
      },
      route: "/test-route",
      title: "Test Page Title",
    };
  });

  afterAll(() => {
    clearEntriesIndexCache();
  });

  it<LocalTestContext>("should generate WebPage with required properties", async ({
    basePageData,
  }) => {
    expect.assertions(1);

    const graph = await getWebPageGraph(basePageData);

    expect(graph).toMatchInlineSnapshot(`
      {
        "@id": "https://example.test/test-route",
        "@type": "WebPage",
        "author": {
          "@id": "https://example.test#author",
        },
        "copyrightHolder": {
          "@id": "https://example.test#author",
        },
        "dateCreated": "2024-10-09T13:00:00.000Z",
        "dateModified": "2024-10-09T13:00:00.000Z",
        "datePublished": "2024-10-09T13:00:00.000Z",
        "description": "Page description",
        "editor": {
          "@id": "https://example.test#author",
        },
        "headline": "Test Page Title",
        "isAccessibleForFree": true,
        "isPartOf": {
          "@id": "https://example.test/",
        },
        "lastReviewed": "2024-10-09T13:00:00.000Z",
        "license": "https://creativecommons.org/licenses/by-sa/4.0/deed",
        "name": "Test Page Title",
        "publisher": {
          "@id": "https://example.test#author",
        },
        "reviewedBy": {
          "@id": "https://example.test#author",
        },
        "url": "https://example.test/test-route",
      }
    `);
  });

  it<LocalTestContext>("should support custom page type", async ({
    basePageData,
  }) => {
    expect.assertions(1);

    const graph = await getWebPageGraph({
      ...basePageData,
      type: "ItemPage",
    });

    expect(graph["@type"]).toBe("ItemPage");
  });

  it<LocalTestContext>("should add breadcrumb when provided", async ({
    basePageData,
  }) => {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory.
    expect.assertions(2);

    const breadcrumb = [
      { label: "Home", url: "/" },
      { label: "Category", url: "/category" },
    ];

    const graph = await getWebPageGraph({
      ...basePageData,
      breadcrumb,
    });

    expect(graph).toHaveProperty("breadcrumb");
    expect(graph.breadcrumb).toMatchInlineSnapshot(`
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "item": {
              "@id": "/",
              "name": "Home",
            },
            "position": 1,
          },
          {
            "@type": "ListItem",
            "item": {
              "@id": "/category",
              "name": "Category",
            },
            "position": 2,
          },
        ],
      }
    `);
  });

  it<LocalTestContext>("should add reading time when provided", async ({
    basePageData,
  }) => {
    expect.assertions(1);

    const graph = await getWebPageGraph({
      ...basePageData,
      meta: {
        ...basePageData.meta,
        readingTime: {
          inMinutes: 2,
          inMinutesAndSeconds: { minutes: 1, seconds: 55 },
          wordsCount: 250,
          wordsPerMinute: 80,
        },
      },
    });

    expect(graph.timeRequired).toBe("PT1M55S");
  });

  it<LocalTestContext>("should add cover image when provided", async ({
    basePageData,
  }) => {
    expect.assertions(1);

    const cover = {
      alt: "Image description",
      height: 480,
      src: "https://example.test/image.jpg",
      width: 640,
    };

    const graph = await getWebPageGraph({
      ...basePageData,
      cover,
    });

    expect(graph.thumbnailUrl).toBe("https://example.test/image.jpg");
  });

  it<LocalTestContext>("should combine all optional properties correctly", async ({
    basePageData,
  }) => {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory.
    expect.assertions(4);

    const breadcrumb = [{ label: "Home", url: "/" }];
    const cover = {
      alt: "Image description",
      height: 480,
      src: "https://example.test/image.jpg",
      width: 640,
    };
    const readingTime = {
      inMinutes: 2,
      inMinutesAndSeconds: { minutes: 1, seconds: 55 },
      wordsCount: 250,
      wordsPerMinute: 80,
    };

    const graph = await getWebPageGraph({
      ...basePageData,
      breadcrumb,
      cover,
      type: "ItemPage",
      meta: {
        ...basePageData.meta,
        readingTime,
      },
    });

    expect(graph["@type"]).toBe("ItemPage");
    expect(graph.breadcrumb).toBeDefined();
    expect(graph.thumbnailUrl).toBe("https://example.test/image.jpg");
    expect(graph.timeRequired).toBe("PT1M55S");
  });
});

import { describe, expect, it, vi } from "vitest";
import { CONFIG } from "../../../utils/constants";
import { getWebPageGraph } from "./webpage-graph";

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

vi.mock("../../../utils/i18n", () => {
  return {
    useI18n: () => {
      return {
        route: (path: string) => (path === "home" ? "/" : `/${path}`),
        translate: () => "https://creativecommons.org/licenses/by-sa/4.0/deed",
      };
    },
  };
});

describe("getWebPageGraph", () => {
  const basePageData = {
    description: "Page description",
    locale: CONFIG.LANGUAGES.DEFAULT,
    meta: {
      publishedOn: new Date("2024-10-09T13:00:00.000Z"),
      updatedOn: new Date("2024-10-09T13:00:00.000Z"),
    },
    route: "/test-route",
    title: "Test Page Title",
  };

  it("should generate WebPage with required properties", async () => {
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

  it("should support custom page type", async () => {
    expect.assertions(1);

    const graph = await getWebPageGraph({
      ...basePageData,
      type: "ItemPage",
    });

    expect(graph["@type"]).toBe("ItemPage");
  });

  it("should add breadcrumb when provided", async () => {
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

  it("should add reading time when provided", async () => {
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

  it("should add cover image when provided", async () => {
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

  it("should combine all optional properties correctly", async () => {
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

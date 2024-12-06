import { describe, expect, it, vi } from "vitest";
import { CONFIG } from "../../../utils/constants";
import { getWebPageGraph } from "./webpage-graph";

vi.mock("../../../utils/constants", async (importOriginal) => {
  const mod =
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    await importOriginal<typeof import("../../../utils/constants")>();
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
  const mod =
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    await importOriginal<typeof import("../../../utils/url")>();
  return {
    ...mod,
    getWebsiteUrl: () => "https://example.test",
  };
});

describe("get-webpage-graph", () => {
  it("returns an object describing the webpage", async () => {
    const graph = await getWebPageGraph({
      description: "Quam omnis in temporibus.",
      locale: CONFIG.LANGUAGES.DEFAULT,
      meta: {
        publishedOn: new Date("2024-10-09T13:55:57.813Z"),
        updatedOn: new Date("2024-10-09T13:55:57.813Z"),
      },
      route: "/some-route",
      title: "beatae autem in",
    });

    expect.assertions(1);

    expect(graph).toMatchInlineSnapshot(`
      {
        "@id": "https://example.test/some-route",
        "@type": "WebPage",
        "author": {
          "@id": "https://example.test#author",
        },
        "copyrightHolder": {
          "@id": "https://example.test#author",
        },
        "dateCreated": "2024-10-09T13:55:57.813Z",
        "dateModified": "2024-10-09T13:55:57.813Z",
        "datePublished": "2024-10-09T13:55:57.813Z",
        "description": "Quam omnis in temporibus.",
        "editor": {
          "@id": "https://example.test#author",
        },
        "headline": "beatae autem in",
        "isAccessibleForFree": true,
        "isPartOf": {
          "@id": "https://example.test/",
        },
        "lastReviewed": "2024-10-09T13:55:57.813Z",
        "license": "https://creativecommons.org/licenses/by-sa/4.0/deed",
        "name": "beatae autem in",
        "publisher": {
          "@id": "https://example.test#author",
        },
        "reviewedBy": {
          "@id": "https://example.test#author",
        },
        "url": "https://example.test/some-route",
      }
    `);
  });

  it("can use a different type to describe the webpage", async () => {
    const graph = await getWebPageGraph({
      description: "Quam omnis in temporibus.",
      locale: CONFIG.LANGUAGES.DEFAULT,
      meta: {
        publishedOn: new Date("2024-10-09T13:55:57.813Z"),
        updatedOn: new Date("2024-10-09T13:55:57.813Z"),
      },
      route: "/some-route",
      title: "beatae autem in",
      type: "ItemPage",
    });

    expect.assertions(1);

    expect(graph).toMatchInlineSnapshot(`
      {
        "@id": "https://example.test/some-route",
        "@type": "ItemPage",
        "author": {
          "@id": "https://example.test#author",
        },
        "copyrightHolder": {
          "@id": "https://example.test#author",
        },
        "dateCreated": "2024-10-09T13:55:57.813Z",
        "dateModified": "2024-10-09T13:55:57.813Z",
        "datePublished": "2024-10-09T13:55:57.813Z",
        "description": "Quam omnis in temporibus.",
        "editor": {
          "@id": "https://example.test#author",
        },
        "headline": "beatae autem in",
        "isAccessibleForFree": true,
        "isPartOf": {
          "@id": "https://example.test/",
        },
        "lastReviewed": "2024-10-09T13:55:57.813Z",
        "license": "https://creativecommons.org/licenses/by-sa/4.0/deed",
        "name": "beatae autem in",
        "publisher": {
          "@id": "https://example.test#author",
        },
        "reviewedBy": {
          "@id": "https://example.test#author",
        },
        "url": "https://example.test/some-route",
      }
    `);
  });

  it("can add optional properties to the object describing the webpage", async () => {
    const graph = await getWebPageGraph({
      breadcrumb: [
        { label: "qui", url: "/qui" },
        { label: "molestiae", url: "/molestiae" },
      ],
      cover: {
        alt: "ea consectetur perferendis",
        height: 480,
        src: "https://picsum.photos/640/480",
        width: 640,
      },
      description: "Quam omnis in temporibus.",
      locale: CONFIG.LANGUAGES.DEFAULT,
      meta: {
        publishedOn: new Date("2024-10-09T13:55:57.813Z"),
        readingTime: {
          inMinutes: 2,
          inMinutesAndSeconds: { minutes: 1, seconds: 55 },
          wordsCount: 250,
          wordsPerMinute: 80,
        },
        updatedOn: new Date("2024-10-09T13:55:57.813Z"),
      },
      route: "/some-route",
      title: "beatae autem in",
    });

    expect.assertions(1);

    expect(graph).toMatchInlineSnapshot(`
      {
        "@id": "https://example.test/some-route",
        "@type": "WebPage",
        "author": {
          "@id": "https://example.test#author",
        },
        "breadcrumb": {
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@id": "/qui",
              "@type": "ListItem",
              "name": "qui",
              "position": 1,
            },
            {
              "@id": "/molestiae",
              "@type": "ListItem",
              "name": "molestiae",
              "position": 2,
            },
          ],
        },
        "copyrightHolder": {
          "@id": "https://example.test#author",
        },
        "dateCreated": "2024-10-09T13:55:57.813Z",
        "dateModified": "2024-10-09T13:55:57.813Z",
        "datePublished": "2024-10-09T13:55:57.813Z",
        "description": "Quam omnis in temporibus.",
        "editor": {
          "@id": "https://example.test#author",
        },
        "headline": "beatae autem in",
        "isAccessibleForFree": true,
        "isPartOf": {
          "@id": "https://example.test/",
        },
        "lastReviewed": "2024-10-09T13:55:57.813Z",
        "license": "https://creativecommons.org/licenses/by-sa/4.0/deed",
        "name": "beatae autem in",
        "publisher": {
          "@id": "https://example.test#author",
        },
        "reviewedBy": {
          "@id": "https://example.test#author",
        },
        "thumbnailUrl": "https://picsum.photos/640/480",
        "timeRequired": "PT1M55S",
        "url": "https://example.test/some-route",
      }
    `);
  });
});

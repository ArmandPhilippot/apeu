import { describe, expect, it, vi } from "vitest";
import { CONFIG } from "../../../utils/constants";
import { getArticleGraph } from "./article-graph";

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

describe("get-article-graph", () => {
  it("returns an object describing the article", async () => {
    const graph = await getArticleGraph({
      collection: "notes",
      cover: null,
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
        "@id": "https://example.test/some-route#article",
        "@type": "Article",
        "copyrightYear": 2024,
        "dateCreated": "2024-10-09T13:55:57.813Z",
        "dateModified": "2024-10-09T13:55:57.813Z",
        "datePublished": "2024-10-09T13:55:57.813Z",
        "description": "Quam omnis in temporibus.",
        "editor": {
          "@id": "https://example.test#author",
        },
        "headline": "beatae autem in",
        "inLanguage": {
          "@type": "Language",
          "alternateName": "en",
          "name": "English",
        },
        "isAccessibleForFree": true,
        "license": "https://creativecommons.org/licenses/by-sa/4.0/deed",
        "mainEntityOfPage": {
          "@id": "https://example.test/some-route",
        },
        "name": "beatae autem in",
        "publisher": {
          "@id": "https://example.test#author",
        },
        "url": "https://example.test/some-route",
      }
    `);
  });

  it("can add optional properties to the object describing the article", async () => {
    const graph = await getArticleGraph({
      collection: "guides",
      cover: {
        alt: "ea consectetur perferendis",
        height: 480,
        src: "https://picsum.photos/640/480",
        width: 640,
      },
      description: "Quam omnis in temporibus.",
      locale: CONFIG.LANGUAGES.DEFAULT,
      meta: {
        authors: [
          { isWebsiteOwner: false, name: "John Doe" },
          { isWebsiteOwner: true, name: "Armand" },
        ],
        publishedOn: new Date("2024-10-09T13:55:57.813Z"),
        readingTime: {
          inMinutes: 2,
          inMinutesAndSeconds: { minutes: 1, seconds: 55 },
          wordsCount: 250,
          wordsPerMinute: 80,
        },
        tags: [
          { title: "tenetur", route: "/tenetur" },
          { title: "iste", route: "/iste" },
        ],
        updatedOn: new Date("2024-10-09T13:55:57.813Z"),
      },
      route: "/some-route",
      title: "beatae autem in",
    });

    expect.assertions(1);

    expect(graph).toMatchInlineSnapshot(`
      {
        "@id": "https://example.test/some-route#article",
        "@type": "Article",
        "author": [
          {
            "@type": "Person",
            "name": "John Doe",
          },
          {
            "@id": "https://example.test#author",
            "@type": "Person",
            "name": "Armand",
          },
        ],
        "copyrightHolder": [
          {
            "@type": "Person",
            "name": "John Doe",
          },
          {
            "@id": "https://example.test#author",
            "@type": "Person",
            "name": "Armand",
          },
        ],
        "copyrightYear": 2024,
        "dateCreated": "2024-10-09T13:55:57.813Z",
        "dateModified": "2024-10-09T13:55:57.813Z",
        "datePublished": "2024-10-09T13:55:57.813Z",
        "description": "Quam omnis in temporibus.",
        "editor": {
          "@id": "https://example.test#author",
        },
        "headline": "beatae autem in",
        "image": "https://picsum.photos/640/480",
        "inLanguage": {
          "@type": "Language",
          "alternateName": "en",
          "name": "English",
        },
        "isAccessibleForFree": true,
        "keywords": "tenetur,iste",
        "license": "https://creativecommons.org/licenses/by-sa/4.0/deed",
        "mainEntityOfPage": {
          "@id": "https://example.test/some-route",
        },
        "name": "beatae autem in",
        "publisher": {
          "@id": "https://example.test#author",
        },
        "thumbnailUrl": "https://picsum.photos/640/480",
        "timeRequired": "PT1M55S",
        "url": "https://example.test/some-route",
        "wordCount": 250,
      }
    `);
  });

  it("can use a different when describing a blog post", async () => {
    const graph = await getArticleGraph({
      collection: "blogPosts",
      cover: null,
      description: "Quam omnis in temporibus.",
      locale: CONFIG.LANGUAGES.DEFAULT,
      meta: {
        authors: [{ isWebsiteOwner: false, name: "John Doe" }],
        category: { title: "animi", route: "/animi" },
        publishedOn: new Date("2024-10-09T13:55:57.813Z"),
        updatedOn: new Date("2024-10-09T13:55:57.813Z"),
      },
      route: "/some-route",
      title: "beatae autem in",
    });

    expect.assertions(1);

    expect(graph).toMatchInlineSnapshot(`
      {
        "@id": "https://example.test/some-route#article",
        "@type": "BlogPosting",
        "author": [
          {
            "@type": "Person",
            "name": "John Doe",
          },
        ],
        "copyrightHolder": [
          {
            "@type": "Person",
            "name": "John Doe",
          },
        ],
        "copyrightYear": 2024,
        "dateCreated": "2024-10-09T13:55:57.813Z",
        "dateModified": "2024-10-09T13:55:57.813Z",
        "datePublished": "2024-10-09T13:55:57.813Z",
        "description": "Quam omnis in temporibus.",
        "editor": {
          "@id": "https://example.test#author",
        },
        "headline": "beatae autem in",
        "inLanguage": {
          "@type": "Language",
          "alternateName": "en",
          "name": "English",
        },
        "isAccessibleForFree": true,
        "isPartOf": {
          "@id": "https://example.test/blog#blog",
        },
        "license": "https://creativecommons.org/licenses/by-sa/4.0/deed",
        "mainEntityOfPage": {
          "@id": "https://example.test/some-route",
        },
        "name": "beatae autem in",
        "publisher": {
          "@id": "https://example.test#author",
        },
        "url": "https://example.test/some-route",
      }
    `);
  });
});

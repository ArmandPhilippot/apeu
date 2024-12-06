import { describe, expect, it, vi } from "vitest";
import { CONFIG } from "../../../utils/constants";
import { getBlogGraph } from "./blog-graph";

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

describe("get-blog-graph", () => {
  it("returns an object describing the blog", async () => {
    const graph = await getBlogGraph({
      description: "Quam omnis in temporibus.",
      locale: CONFIG.LANGUAGES.DEFAULT,
      meta: {
        publishedOn: new Date("2024-10-09T13:55:57.813Z"),
        updatedOn: new Date("2024-10-09T13:55:57.813Z"),
      },
      title: "beatae autem in",
    });

    expect.assertions(1);

    expect(graph).toMatchInlineSnapshot(`
      {
        "@id": "https://example.test/blog#blog",
        "@type": "Blog",
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
        "license": "https://creativecommons.org/licenses/by-sa/4.0/deed",
        "mainEntityOfPage": "https://example.test/blog",
        "name": "beatae autem in",
        "publisher": {
          "@id": "https://example.test#author",
        },
        "url": "https://example.test/blog",
      }
    `);
  });

  it("can add optional properties to the object describing the blog", async () => {
    const graph = await getBlogGraph({
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
        updatedOn: new Date("2024-10-09T13:55:57.813Z"),
      },
      title: "beatae autem in",
    });

    expect.assertions(1);

    expect(graph).toMatchInlineSnapshot(`
      {
        "@id": "https://example.test/blog#blog",
        "@type": "Blog",
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
        "license": "https://creativecommons.org/licenses/by-sa/4.0/deed",
        "mainEntityOfPage": "https://example.test/blog",
        "name": "beatae autem in",
        "publisher": {
          "@id": "https://example.test#author",
        },
        "thumbnailUrl": "https://picsum.photos/640/480",
        "url": "https://example.test/blog",
      }
    `);
  });
});

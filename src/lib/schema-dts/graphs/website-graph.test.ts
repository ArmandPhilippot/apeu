import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import {
  createMockEntries,
  setupCollectionMocks,
} from "../../../../tests/helpers/astro-content";
import { CONFIG } from "../../../utils/constants";
import { clearEntriesIndexCache } from "../../astro/collections/indexes";
import { getWebSiteGraph } from "./website-graph";

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
    WEBSITE_URL: "https://example.test",
  };
});

describe("get-website-graph", () => {
  beforeAll(() => {
    const mockEntries = createMockEntries([
      { collection: "pages", id: "en/home" },
      { collection: "pages", id: "en/search" },
    ]);
    setupCollectionMocks(mockEntries);
  });

  afterAll(() => {
    clearEntriesIndexCache();
  });

  it("returns an object describing the website", async () => {
    expect.assertions(1);

    const graph = await getWebSiteGraph({
      description: "minus perspiciatis voluptatem",
      locale: CONFIG.LANGUAGES.DEFAULT,
      logo: "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/899.jpg",
    });

    expect(graph).toMatchInlineSnapshot(`
      {
        "@id": "https://example.test/",
        "@type": "WebSite",
        "author": {
          "@id": "https://example.test#author",
        },
        "copyrightHolder": {
          "@id": "https://example.test#author",
        },
        "copyrightYear": 2024,
        "creator": {
          "@id": "https://example.test#author",
        },
        "description": "minus perspiciatis voluptatem",
        "editor": {
          "@id": "https://example.test#author",
        },
        "image": "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/899.jpg",
        "inLanguage": {
          "@type": "Language",
          "alternateName": "en",
          "name": "English",
        },
        "isAccessibleForFree": true,
        "license": "https://creativecommons.org/licenses/by-sa/4.0/deed",
        "name": "Armand Philippot",
        "potentialAction": {
          "@type": "SearchAction",
          "query": "required",
          "query-input": "required name=query",
          "target": "https://example.test/search?q={query}",
        },
        "publisher": {
          "@id": "https://example.test#author",
        },
        "thumbnailUrl": "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/899.jpg",
        "url": "https://example.test/",
      }
    `);
  });
});

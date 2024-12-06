import { describe, expect, it, vi } from "vitest";
import { CONFIG } from "../../../utils/constants";
import { getWebSiteGraph } from "./website-graph";

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

describe("get-website-graph", () => {
  it("returns an object describing the website", () => {
    const graph = getWebSiteGraph({
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

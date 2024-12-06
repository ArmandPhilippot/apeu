import { describe, expect, it, vi } from "vitest";
import { CONFIG } from "../../../utils/constants";
import { getPersonGraph } from "./person-graph";

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

describe("get-person-graph", () => {
  it("returns an object describing the person", async () => {
    const graph = await getPersonGraph(
      {
        firstName: "John",
        isWebsiteOwner: false,
        lastName: "Doe",
        name: "John Doe",
      },
      CONFIG.LANGUAGES.DEFAULT,
    );

    expect.assertions(1);

    expect(graph).toMatchInlineSnapshot(`
      {
        "@type": "Person",
        "familyName": "Doe",
        "givenName": "John",
        "name": "John Doe",
      }
    `);
  });

  it("can return an object describing the person using optional properties", async () => {
    const graph = await getPersonGraph(
      {
        avatar: {
          src: "https://picsum.photos/640/480",
        },
        firstName: "John",
        isWebsiteOwner: false,
        job: "unknown",
        lastName: "Doe",
        name: "John Doe",
        spokenLanguages: ["en", "fr"],
        nationality: "FR",
        website: "https://example.test",
      },
      CONFIG.LANGUAGES.DEFAULT,
    );

    expect.assertions(1);

    expect(graph).toMatchInlineSnapshot(`
      {
        "@type": "Person",
        "familyName": "Doe",
        "givenName": "John",
        "image": "https://picsum.photos/640/480",
        "jobTitle": "unknown",
        "knowsLanguage": [
          {
            "@type": "Language",
            "alternateName": "en",
            "name": "English",
          },
          {
            "@type": "Language",
            "alternateName": "fr",
            "name": "French",
          },
        ],
        "name": "John Doe",
        "nationality": {
          "@type": "Country",
          "alternateName": "FR",
          "name": "France",
        },
        "url": "https://example.test",
      }
    `);
  });

  it("can add an id when the person is the website owner", async () => {
    const graph = await getPersonGraph(
      {
        firstName: "John",
        isWebsiteOwner: true,
        lastName: "Doe",
        name: "John Doe",
      },
      CONFIG.LANGUAGES.DEFAULT,
    );

    expect.assertions(1);

    expect(graph).toMatchInlineSnapshot(`
      {
        "@id": "https://example.test#author",
        "@type": "Person",
        "familyName": "Doe",
        "givenName": "John",
        "name": "John Doe",
      }
    `);
  });
});

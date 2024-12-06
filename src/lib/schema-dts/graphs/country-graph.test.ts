import { describe, expect, it, vi } from "vitest";
import { CONFIG } from "../../../utils/constants";
import { getCountryGraph } from "./country-graph";

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

describe("get-country-graph", () => {
  it("returns an object describing the country", () => {
    const graph = getCountryGraph("FR", CONFIG.LANGUAGES.DEFAULT);

    expect(graph).toMatchInlineSnapshot(`
      {
        "@type": "Country",
        "alternateName": "FR",
        "name": "France",
      }
    `);
  });
});

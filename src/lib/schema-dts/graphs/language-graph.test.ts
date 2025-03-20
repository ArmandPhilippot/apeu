import { describe, expect, it, vi } from "vitest";
import { CONFIG } from "../../../utils/constants";
import { getLanguageGraph } from "./language-graph";

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

describe("get-language-graph", () => {
  it("returns an object describing the language", () => {
    const graph = getLanguageGraph("en", CONFIG.LANGUAGES.DEFAULT);

    expect(graph).toMatchInlineSnapshot(`
      {
        "@type": "Language",
        "alternateName": "en",
        "name": "English",
      }
    `);
  });
});

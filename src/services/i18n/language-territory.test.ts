import { describe, expect, it, vi } from "vitest";
import { getLanguageTerritory } from "./language-territory";

vi.mock("../../utils/constants", async (importOriginal) => {
  const mod = await importOriginal<typeof import("../../utils/constants")>();
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

describe("get-language-territory", () => {
  it("returns the language+territory code for the default locale", () => {
    expect(getLanguageTerritory()).toBe(getLanguageTerritory("en"));
  });

  it("returns the language+territory code for the given locale", () => {
    expect(getLanguageTerritory("en")).toMatchInlineSnapshot(`"en_US"`);
  });

  it("throws an error if the given locale is not supported", () => {
    expect(() => getLanguageTerritory("ru")).toThrowErrorMatchingInlineSnapshot(
      `[Error: Locale not supported. Received: ru]`
    );
  });
});

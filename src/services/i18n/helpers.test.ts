import { describe, expect, it, vi } from "vitest";
import {
  getCurrentLocale,
  isAvailableLanguage,
  isValidCountryCode,
  isValidLanguageCode,
} from "./helpers";

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

describe("is-available-language", () => {
  it("returns true if the given language is valid", () => {
    expect(isAvailableLanguage("en")).toBe(true);
  });

  it("returns false if the given language is invalid", () => {
    expect(isAvailableLanguage("et")).toBe(false);
  });
});

describe("get-current-locale", () => {
  it("returns the given locale when it is a valid", () => {
    const locale = "en";

    expect(getCurrentLocale(locale)).toBe(locale);
  });

  it("returns the default locale when it is invalid", () => {
    expect(getCurrentLocale("foo")).toBe("en");
  });
});

describe("is-valid-country-code", () => {
  it("returns true when the given code exists", () => {
    const code = "FR";

    expect(isValidCountryCode(code)).toBe(true);
  });

  it("returns false when a valid code is not supported", () => {
    const code = "ES";

    expect(isValidCountryCode(code)).toBe(false);
  });

  it("returns false when the given code does not exist", () => {
    const code = "foo";

    expect(isValidCountryCode(code)).toBe(false);
  });
});

describe("is-valid-language-code", () => {
  it("returns true when the given code exists", () => {
    const code = "en";

    expect(isValidLanguageCode(code)).toBe(true);
  });

  it("returns false when a valid code is not supported", () => {
    const code = "ru";

    expect(isValidLanguageCode(code)).toBe(false);
  });

  it("returns false when the given code does not exist", () => {
    const code = "foo";

    expect(isValidLanguageCode(code)).toBe(false);
  });
});

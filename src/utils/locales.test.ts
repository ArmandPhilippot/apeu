import { describe, expect, it } from "vitest";
import { isValidCountryCode, isValidLanguageCode } from "./locales";

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

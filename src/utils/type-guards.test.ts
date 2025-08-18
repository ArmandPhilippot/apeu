import { describe, expect, it, vi } from "vitest";
import {
  isAvailableLocale,
  isKeyExistIn,
  isObject,
  isString,
  isValidCalloutType,
  isValidCountryCode,
  isValidLanguageCode,
  isValidSocialMedium,
  isValidTheme,
} from "./type-guards";

vi.mock("./constants", async (importOriginal) => {
  const mod = await importOriginal<typeof import("./constants")>();
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

const randomNumber = 42;

describe("is-object", () => {
  it("returns true if the value is an object", () => {
    expect(isObject({})).toBe(true);
  });

  it("returns false if the value is an array", () => {
    expect(isObject([])).toBe(false);
  });

  it("returns false if the value is a boolean", () => {
    expect(isObject(false)).toBe(false);
  });

  it("returns false if the value is null", () => {
    expect(isObject(null)).toBe(false);
  });

  it("returns false if the value is a number", () => {
    expect(isObject(randomNumber)).toBe(false);
  });

  it("returns false if the value is a string", () => {
    expect(isObject("vitae")).toBe(false);
  });

  it("returns false if the value is undefined", () => {
    expect(isObject(undefined)).toBe(false);
  });
});

describe("is-key-exist", () => {
  it("returns true if the key exists in the object", () => {
    const obj = { foo: "", bar: "" };

    expect(isKeyExistIn(obj, "foo")).toBe(true);
  });

  it("returns false if the key does not exist in the object", () => {
    const obj = { foo: "", bar: "" };

    expect(isKeyExistIn(obj, "baz")).toBe(false);
  });

  it("throws an error if the first argument is not an object", () => {
    expect(() => isKeyExistIn([], "foo")).toThrowError(
      "First argument must be an object."
    );
  });
});

describe("is-string", () => {
  it("returns false if the value is a string", () => {
    expect(isString("vitae")).toBe(true);
  });

  it("returns false if the value is an array", () => {
    expect(isString([])).toBe(false);
  });

  it("returns false if the value is a boolean", () => {
    expect(isString(false)).toBe(false);
  });

  it("returns false if the value is null", () => {
    expect(isString(null)).toBe(false);
  });

  it("returns false if the value is a number", () => {
    expect(isString(randomNumber)).toBe(false);
  });

  it("returns true if the value is an object", () => {
    expect(isString({})).toBe(false);
  });

  it("returns false if the value is undefined", () => {
    expect(isString(undefined)).toBe(false);
  });
});

describe("is-available-language", () => {
  it("returns true if the given language is valid", () => {
    expect(isAvailableLocale("en")).toBe(true);
  });

  it("returns false if the given language is invalid", () => {
    expect(isAvailableLocale("et")).toBe(false);
  });
});

describe("is-valid-callout-type", () => {
  it("returns true when the medium is valid", () => {
    expect(isValidCalloutType("critical")).toBe(true);
  });

  it("returns false when the medium is invalid", () => {
    expect(isValidCalloutType("foo")).toBe(false);
  });

  it("returns false when the medium is not a string", () => {
    expect(isValidCalloutType(randomNumber)).toBe(false);
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

describe("is-valid-social-medium", () => {
  it("returns true when the medium is valid", () => {
    expect(isValidSocialMedium("facebook")).toBe(true);
  });

  it("returns false when the medium is invalid", () => {
    expect(isValidSocialMedium("foo")).toBe(false);
  });

  it("returns false when the medium is not a string", () => {
    expect(isValidSocialMedium(randomNumber)).toBe(false);
  });
});

describe("is-valid-theme", () => {
  it("returns true when the value is `auto`", () => {
    expect(isValidTheme("auto")).toBe(true);
  });

  it("returns true when the value is `dark`", () => {
    expect(isValidTheme("dark")).toBe(true);
  });

  it("returns true when the value is `light`", () => {
    expect(isValidTheme("light")).toBe(true);
  });

  it("returns true when the value is invalid", () => {
    expect(isValidTheme("foo")).toBe(false);
  });
});

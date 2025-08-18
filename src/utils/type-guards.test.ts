import { describe, expect, it } from "vitest";
import {
  isKeyExistIn,
  isObject,
  isString,
  isValidCalloutType,
  isValidSocialMedium,
} from "./type-guards";

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

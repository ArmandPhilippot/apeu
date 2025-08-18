import { describe, expect, it } from "vitest";
import { capitalizeFirstLetter, removeTrailingSlashes } from "./strings";

describe("capitalize-first-letter", () => {
  it("returns a capitalized string", () => {
    const input = "maiores";
    const result = capitalizeFirstLetter(input);

    expect(result).toMatchInlineSnapshot(`"Maiores"`);
  });
});

describe("remove-trailing-slashes", () => {
  it("can remove a single slash at the end of a string", () => {
    const expectedStr = "dolores";
    const result = removeTrailingSlashes(`${expectedStr}/`);

    expect(result).toBe(expectedStr);
  });

  it("can remove a multiple slashes at the end of a string", () => {
    const expectedStr = "dolores";
    const result = removeTrailingSlashes(`${expectedStr}////`);

    expect(result).toBe(expectedStr);
  });

  it("returns the same string if there are no slashes at the end", () => {
    const expectedStr = "dolores";
    const result = removeTrailingSlashes(expectedStr);

    expect(result).toBe(expectedStr);
  });

  it("returns an empty string if the given string only contains slashes", () => {
    const expectedStr = "///";
    const result = removeTrailingSlashes(expectedStr);

    expect(result).toBe("");
  });
});

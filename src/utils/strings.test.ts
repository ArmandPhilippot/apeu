import { describe, expect, it } from "vitest";
import { capitalizeFirstLetter } from "./strings";

describe("capitalize-first-letter", () => {
  it("returns a capitalized string", () => {
    const input = "maiores";
    const result = capitalizeFirstLetter(input);

    expect(result).toMatchInlineSnapshot(`"Maiores"`);
  });
});

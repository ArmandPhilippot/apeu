import { describe, expect, it } from "vitest";
import { isValidSocialMedium } from "./social";

describe("is-valid-social-medium", () => {
  it("returns true when the medium is valid", () => {
    expect(isValidSocialMedium("facebook")).toBe(true);
  });

  it("returns false when the medium is invalid", () => {
    expect(isValidSocialMedium("foo")).toBe(false);
  });

  it("returns false when the medium is not a string", () => {
    expect(isValidSocialMedium(2)).toBe(false);
  });
});

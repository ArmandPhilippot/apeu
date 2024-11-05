import { describe, expect, it } from "vitest";
import { isValidTheme } from "./themes";

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

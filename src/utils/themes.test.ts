import { describe, expect, it } from "vitest";
import {
  getPreferredColorScheme,
  isValidTheme,
  resolveCurrentColorScheme,
} from "./themes";

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

describe("get-preferred-color-scheme", () => {
  it("returns dark when prefers-color-scheme is not set to dark", () => {
    expect(getPreferredColorScheme()).toBe("light");
  });
});

describe("resolve-current-color-scheme", () => {
  it("returns dark when the given theme is dark", () => {
    expect(resolveCurrentColorScheme("dark")).toBe("dark");
  });

  it("returns light when the given theme is light", () => {
    expect(resolveCurrentColorScheme("light")).toBe("light");
  });

  it("returns light by default when the given theme is set to auto", () => {
    expect(resolveCurrentColorScheme("auto")).toBe("light");
  });
});

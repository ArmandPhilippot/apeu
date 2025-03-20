import { describe, expect, it } from "vitest";
import { isValidSettingsKey, type Settings } from "./settings";

describe("is-valid-settings-key", () => {
  it("returns true when the given string matches a setting key", () => {
    const key = "theme" satisfies keyof Settings;

    expect(isValidSettingsKey(key)).toBe(true);
  });

  it("returns false otherwise", () => {
    expect(isValidSettingsKey("foo")).toBe(false);
  });
});

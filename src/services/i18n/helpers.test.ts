import { describe, expect, it, vi } from "vitest";
import { getCurrentLocale, isLocalizedRoute } from "./helpers";

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

describe("get-current-locale", () => {
  it("returns the given locale when it is a valid", () => {
    const locale = "en";

    expect(getCurrentLocale(locale)).toBe(locale);
  });

  it("returns the default locale when it is invalid", () => {
    expect(getCurrentLocale("foo")).toBe("en");
  });
});

describe("isLocalizedRoute", () => {
  it("detects a known locale at root", () => {
    expect(isLocalizedRoute("/en/blog")).toBe(true);
    expect(isLocalizedRoute("/fr")).toBe(true);
  });

  it("rejects an unknown locale", () => {
    expect(isLocalizedRoute("/de/blog")).toBe(false);
    expect(isLocalizedRoute("/xx")).toBe(false);
  });

  it("returns false for route without segments", () => {
    expect(isLocalizedRoute("/")).toBe(false);
    expect(isLocalizedRoute("")).toBe(false);
  });
});

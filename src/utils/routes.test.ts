import { describe, expect, it, vi } from "vitest";
import * as i18n from "./i18n";
import { getCumulativePaths, isLocalizedRoute, normalizeRoute } from "./routes";

vi.mock("./i18n", () => {
  return {
    isAvailableLanguage: vi.fn((locale: string) =>
      ["en", "fr", "es"].includes(locale)
    ),
  };
});

describe("normalizeRoute", () => {
  it("removes single trailing slash", () => {
    expect(normalizeRoute("/about/")).toBe("/about");
  });

  it("removes multiple trailing slashes", () => {
    expect(normalizeRoute("/about///")).toBe("/about");
  });

  it("returns '/' unchanged", () => {
    expect(normalizeRoute("/")).toBe("/");
  });

  it("returns '/' for empty string", () => {
    expect(normalizeRoute("")).toBe("/");
  });

  it("does not affect routes without trailing slash", () => {
    expect(normalizeRoute("/blog")).toBe("/blog");
  });
});

describe("getCumulativePaths", () => {
  it("splits a multi-segment route", () => {
    expect(getCumulativePaths("/en/blog/posts")).toStrictEqual([
      "/en",
      "/en/blog",
      "/en/blog/posts",
    ]);
  });

  it("splits a single-segment route", () => {
    expect(getCumulativePaths("/en")).toStrictEqual(["/en"]);
  });

  it("handles route with trailing slashes", () => {
    expect(getCumulativePaths("/en/blog/")).toStrictEqual(["/en", "/en/blog"]);
  });

  it("returns empty array for '/'", () => {
    expect(getCumulativePaths("/")).toStrictEqual([]);
  });

  it("returns empty array for empty string", () => {
    expect(getCumulativePaths("")).toStrictEqual([]);
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

  it("calls isAvailableLanguage with correct segment", () => {
    const spy = vi.spyOn(i18n, "isAvailableLanguage");

    isLocalizedRoute("/es/contact");

    expect(spy).toHaveBeenCalledWith("es");

    isLocalizedRoute("/");

    expect(spy).toHaveBeenCalledWith("");
  });
});

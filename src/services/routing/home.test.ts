import { describe, expect, it, vi } from "vitest";
import { getHomeEntryId, getOgHomeSlug, isHomeEntryId } from "./home";

vi.mock("../../utils/constants", async (importOriginal) => {
  const mod = await importOriginal<typeof import("../../utils/constants")>();
  return {
    ...mod,
    CONFIG: {
      ...mod.CONFIG,
      LANGUAGES: {
        AVAILABLE: ["en", "fr"],
        DEFAULT: "fr",
      },
    },
  };
});

describe("getHomeEntryId", () => {
  it("builds the home entry id for the given locale", () => {
    expect(getHomeEntryId("en")).toBe("en/home");
  });

  it("builds the home entry id for the default locale the same way", () => {
    expect(getHomeEntryId("fr")).toBe("fr/home");
  });
});

describe("isHomeEntryId", () => {
  it("returns true for a matching home entry id", () => {
    expect(isHomeEntryId("en/home", "en")).toBe(true);
  });

  it("returns false for a non-home entry id", () => {
    expect(isHomeEntryId("en/blog", "en")).toBe(false);
  });

  it("returns false when the locale doesn't match", () => {
    expect(isHomeEntryId("en/home", "fr")).toBe(false);
  });
});

describe("getOgHomeSlug", () => {
  it("drops the locale prefix for the default locale", () => {
    expect(getOgHomeSlug("fr")).toBe("home");
  });

  it("keeps the locale prefix for a non-default locale", () => {
    expect(getOgHomeSlug("en")).toBe("en/home");
  });
});

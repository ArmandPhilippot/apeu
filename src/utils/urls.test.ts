import { describe, expect, it, vi } from "vitest";
import { isHomePage } from "./urls";

vi.mock("./constants", async (importOriginal) => {
  const mod = await importOriginal<typeof import("./constants")>();
  return {
    ...mod,
    CONFIG: {
      ...mod.CONFIG,
      LANGUAGES: {
        ...mod.CONFIG.LANGUAGES,
        AVAILABLE: ["en", "fr", "es"],
        DEFAULT: "en",
      },
    },
  };
});

describe("is-homepage", () => {
  it("returns true when the path matches the default locale homepage", () => {
    const path = "/";
    const result = isHomePage(path);

    expect(result).toBe(true);
  });

  it("returns true when the path matches another locale homepage", () => {
    const path = "/es";
    const result = isHomePage(path);

    expect(result).toBe(true);
  });

  it("returns false when the path doesn't match a localized homepage", () => {
    const path = "/something/else";
    const result = isHomePage(path);

    expect(result).toBe(false);
  });
});

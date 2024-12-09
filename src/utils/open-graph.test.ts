import { beforeEach, describe, expect, it, vi } from "vitest";
import { isDefaultLanguage, useI18n } from "./i18n";
import { getOpenGraphImg } from "./open-graph";

vi.mock("./i18n", () => ({
  useI18n: vi.fn(),
  isDefaultLanguage: vi.fn(),
}));

vi.mock("./url", async (importOriginal) => {
  const mod =
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    await importOriginal<typeof import("./url")>();
  return {
    ...mod,
    getWebsiteUrl: () => "https://example.test",
  };
});

describe("getOpenGraphImg", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should generate og image for default language home page", () => {
    vi.mocked(useI18n).mockReturnValue({
      locale: "en",
      route: vi.fn().mockReturnValue("/"),
      translate: vi.fn(),
      translatePlural: vi.fn(),
    });
    vi.mocked(isDefaultLanguage).mockReturnValue(true);

    const result = getOpenGraphImg({ locale: "en", slug: "/" });

    expect(result).toEqual({
      height: 630,
      type: "image/png",
      url: new URL("/og/home.png", "https://example.test").href,
      width: 1200,
    });
  });

  it("should generate og image for non-default language home page", () => {
    vi.mocked(useI18n).mockReturnValue({
      locale: "en",
      route: vi.fn().mockReturnValue("/"),
      translate: vi.fn(),
      translatePlural: vi.fn(),
    });
    vi.mocked(isDefaultLanguage).mockReturnValue(false);

    const result = getOpenGraphImg({ locale: "fr", slug: "/" });

    expect(result).toEqual({
      height: 630,
      type: "image/png",
      url: new URL("/og/fr/home.png", "https://example.test").href,
      width: 1200,
    });
  });

  it("should generate og image for a specific page in default language", () => {
    vi.mocked(useI18n).mockReturnValue({
      locale: "en",
      route: vi.fn((key: string) => {
        if (key === "home") return "/";
        return "/about";
      }),
      translate: vi.fn(),
      translatePlural: vi.fn(),
    });
    vi.mocked(isDefaultLanguage).mockReturnValue(true);

    const result = getOpenGraphImg({ locale: "en", slug: "/about" });

    expect(result).toEqual({
      height: 630,
      type: "image/png",
      url: new URL("/og/about.png", "https://example.test").href,
      width: 1200,
    });
  });

  it("should generate og image for a specific page in non-default language", () => {
    vi.mocked(useI18n).mockReturnValue({
      locale: "en",
      route: vi.fn((key: string) => {
        if (key === "home") return "/";
        return "/fr/about";
      }),
      translate: vi.fn(),
      translatePlural: vi.fn(),
    });
    vi.mocked(isDefaultLanguage).mockReturnValue(false);

    const result = getOpenGraphImg({ locale: "fr", slug: "/fr/about" });

    expect(result).toEqual({
      height: 630,
      type: "image/png",
      url: new URL("/og/fr/about.png", "https://example.test").href,
      width: 1200,
    });
  });
});

import { getEntry } from "astro:content";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { resolveTranslations } from "./utils";

vi.mock("astro:content", async () => {
  const originalModule = await vi.importActual("astro:content");
  return {
    ...originalModule,
    getEntry: vi.fn(async (ref: { collection: string; id: string }) => ({
      id: ref.id,
      data: { route: `/test/${ref.id}` },
    })),
  };
});

vi.mock("../../../../utils/i18n", () => ({
  isAvailableLanguage: vi.fn((lang: string) => lang === "en" || lang === "fr"),
}));

type GetEntryMock = (ref: {
  collection: string;
  id: string;
}) => Promise<{ id: string; data: { route: string } } | null>;

describe("resolveTranslations", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns null for undefined translations", async () => {
    const result = await resolveTranslations(undefined);
    expect(result).toBeNull();
  });

  it("returns null for empty translations object", async () => {
    const result = await resolveTranslations({});
    expect(result).toBeNull();
  });

  it("successfully resolves valid translations", async () => {
    vi.mocked(getEntry as GetEntryMock).mockImplementation(async (ref) => ({
      id: ref.id,
      data: { route: `/test/${ref.id}` },
    }));

    const translations = {
      en: { collection: "pages", id: "en" },
      fr: { collection: "pages", id: "fr" },
    } as const;

    const result = await resolveTranslations(translations);

    expect(result).toEqual([
      { locale: "en", route: "/test/en" },
      { locale: "fr", route: "/test/fr" },
    ]);
    expect(getEntry).toHaveBeenCalledTimes(2);
  });

  it("filters out invalid language codes", async () => {
    vi.mocked(getEntry as GetEntryMock).mockImplementation(async (ref) => ({
      id: ref.id,
      data: { route: `/test/${ref.id}` },
    }));

    const translations = {
      en: { collection: "pages", id: "home" },
      invalid: { collection: "pages", id: "invalid" },
    } as const;

    const result = await resolveTranslations(translations);

    expect(result).toEqual([{ locale: "en", route: "/test/home" }]);
    expect(getEntry).toHaveBeenCalledTimes(1);
  });

  it("handles getEntry returning null", async () => {
    vi.mocked(getEntry).mockResolvedValue(null);

    const translations = {
      en: { collection: "pages", id: "home" },
    } as const;

    const result = await resolveTranslations(translations);
    expect(result).toBeNull();
  });

  it("handles entries without route data", async () => {
    vi.mocked(getEntry).mockResolvedValue({
      data: { title: "Test" },
    });

    const translations = {
      en: { collection: "pages", id: "home" },
    } as const;

    const result = await resolveTranslations(translations);
    expect(result).toBeNull();
  });

  it("handles mixed valid and invalid entries", async () => {
    vi.mocked(getEntry as GetEntryMock).mockImplementation(async (ref) => {
      if (ref.id === "home") {
        return { id: ref.id, data: { route: "/test/home" } };
      }
      return null;
    });

    const translations = {
      en: { collection: "pages", id: "home" },
      fr: { collection: "pages", id: "nonexistent" },
    } as const;

    const result = await resolveTranslations(translations);
    expect(result).toEqual([{ locale: "en", route: "/test/home" }]);
  });
});

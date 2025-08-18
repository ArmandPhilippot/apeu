import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import {
  createMockEntries,
  setupCollectionMocks,
} from "../../tests/helpers/astro-content";
import { clearEntriesIndexCache } from "../lib/astro/collections/indexes";
import { getOpenGraphImg } from "./open-graph";

vi.mock("astro:content", async (importOriginal) => {
  const mod = await importOriginal<typeof import("astro:content")>();
  return {
    ...mod,
    getCollection: vi.fn(() => []),
    getEntry: vi.fn(),
  };
});

vi.mock("./constants", async (importOriginal) => {
  const mod = await importOriginal<typeof import("./constants")>();
  return {
    ...mod,
    CONFIG: {
      ...mod.CONFIG,
      LANGUAGES: {
        DEFAULT: "en",
        AVAILABLE: ["en", "fr"],
      },
    },
    WEBSITE_URL: "https://example.test",
  };
});

describe("getOpenGraphImg", () => {
  beforeAll(() => {
    // cSpell:ignore Accueil propos
    const mockEntries = createMockEntries([
      { collection: "pages", id: "en/home", data: { title: "Home" } },
      { collection: "pages", id: "en/about", data: { title: "About" } },
      { collection: "pages", id: "fr/home", data: { title: "Accueil" } },
      { collection: "pages", id: "fr/about", data: { title: "A propos" } },
    ]);
    setupCollectionMocks(mockEntries);
  });

  afterAll(() => {
    clearEntriesIndexCache();
  });

  it("should generate og image for default language home page", async () => {
    expect.assertions(1);

    const result = await getOpenGraphImg({ locale: "en", slug: "/" });

    expect(result).toStrictEqual({
      height: 630,
      type: "image/png",
      url: new URL("/og/home.png", "https://example.test").href,
      width: 1200,
    });
  });

  it("should generate og image for non-default language home page", async () => {
    expect.assertions(1);

    const result = await getOpenGraphImg({ locale: "fr", slug: "/fr" });

    expect(result).toStrictEqual({
      height: 630,
      type: "image/png",
      url: new URL("/og/fr/home.png", "https://example.test").href,
      width: 1200,
    });
  });

  it("should generate og image for a specific page in default language", async () => {
    expect.assertions(1);

    const result = await getOpenGraphImg({ locale: "en", slug: "/about" });

    expect(result).toStrictEqual({
      height: 630,
      type: "image/png",
      url: new URL("/og/about.png", "https://example.test").href,
      width: 1200,
    });
  });

  it("should generate og image for a specific page in non-default language", async () => {
    expect.assertions(1);

    const result = await getOpenGraphImg({ locale: "fr", slug: "/fr/about" });

    expect(result).toStrictEqual({
      height: 630,
      type: "image/png",
      url: new URL("/og/fr/about.png", "https://example.test").href,
      width: 1200,
    });
  });
});

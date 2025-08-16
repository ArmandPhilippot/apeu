import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  createMockEntriesByCollection,
  setupCollectionMocks,
} from "../../../tests/helpers/astro-content";
import { clearEntriesIndexCache } from "../../lib/astro/collections/indexes";
import { getBreadcrumb } from "./breadcrumb";

vi.mock("astro:content", async () => {
  const originalModule = await vi.importActual("astro:content");
  return {
    ...originalModule,
    getCollection: vi.fn(),
    getEntry: vi.fn(),
  };
});

vi.mock("../../utils/constants", async (importOriginal) => {
  const mod = await importOriginal<typeof import("../../utils/constants")>();
  return {
    ...mod,
    CONFIG: {
      ...mod.CONFIG,
      LANGUAGES: {
        DEFAULT: "en",
        AVAILABLE: ["en", "es", "fr"],
      },
    },
  };
});

describe("getBreadcrumb", () => {
  beforeEach(() => {
    // cSpell:ignore Accueil propos
    const mockEntries = createMockEntriesByCollection({
      "blog.posts": [
        {
          collection: "blog.posts",
          id: "en/blog/post",
          data: { title: "Post" },
        },
        {
          collection: "blog.posts",
          id: "fr/blog/article",
          data: { title: "Article" },
        },
      ],
      "index.pages": [
        {
          collection: "index.pages",
          id: "en/blog",
          data: { title: "Blog" },
        },
        {
          collection: "index.pages",
          id: "fr/blog",
          data: { title: "Blog" },
        },
      ],
      pages: [
        {
          collection: "pages",
          id: "en/pages/home",
          data: { title: "Home" },
        },
        {
          collection: "pages",
          id: "en/about",
          data: { title: "About" },
        },
        {
          collection: "pages",
          id: "fr/pages/home",
          data: { title: "Accueil" },
        },
        {
          collection: "pages",
          id: "fr/about",
          data: { title: "A propos" },
        },
      ],
    });
    setupCollectionMocks(mockEntries);
  });

  afterEach(() => {
    clearEntriesIndexCache();
    vi.clearAllMocks();
  });

  it("returns root breadcrumb for '/'", async () => {
    expect.assertions(1);

    const result = await getBreadcrumb({ route: "/" });

    expect(result).toStrictEqual([{ label: "Home", url: "/" }]);
  });

  it("returns breadcrumb for localized route", async () => {
    expect.assertions(1);

    const result = await getBreadcrumb({ route: "/fr/blog/article" });

    expect(result).toStrictEqual([
      { label: "Accueil", url: "/fr" },
      { label: "Blog", url: "/fr/blog" },
      { label: "Article", url: "/fr/blog/article" },
    ]);
  });

  it("returns breadcrumb for non-localized route", async () => {
    expect.assertions(1);

    const result = await getBreadcrumb({ route: "/about" });

    expect(result).toStrictEqual([
      { label: "Home", url: "/" },
      { label: "About", url: "/about" },
    ]);
  });

  it("returns empty breadcrumb if no entries are found", async () => {
    expect.assertions(1);

    const result = await getBreadcrumb({ route: "/unknown/route" });

    expect(result).toStrictEqual([
      {
        label: "Home",
        url: "/",
      },
    ]);
  });

  it("appends pagination label when provided", async () => {
    expect.assertions(1);

    const result = await getBreadcrumb({
      route: "/blog/post",
      paginationLabel: "Page 2",
    });

    expect(result).toStrictEqual([
      { label: "Home", url: "/" },
      { label: "Blog", url: "/blog" },
      { label: "Post", url: "/blog/post" },
      { label: "Page 2", url: "/blog/post" },
    ]);
  });
});

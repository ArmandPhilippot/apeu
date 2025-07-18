import type { DataEntryMap } from "astro:content";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { RouteIndexItem } from "../../types/data";
import * as queryModule from "./collections";

// We use this to force internal cache reset
vi.resetModules();

vi.mock("../../content.config", () => {
  return {
    collections: {
      blog: {},
      pages: {},
      authors: {},
      blogroll: {},
      bookmarks: {},
    },
  };
});

vi.mock("./collections", async () => {
  const actual =
    await vi.importActual<typeof import("./collections")>("./collections");
  return {
    ...actual,
    queryCollection: vi.fn(),
  };
});

const mockedQueryCollection = vi.mocked(queryModule.queryCollection);

const freshGetRouteIndex = async () => {
  const mod = await import("./route-index");
  return mod.getRouteIndex();
};

describe("route-index", () => {
  const mockData: Record<string, RouteIndexItem[]> = {
    blog: [
      {
        id: "blog/my-post",
        route: "/en/blog/my-post",
        locale: "en",
        title: "My Post",
      },
    ],
    pages: [
      {
        id: "pages/about",
        route: "/en/about",
        locale: "en",
        title: "About",
      },
    ],
  };

  beforeEach(() => {
    // Clear call history and set fresh mock
    mockedQueryCollection.mockReset();
    // eslint-disable-next-line @typescript-eslint/require-await -- Mock.
    mockedQueryCollection.mockImplementation(async (collection) => {
      const key = Array.isArray(collection) ? collection[0] : collection;
      return {
        entries: mockData[key as string] ?? [],
        total: mockData[key as string]?.length ?? 0,
      } as unknown as queryModule.QueriedCollection<keyof DataEntryMap, "full">;
    });
  });

  afterEach(() => {
    // Reset module cache for `getRouteIndex` to re-evaluate
    vi.resetModules();
  });

  describe("getRouteIndex", () => {
    it("builds route index from collections (no cache)", async () => {
      /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self explanatory. */
      expect.assertions(2);

      const index = await freshGetRouteIndex();

      expect(index).toBeInstanceOf(Map);
      expect([...index.entries()]).toStrictEqual([
        ["/en/blog/my-post", mockData.blog?.[0]],
        ["/en/about", mockData.pages?.[0]],
      ]);
    });

    it("uses cached value on second call", async () => {
      /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self explanatory. */
      expect.assertions(2);

      // First call
      await freshGetRouteIndex();

      // Spy on the internal build function by spying on queryCollection
      mockedQueryCollection.mockClear();

      // Second call
      const index2 = await freshGetRouteIndex();

      // QueryCollection should not be called again
      expect(mockedQueryCollection).not.toHaveBeenCalled();

      // Ensure index is still valid
      expect(index2.get("/en/about")?.title).toBe("About");
    });
  });

  it("ignores collections without routes", async () => {
    expect.assertions(1);

    // Override mock to return entries for ignored collections
    // eslint-disable-next-line @typescript-eslint/require-await -- Mock.
    mockedQueryCollection.mockImplementation(async (collection) => {
      const key = Array.isArray(collection) ? collection[0] : collection;
      if (key && ["authors", "blogroll", "bookmarks"].includes(key)) {
        return {
          entries: [
            {
              id: `${collection}/ignored`,
              route: "/should-not-appear",
              locale: "en",
              title: "Ignored",
            },
          ],
          total: 1,
        } as unknown as queryModule.QueriedCollection<
          keyof DataEntryMap,
          "full"
        >;
      }
      return {
        entries: mockData[key as string] ?? [],
        total: mockData[key as string]?.length ?? 0,
      } as unknown as queryModule.QueriedCollection<keyof DataEntryMap, "full">;
    });

    const index = await freshGetRouteIndex();

    expect(index.has("/should-not-appear")).toBe(false);
  });

  it("returns an empty map if no entries", async () => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self explanatory. */
    expect.assertions(2);

    mockedQueryCollection.mockResolvedValue({ entries: [], total: 0 });

    const index = await freshGetRouteIndex();

    expect(index).toBeInstanceOf(Map);
    expect(index.size).toBe(0);
  });
});

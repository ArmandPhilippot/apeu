import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  createMockEntriesByCollection,
  setupCollectionMocks,
} from "../../../tests/helpers/astro-content";
import { clearEntriesIndexCache } from "../../lib/astro/collections/indexes";
import { useRouting } from "./use-routing";

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
        AVAILABLE: ["en", "fr"],
        DEFAULT: "en",
      },
    },
  };
});

const mockEntries = createMockEntriesByCollection({
  authors: [{ collection: "authors", id: "john-doe" }],
  notes: [{ collection: "notes", id: "en/note1" }],
});

describe("use-routing", () => {
  beforeEach(() => {
    setupCollectionMocks(mockEntries);
    vi.clearAllMocks();
  });

  afterEach(() => {
    clearEntriesIndexCache();
    vi.restoreAllMocks();
  });

  it("can return a route by id", async () => {
    expect.assertions(1);

    const { routeById } = await useRouting();

    expect(routeById("en/note1")).toBe("/note1");
  });

  it("throws an error when the entry does not have a route", async () => {
    expect.assertions(1);

    const { routeById } = await useRouting();

    expect(() => routeById("john-doe")).toThrowErrorMatchingInlineSnapshot(
      `[Error: Cannot find a route for the given id, received: john-doe]`
    );
  });

  it("throws an error when the entry does not exist", async () => {
    expect.assertions(1);

    const { routeById } = await useRouting();

    expect(() => routeById("en/post1")).toThrowErrorMatchingInlineSnapshot(
      `[Error: Cannot find a route for the given id, received: en/post1]`
    );
  });
});

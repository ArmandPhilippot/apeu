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

// cSpell:ignore projet
const mockEntries = createMockEntriesByCollection({
  authors: [{ collection: "authors", id: "john-doe" }],
  notes: [{ collection: "notes", id: "en/note1", data: { title: "Note 1" } }],
  projects: [
    { collection: "projects", id: "en/project1", data: { title: "Project 1" } },
    {
      collection: "projects",
      id: "fr/project1",
      data: { permaslug: "projet1", title: "Projet 1" },
    },
  ],
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

    const { routeById } = await useRouting("en");

    expect(routeById("note1")).toStrictEqual({
      label: "Note 1",
      path: "/note1",
    });
  });

  it("can return a route by id by overriding the default locale", async () => {
    expect.assertions(1);

    const { routeById } = await useRouting("en");

    expect(routeById("project1", "fr")).toStrictEqual({
      label: "Projet 1",
      path: "/fr/projet1",
    });
  });

  it("throws an error when the entry exists but not for the given locale", async () => {
    expect.assertions(1);

    const { routeById } = await useRouting("fr");

    expect(() => routeById("note1")).toThrowErrorMatchingInlineSnapshot(
      `[Error: Cannot find a route for the given id using "fr" as locale. Received: note1]`
    );
  });

  it("throws an error when the entry does not exist", async () => {
    expect.assertions(1);

    const { routeById } = await useRouting("en");

    expect(() => routeById("post1")).toThrowErrorMatchingInlineSnapshot(
      `[Error: Cannot find a route for the given id using "en" as locale. Received: post1]`
    );
  });
});

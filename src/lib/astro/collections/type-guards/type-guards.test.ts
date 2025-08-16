import { describe, expect, it } from "vitest";
import { createMockEntry } from "../../../../../tests/helpers/astro-content";
import type {
  IndexedEntry,
  NonRoutableCollectionKey,
  RoutableCollectionKey,
} from "../../../../types/routing";
import {
  isRoutableCollection,
  isRoutableEntry,
  isRoutableIndexedEntry,
} from "./type-guards";

const routableCollections: RoutableCollectionKey[] = [
  "pages",
  "projects",
  "blog.posts",
];

const nonRoutableCollections: NonRoutableCollectionKey[] = [
  "authors",
  "blogroll",
  "bookmarks",
];

describe("isRoutableCollection", () => {
  it.each(routableCollections)("returns true for routable %s", (col) => {
    expect(isRoutableCollection(col)).toBe(true);
  });

  it.each(nonRoutableCollections)(
    "returns false for non-routable %s",
    (col) => {
      expect(isRoutableCollection(col)).toBe(false);
    }
  );
});

describe("isRoutableEntry", () => {
  it("returns true for entries in a routable collection", () => {
    const entry = createMockEntry({
      collection: "projects",
      id: "projects/my-project",
    });

    expect(isRoutableEntry(entry)).toBe(true);
  });

  it("returns false for entries in a non-routable collection", () => {
    const entry = createMockEntry({
      collection: "authors",
      id: "john-doe",
    });

    expect(isRoutableEntry(entry)).toBe(false);
  });
});

describe("isRoutableIndexedEntry", () => {
  it("returns true for entries in a routable collection", () => {
    const collectionEntry = createMockEntry({
      collection: "projects",
      id: "projects/my-project",
    });
    const entry: IndexedEntry<"projects"> = {
      raw: collectionEntry,
      route: "/projects/my-project",
      slug: "my-project",
    };

    expect(isRoutableIndexedEntry(entry)).toBe(true);
  });

  it("returns false for entries in a non-routable collection", () => {
    const collectionEntry = createMockEntry({
      collection: "authors",
      id: "john-doe",
    });
    const entry: IndexedEntry<"authors"> = {
      raw: collectionEntry,
    };

    expect(isRoutableIndexedEntry(entry)).toBe(false);
  });
});

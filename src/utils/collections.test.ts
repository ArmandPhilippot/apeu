import { describe, expect, it } from "vitest";
import type { CollectionEntry, CollectionKey } from "astro:content";
import type {
  NonRoutableCollectionKey,
  RoutableCollectionKey,
} from "../types/routing";
import { isRoutableCollection, isRoutableEntry } from "./collections";

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

const makeEntry = <C extends CollectionKey>(
  collection: C,
  id: string
): CollectionEntry<C> => ({ collection, id }) as CollectionEntry<C>;

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
  it("returns true for entry in a routable collection", () => {
    const entry = makeEntry("projects", "projects/my-project");

    expect(isRoutableEntry(entry)).toBe(true);
  });

  it("returns false for entry in a non-routable collection", () => {
    const entry = makeEntry("authors", "authors/john-doe");

    expect(isRoutableEntry(entry)).toBe(false);
  });

  it("returns true for a routable entry", () => {
    const entry = makeEntry("projects", "projects/my-project");

    expect(isRoutableEntry(entry)).toBe(true);
  });

  it("narrows the entry type", () => {
    const entry = makeEntry("projects", "projects/my-project");

    if (!isRoutableEntry(entry)) throw new Error("Unexpected entry");

    expect(entry.collection).toBe("projects");
  });
});

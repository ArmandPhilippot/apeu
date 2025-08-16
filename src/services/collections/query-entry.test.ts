import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  authorFixture,
  guideFixture,
} from "../../../tests/fixtures/collections";
import {
  createMockEntry,
  setupCollectionMocks,
} from "../../../tests/helpers/astro-content";
import { clearEntriesIndexCache } from "../../lib/astro/collections/indexes";
import { queryEntry } from "./query-entry";

vi.mock("astro:content", async (importOriginal) => {
  const mod = await importOriginal<typeof import("astro:content")>();
  return {
    ...mod,
    getCollection: vi.fn(() => []),
    getEntry: vi.fn(),
  };
});

describe("query-entry", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    clearEntriesIndexCache();
  });

  it("can return an entry by id", async () => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(3);

    const author = createMockEntry({
      collection: "authors",
      id: authorFixture.id,
      data: authorFixture.data,
    });

    setupCollectionMocks([author]);

    const result = await queryEntry({
      collection: "authors",
      id: authorFixture.id,
    });

    expect(result.collection).toBe("authors");
    expect(result.id).toBe(authorFixture.id);
    expect(result.name).toBe(authorFixture.data.name);
  });

  it("can return a localized entry by id", async () => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(3);

    const guide = createMockEntry({
      collection: "guides",
      id: guideFixture.id,
      data: guideFixture.data,
    });

    setupCollectionMocks([guide]);

    const result = await queryEntry({
      collection: "guides",
      id: guideFixture.id.replace(`${guideFixture.data.locale}/`, ""),
      locale: guideFixture.data.locale,
    });

    expect(result.collection).toBe("guides");
    expect(result.id).toBe(guideFixture.id);
    expect(result.title).toBe(guideFixture.data.title);
  });

  it("throws an error when the requested entry does not exist", async () => {
    expect.assertions(1);

    await expect(async () =>
      // @ts-expect-error -- The collection does not exist.
      queryEntry({ collection: "foo", id: "bar" })
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `[Error: Couldn't find an entry in foo for the given id: bar.]`
    );
  });

  it("throws an error when the requested entry exists but in another collection", async () => {
    expect.assertions(1);

    const guide = createMockEntry({
      collection: "guides",
      id: guideFixture.id,
      data: guideFixture.data,
    });

    setupCollectionMocks([guide]);

    await expect(async () =>
      queryEntry({ collection: "blog.posts", id: guideFixture.id })
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `[Error: Found an entry for en/in-depth-guide but it wasn't in blog.posts, received: guides.]`
    );
  });
});

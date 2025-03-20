import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  authorFixture,
  blogPostFixture,
  bookmarkFixture,
  guideFixture,
  projectFixture,
} from "../../../../tests/fixtures/collections";
import { queryEntry } from "./query-entry";

const mockEntries = [
  authorFixture,
  blogPostFixture,
  bookmarkFixture,
  guideFixture,
  projectFixture,
];

vi.mock("astro:content", async () => {
  const originalModule = await vi.importActual("astro:content");
  return {
    ...originalModule,
    getEntry: vi.fn((collection, id) =>
      mockEntries.find(
        (entry) => entry.collection === collection && entry.id === id
      )
    ),
  };
});

describe("query-entry", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("can return an entry by id", async () => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(3);

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
});

import { describe, expect, it } from "vitest";
import {
  blogPostFixture,
  blogrollFixture,
} from "../../../tests/fixtures/collections";
import { formatEntry } from "../../lib/astro/collections/formatters";
import type { IndexedEntry } from "../../lib/astro/collections/types";
import type { FeedCompatibleEntry } from "../../types/data";
import { CONFIG } from "../../utils/constants";
import {
  getFeedLanguageFromLocale,
  getRSSItemsFromEntries,
} from "./build-feeds";

describe("get-rss-items-from-entries", () => {
  it("converts the given entries to RSS items", async () => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(2);

    const blogPostEntry: IndexedEntry<"blog.posts"> = {
      raw: blogPostFixture,
      route: "/blog/posts/post-1",
      slug: "post-1",
    };
    const blogrollEntry: IndexedEntry<"blogroll"> = {
      raw: blogrollFixture,
    };
    const entriesIndex = new Map(
      [blogPostEntry, blogrollEntry].map((entry) => [entry.raw.id, entry])
    );
    const entries: FeedCompatibleEntry[] = [
      await formatEntry<"blog.posts">(blogPostEntry, {
        indexById: entriesIndex,
      }),
      await formatEntry<"blogroll">(blogrollEntry, { indexById: entriesIndex }),
    ];
    const result = await getRSSItemsFromEntries(
      entries,
      CONFIG.LANGUAGES.DEFAULT
    );

    expect(result).toHaveLength(entries.length);
    expect(result).not.toStrictEqual(entries);
  });

  it("should add categories based on tags", async () => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(2);

    const blogrollEntry: IndexedEntry<"blogroll"> = {
      raw: blogrollFixture,
    };
    const entriesIndex = new Map(
      [blogrollEntry].map((entry) => [entry.raw.id, entry])
    );
    const tagBaseFixture = await formatEntry<"blogroll">(blogrollEntry, {
      indexById: entriesIndex,
    });
    const tag = {
      ...tagBaseFixture,
      meta: {
        ...tagBaseFixture.meta,
        tags: [{ route: "/tag1", title: "Tag1" }],
      },
    } satisfies FeedCompatibleEntry;
    const entries: FeedCompatibleEntry[] = [tag];
    const result = await getRSSItemsFromEntries(
      entries,
      CONFIG.LANGUAGES.DEFAULT
    );

    expect(result).toHaveLength(entries.length);
    expect(result[0]?.categories).toContain(tag.meta.tags[0]?.title);
  });
});

describe("get-feed-language-from-locale", () => {
  it("returns the language from the given locale", () => {
    expect(getFeedLanguageFromLocale("en")).toBe("en-us");
  });

  it("throws an error if the locale is unsupported", () => {
    expect(() =>
      getFeedLanguageFromLocale("foo")
    ).toThrowErrorMatchingInlineSnapshot(
      `[UnsupportedLocaleError: Unsupported locale, received: foo.]`
    );
  });
});

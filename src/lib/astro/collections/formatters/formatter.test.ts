import { describe, expect, it } from "vitest";
import {
  authorFixture,
  blogPostFixture,
  blogrollFixture,
  bookmarkFixture,
} from "../../../../../tests/fixtures/collections";
import type { IndexedEntry } from "../types";
import { getAuthor, getAuthorPreview } from "./authors";
import { getBlog } from "./blogroll";
import { getBookmark } from "./bookmarks";
import { formatEntry } from "./formatter";
import { getRoutableEntry, getRoutableEntryPreview } from "./routable-entries";

describe("format-entry", () => {
  it("can format an author using default full format", async () => {
    expect.assertions(1);

    const indexedAuthor: IndexedEntry<"authors"> = {
      raw: authorFixture,
    };
    const entriesIndex = new Map(
      [indexedAuthor].map((entry) => [entry.raw.id, entry])
    );
    const result = await formatEntry<"authors">(indexedAuthor, {
      indexById: entriesIndex,
    });
    const fullAuthor = getAuthor(indexedAuthor);

    expect(JSON.stringify(result)).toStrictEqual(JSON.stringify(fullAuthor));
  });

  it("can format an author using preview format", async () => {
    expect.assertions(1);

    const indexedAuthor: IndexedEntry<"authors"> = {
      raw: authorFixture,
    };
    const entriesIndex = new Map(
      [indexedAuthor].map((entry) => [entry.raw.id, entry])
    );
    const result = await formatEntry(indexedAuthor, {
      format: "preview",
      indexById: entriesIndex,
    });
    const authorPreview = getAuthorPreview(indexedAuthor);

    expect(JSON.stringify(result)).toStrictEqual(JSON.stringify(authorPreview));
  });

  it("can format a blogroll using default full format", async () => {
    expect.assertions(1);

    const indexedBlog: IndexedEntry<"blogroll"> = {
      raw: blogrollFixture,
    };
    const entriesIndex = new Map(
      [indexedBlog].map((entry) => [entry.raw.id, entry])
    );
    const result = await formatEntry<"blogroll">(indexedBlog, {
      indexById: entriesIndex,
    });
    const fullBlog = getBlog(indexedBlog, entriesIndex);

    expect(JSON.stringify(result)).toStrictEqual(JSON.stringify(fullBlog));
  });

  it("can format a bookmark using default full format", async () => {
    expect.assertions(1);

    const indexedBookmark: IndexedEntry<"bookmarks"> = {
      raw: bookmarkFixture,
    };
    const entriesIndex = new Map(
      [indexedBookmark].map((entry) => [entry.raw.id, entry])
    );
    const result = await formatEntry<"bookmarks">(indexedBookmark, {
      indexById: entriesIndex,
    });
    const fullBookmark = getBookmark(indexedBookmark, entriesIndex);

    expect(JSON.stringify(result)).toStrictEqual(JSON.stringify(fullBookmark));
  });

  it("can format a routable entry using default full format", async () => {
    expect.assertions(1);

    const routableEntry: IndexedEntry<"blog.posts"> = {
      raw: blogPostFixture,
      route: "/blog/posts/post-1",
      slug: "post-1",
    };
    const entriesIndex = new Map(
      [routableEntry].map((entry) => [entry.raw.id, entry])
    );
    const result = await formatEntry<"blog.posts">(routableEntry, {
      indexById: entriesIndex,
    });
    const fullPost = await getRoutableEntry(routableEntry, entriesIndex);

    expect(JSON.stringify(result)).toStrictEqual(JSON.stringify(fullPost));
  });

  it("can format a routable entry using preview format", async () => {
    expect.assertions(1);

    const routableEntry: IndexedEntry<"blog.posts"> = {
      raw: blogPostFixture,
      route: "/blog/posts/post-1",
      slug: "post-1",
    };
    const entriesIndex = new Map(
      [routableEntry].map((entry) => [entry.raw.id, entry])
    );
    const result = await formatEntry(routableEntry, {
      format: "preview",
      indexById: entriesIndex,
    });
    const postPreview = await getRoutableEntryPreview(
      routableEntry,
      entriesIndex
    );

    expect(JSON.stringify(result)).toStrictEqual(JSON.stringify(postPreview));
  });
});

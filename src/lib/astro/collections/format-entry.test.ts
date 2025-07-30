import { describe, expect, it } from "vitest";
import {
  authorFixture,
  blogPostFixture,
  blogrollFixture,
  bookmarkFixture,
} from "../../../../tests/fixtures/collections";
import { formatEntry } from "./format-entry";
import { getAuthor, getAuthorPreview } from "./formatters/authors";
import { getBlog } from "./formatters/blogroll";
import { getBookmark } from "./formatters/bookmarks";
import {
  getRoutableEntry,
  getRoutableEntryPreview,
} from "./formatters/routable-entries";

describe("format-entry", () => {
  it("can format an author using default full format", async () => {
    expect.assertions(1);

    const result = await formatEntry<"authors">(authorFixture);
    const fullAuthor = getAuthor(authorFixture);

    expect(JSON.stringify(result)).toStrictEqual(JSON.stringify(fullAuthor));
  });

  it("can format an author using preview format", async () => {
    expect.assertions(1);

    const result = await formatEntry(authorFixture, "preview");
    const authorPreview = getAuthorPreview(authorFixture);

    expect(JSON.stringify(result)).toStrictEqual(JSON.stringify(authorPreview));
  });

  it("can format a routable entry using default full format", async () => {
    expect.assertions(1);

    const result = await formatEntry<"blog.posts">(blogPostFixture);
    const fullPost = await getRoutableEntry(blogPostFixture);

    expect(JSON.stringify(result)).toStrictEqual(JSON.stringify(fullPost));
  });

  it("can format a routable entry using preview format", async () => {
    expect.assertions(1);

    const result = await formatEntry(blogPostFixture, "preview");
    const postPreview = await getRoutableEntryPreview(blogPostFixture);

    expect(JSON.stringify(result)).toStrictEqual(JSON.stringify(postPreview));
  });

  it("can format a blogroll entry", async () => {
    expect.assertions(1);

    const result = await formatEntry(blogrollFixture);
    const blog = await getBlog(blogrollFixture);

    expect(JSON.stringify(result)).toStrictEqual(JSON.stringify(blog));
  });

  it("can format a bookmark", async () => {
    expect.assertions(1);

    const result = await formatEntry(bookmarkFixture);
    const bookmark = await getBookmark(bookmarkFixture);

    expect(JSON.stringify(result)).toStrictEqual(JSON.stringify(bookmark));
  });

  it("throws an error when the collection name is invalid", async () => {
    expect.assertions(1);

    const entry = {
      collection: "foo",
      data: {
        excerpt: "Sed eum enim qui qui ea quisquam voluptatum aut.",
        isDraft: false,
        publishedOn: new Date("2024-09-23T16:49:58.860Z"),
        seo: {
          description: "Deleniti et voluptas distinctio.",
          title: "eos excepturi recusandae",
        },
        title: "sed maiores vel",
        updatedOn: new Date("2024-09-23T16:49:58.860Z"),
      },
      id: "eum-dolorem-totam",
    };

    await expect(async () =>
      // @ts-expect-error -- Invalid collection
      formatEntry(entry, "preview")
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `[Error: Unsupported collection name.]`
    );
  });
});

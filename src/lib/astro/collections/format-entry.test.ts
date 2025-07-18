import { describe, expect, it } from "vitest";
import {
  authorFixture,
  blogCategoryFixture,
  blogPostFixture,
  blogrollFixture,
  bookmarkFixture,
  guideFixture,
  indexPageFixture,
  noteFixture,
  pageFixture,
  projectFixture,
  tagFixture,
} from "../../../../tests/fixtures/collections";
import { formatEntry } from "./format-entry";
import { getAuthor, getAuthorPreview } from "./formatters/authors";
import { getBlogPost, getBlogPostPreview } from "./formatters/blog-posts";
import { getBlog } from "./formatters/blogroll";
import { getBookmark } from "./formatters/bookmarks";
import { getGuide, getGuidePreview } from "./formatters/guides";
import { getNote, getNotePreview } from "./formatters/notes";
import { getPage, getPagePreview } from "./formatters/pages";
import { getProject, getProjectPreview } from "./formatters/projects";
import { getTaxonomy, getTaxonomyPreview } from "./formatters/taxonomies";
import { getIndexPage, getIndexPagePreview } from "./formatters/index-pages";

describe("format-entry", () => {
  it("can format an author using default full format", async () => {
    expect.assertions(1);

    const result = await formatEntry(authorFixture);
    const fullAuthor = getAuthor(authorFixture);

    expect(JSON.stringify(result)).toStrictEqual(JSON.stringify(fullAuthor));
  });

  it("can format an author using preview format", async () => {
    expect.assertions(1);

    const result = await formatEntry(authorFixture, "preview");
    const authorPreview = getAuthorPreview(authorFixture);

    expect(JSON.stringify(result)).toStrictEqual(JSON.stringify(authorPreview));
  });

  it("can format a blogPost using default full format", async () => {
    expect.assertions(1);

    const result = await formatEntry(blogPostFixture);
    const fullPost = await getBlogPost(blogPostFixture);

    expect(JSON.stringify(result)).toStrictEqual(JSON.stringify(fullPost));
  });

  it("can format a blogPost using preview format", async () => {
    expect.assertions(1);

    const result = await formatEntry(blogPostFixture, "preview");
    const postPreview = await getBlogPostPreview(blogPostFixture);

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

  it("can format a guide using default full format", async () => {
    expect.assertions(1);

    const result = await formatEntry(guideFixture);
    const fullGuide = await getGuide(guideFixture);

    expect(JSON.stringify(result)).toStrictEqual(JSON.stringify(fullGuide));
  });

  it("can format a guide using preview format", async () => {
    expect.assertions(1);

    const result = await formatEntry(guideFixture, "preview");
    const guidePreview = await getGuidePreview(guideFixture);

    expect(JSON.stringify(result)).toStrictEqual(JSON.stringify(guidePreview));
  });

  it("can format an index page using default full format", async () => {
    expect.assertions(1);

    const result = await formatEntry(indexPageFixture);
    const fullPage = await getIndexPage(indexPageFixture);

    expect(JSON.stringify(result)).toStrictEqual(JSON.stringify(fullPage));
  });

  it("can format an index page using preview format", async () => {
    expect.assertions(1);

    const result = await formatEntry(indexPageFixture, "preview");
    const pagePreview = await getIndexPagePreview(indexPageFixture);

    expect(JSON.stringify(result)).toStrictEqual(JSON.stringify(pagePreview));
  });

  it("can format a note using default full format", async () => {
    expect.assertions(1);

    const result = await formatEntry(noteFixture);
    const fullNote = await getNote(noteFixture);

    expect(JSON.stringify(result)).toStrictEqual(JSON.stringify(fullNote));
  });

  it("can format a note using preview format", async () => {
    expect.assertions(1);

    const result = await formatEntry(noteFixture, "preview");
    const notePreview = await getNotePreview(noteFixture);

    expect(JSON.stringify(result)).toStrictEqual(JSON.stringify(notePreview));
  });

  it("can format a page using default full format", async () => {
    expect.assertions(1);

    const result = await formatEntry(pageFixture);
    const fullPage = await getPage(pageFixture);

    expect(JSON.stringify(result)).toStrictEqual(JSON.stringify(fullPage));
  });

  it("can format a page using preview format", async () => {
    expect.assertions(1);

    const result = await formatEntry(pageFixture, "preview");
    const pagePreview = await getPagePreview(pageFixture);

    expect(JSON.stringify(result)).toStrictEqual(JSON.stringify(pagePreview));
  });

  it("can format a project using default full format", async () => {
    expect.assertions(1);

    const result = await formatEntry(projectFixture);
    const fullProject = await getProject(projectFixture);

    expect(JSON.stringify(result)).toStrictEqual(JSON.stringify(fullProject));
  });

  it("can format a project using preview format", async () => {
    expect.assertions(1);

    const result = await formatEntry(projectFixture, "preview");
    const projectPreview = await getProjectPreview(projectFixture);

    expect(JSON.stringify(result)).toStrictEqual(
      JSON.stringify(projectPreview)
    );
  });

  it("can format a tag using default full format", async () => {
    expect.assertions(1);

    const result = await formatEntry(tagFixture);
    const fullTaxonomy = await getTaxonomy(tagFixture);

    expect(JSON.stringify(result)).toStrictEqual(JSON.stringify(fullTaxonomy));
  });

  it("can format a tag using preview format", async () => {
    expect.assertions(1);

    const result = await formatEntry(tagFixture, "preview");
    const taxonomyPreview = getTaxonomyPreview(tagFixture);

    expect(JSON.stringify(result)).toStrictEqual(
      JSON.stringify(taxonomyPreview)
    );
  });

  it("can format a blogCategory using preview format", async () => {
    expect.assertions(1);

    const result = await formatEntry(blogCategoryFixture, "preview");
    const taxonomyPreview = getTaxonomyPreview(blogCategoryFixture);

    expect(JSON.stringify(result)).toStrictEqual(
      JSON.stringify(taxonomyPreview)
    );
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

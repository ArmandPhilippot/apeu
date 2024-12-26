import { describe, expect, it } from "vitest";
import { blogPostFixture } from "../../../../../tests/fixtures/collections";
import { getBlogPost, getBlogPostPreview } from "./blog-posts";

describe("get-blog-post-preview", () => {
  it("returns a blog post preview from a blogPosts collection entry", async () => {
    const result = await getBlogPostPreview(blogPostFixture);

    expect.assertions(1);

    expect(result).toMatchInlineSnapshot(`
      {
        "collection": "blogPosts",
        "description": "The blog post description.",
        "id": "en/my-awesome-post",
        "locale": "en",
        "meta": {
          "category": null,
          "publishedOn": 2024-09-22T21:10:11.400Z,
          "readingTime": undefined,
          "tags": null,
          "updatedOn": 2024-09-22T21:10:11.400Z,
        },
        "route": "/blog/post/my-awesome-post",
        "title": "The blog post title",
      }
    `);
  });
});

describe("get-blog-post", () => {
  it("returns a blog post from a blogPosts collection entry", async () => {
    const result = await getBlogPost(blogPostFixture);

    expect.assertions(1);

    expect(result).toMatchInlineSnapshot(`
      {
        "Content": [Function],
        "collection": "blogPosts",
        "description": "The blog post description.",
        "hasContent": false,
        "headings": [],
        "id": "en/my-awesome-post",
        "locale": "en",
        "meta": {
          "authors": [],
          "category": null,
          "publishedOn": 2024-09-22T21:10:11.400Z,
          "readingTime": undefined,
          "tags": null,
          "updatedOn": 2024-09-22T21:10:11.400Z,
        },
        "route": "/blog/post/my-awesome-post",
        "seo": {
          "description": "The blog post description for search engines.",
          "languages": null,
          "title": "The blog post title for search engines",
        },
        "slug": "my-awesome-post",
        "title": "The blog post title",
      }
    `);
  });
});

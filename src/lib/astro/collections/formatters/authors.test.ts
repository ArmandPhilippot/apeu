import { describe, expect, it } from "vitest";
import { authorFixture } from "../../../../../tests/fixtures/collections";
import { getAuthor, getAuthorLink, getAuthorPreview } from "./authors";

describe("get-author-link", () => {
  it("returns an author link from a collection entry", () => {
    expect(getAuthorLink(authorFixture)).toMatchInlineSnapshot(`
      {
        "isWebsiteOwner": false,
        "name": "John Doe",
        "website": undefined,
      }
    `);
  });
});

describe("get-author-preview", () => {
  it("returns an author preview from a collection entry", () => {
    expect(getAuthorPreview(authorFixture)).toMatchInlineSnapshot(`
      {
        "collection": "authors",
        "id": "john-doe",
        "isWebsiteOwner": false,
        "name": "John Doe",
      }
    `);
  });
});

describe("get-author", () => {
  it("returns an author from a collection entry", () => {
    expect(getAuthor(authorFixture)).toMatchInlineSnapshot(`
      {
        "collection": "authors",
        "firstName": "John",
        "id": "john-doe",
        "isWebsiteOwner": false,
        "lastName": "Doe",
        "name": "John Doe",
      }
    `);
  });
});

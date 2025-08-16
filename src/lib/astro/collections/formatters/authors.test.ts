import { describe, expect, it } from "vitest";
import { authorFixture } from "../../../../../tests/fixtures/collections";
import { getAuthor, getAuthorLink } from "./authors";

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

describe("get-author", () => {
  it("returns an author from a collection entry", () => {
    expect(getAuthor({ raw: authorFixture })).toMatchInlineSnapshot(`
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

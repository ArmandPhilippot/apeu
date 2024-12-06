import { describe, expect, it } from "vitest";
import { noteFixture } from "../../../../../tests/fixtures/collections";
import { getNote, getNotePreview } from "./notes";

describe("get-note-preview", () => {
  it("returns a note preview from a notes collection entry", async () => {
    const result = await getNotePreview(noteFixture);

    expect.assertions(1);

    expect(result).toMatchInlineSnapshot(`
      {
        "collection": "notes",
        "description": "The note description.",
        "id": "temporary-note",
        "locale": "en",
        "meta": {
          "publishedOn": 2024-09-22T21:00:40.802Z,
          "readingTime": undefined,
          "tags": null,
          "updatedOn": 2024-09-22T21:00:40.802Z,
        },
        "route": "/notes/temporary-note",
        "title": "The note title",
      }
    `);
  });
});

describe("get-note", () => {
  it("returns a note from a notes collection entry", async () => {
    const result = await getNote(noteFixture);

    expect.assertions(1);

    expect(result).toMatchInlineSnapshot(`
      {
        "Content": [Function],
        "collection": "notes",
        "description": "The note description.",
        "hasContent": false,
        "headings": [],
        "id": "temporary-note",
        "locale": "en",
        "meta": {
          "publishedOn": 2024-09-22T21:00:40.802Z,
          "readingTime": undefined,
          "tags": null,
          "updatedOn": 2024-09-22T21:00:40.802Z,
        },
        "route": "/notes/temporary-note",
        "seo": {
          "description": "The note description for search engines.",
          "title": "The note title for search engines",
        },
        "slug": "temporary-note",
        "title": "The note title",
      }
    `);
  });
});

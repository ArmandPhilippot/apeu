import { describe, expect, it } from "vitest";
import { projectFixture } from "../../../../../tests/fixtures/collections";
import { getProject, getProjectPreview } from "./projects";

describe("get-project-preview", () => {
  it("returns a project preview from a collection entry", async () => {
    expect.assertions(1);

    const result = await getProjectPreview(projectFixture);

    expect(result).toMatchInlineSnapshot(`
      {
        "collection": "projects",
        "cover": null,
        "description": "The project description.",
        "id": "revolutionary-project",
        "locale": "en",
        "meta": {
          "isArchived": false,
          "kind": "app",
          "publishedOn": 2024-09-22T21:00:40.804Z,
          "readingTime": undefined,
          "repository": undefined,
          "tags": null,
          "updatedOn": 2024-09-22T21:00:40.804Z,
        },
        "route": "/projects/revolutionary-project",
        "title": "The project title",
      }
    `);
  });
});

describe("get-project", () => {
  it("returns a project from a collection entry", async () => {
    expect.assertions(1);

    const result = await getProject(projectFixture);

    expect(result).toMatchInlineSnapshot(`
      {
        "Content": [Function],
        "collection": "projects",
        "cover": null,
        "description": "The project description.",
        "hasContent": false,
        "headings": [],
        "id": "revolutionary-project",
        "locale": "en",
        "meta": {
          "isArchived": false,
          "kind": "app",
          "publishedOn": 2024-09-22T21:00:40.804Z,
          "readingTime": undefined,
          "repository": undefined,
          "tags": null,
          "updatedOn": 2024-09-22T21:00:40.804Z,
        },
        "route": "/projects/revolutionary-project",
        "seo": {
          "description": "The project description for search engines.",
          "languages": null,
          "title": "The project title for search engines",
        },
        "slug": "revolutionary-project",
        "title": "The project title",
      }
    `);
  });
});

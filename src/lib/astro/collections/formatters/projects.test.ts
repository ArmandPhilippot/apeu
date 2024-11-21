import { describe, expect, it } from "vitest";
import { projectFixture } from "../../../../../tests/fixtures/collections";
import { getProject, getProjectPreview } from "./projects";

describe("get-project-preview", () => {
  it("returns a project preview from a collection entry", async () => {
    const result = await getProjectPreview(projectFixture);

    expect.assertions(1);

    expect(result).toMatchInlineSnapshot(`
      {
        "collection": "projects",
        "description": "The project description.",
        "id": "revolutionary-project",
        "locale": "en",
        "meta": {
          "kind": "app",
          "publishedOn": 2024-09-22T21:00:40.804Z,
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
    const result = await getProject(projectFixture);

    expect.assertions(1);

    expect(result).toMatchInlineSnapshot(`
      {
        "Content": [Function],
        "collection": "projects",
        "description": "The project description.",
        "headings": [],
        "id": "revolutionary-project",
        "locale": "en",
        "meta": {
          "kind": "app",
          "publishedOn": 2024-09-22T21:00:40.804Z,
          "repository": undefined,
          "tags": null,
          "updatedOn": 2024-09-22T21:00:40.804Z,
        },
        "route": "/projects/revolutionary-project",
        "seo": {
          "description": "The project description for search engines.",
          "title": "The project title for search engines",
        },
        "slug": "revolutionary-project",
        "title": "The project title",
      }
    `);
  });
});

import { describe, expect, it } from "vitest";
import { getBreadcrumbListGraph } from "./breadcrumb-list-graph";

describe("get-breadcrumb-list-graph", () => {
  it("returns an object describing the breadcrumb", () => {
    const graph = getBreadcrumbListGraph([
      {
        label: "magni",
        path: "/magni",
      },
      {
        label: "quasi",
        path: "/quasi",
      },
    ]);

    expect(graph).toMatchInlineSnapshot(`
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "item": {
              "@id": "/magni",
              "name": "magni",
            },
            "position": 1,
          },
          {
            "@type": "ListItem",
            "item": {
              "@id": "/quasi",
              "name": "quasi",
            },
            "position": 2,
          },
        ],
      }
    `);
  });
});

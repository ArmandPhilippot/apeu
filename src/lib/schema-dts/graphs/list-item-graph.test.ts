import { describe, expect, it } from "vitest";
import { getListItemGraph } from "./list-item-graph";

describe("get-list-item-graph", () => {
  it("returns an object describing the list item", () => {
    const graph = getListItemGraph({
      id: "optio",
      label: "magni",
      position: 2,
    });

    expect(graph).toMatchInlineSnapshot(`
      {
        "@id": "optio",
        "@type": "ListItem",
        "name": "magni",
        "position": 2,
      }
    `);
  });
});
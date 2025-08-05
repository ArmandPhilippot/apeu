import { describe, expect, it } from "vitest";
import { flattenAndSortByHierarchy } from "./utils";

describe("flattenAndSortByHierarchy", () => {
  it("flattens nested arrays", () => {
    const nested = [[{ id: "a" }, { id: "b" }], [{ id: "c" }]];
    const result = flattenAndSortByHierarchy(nested);

    expect(result.map((e) => e.id)).toStrictEqual(["a", "b", "c"]);
  });

  it("sorts entries by id", () => {
    const nested = [
      [{ id: "projects/foo" }, { id: "index" }],
      [{ id: "projects/foo/bar" }],
    ];
    const result = flattenAndSortByHierarchy(nested);

    expect(result.map((e) => e.id)).toStrictEqual([
      "index",
      "projects/foo",
      "projects/foo/bar",
    ]);
  });

  it("handles empty arrays", () => {
    const result = flattenAndSortByHierarchy([]);

    expect(result).toStrictEqual([]);
  });

  it("does not mutate original input", () => {
    const nested = [[{ id: "b" }], [{ id: "a" }]];
    const copy = structuredClone(nested);
    flattenAndSortByHierarchy(nested);

    expect(nested).toStrictEqual(copy);
  });
});

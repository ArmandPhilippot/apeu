import { describe, expect, it } from "vitest";
import { partitionByType } from "./arrays";

describe("partitionByType", () => {
  it("divide an array of objects in two by type", () => {
    type Item = { foo: string } | { foo: boolean };
    const input: Item[] = [{ foo: "anything" }, { foo: true }] as const;
    const isBoolean = (item: Item): item is { foo: boolean } =>
      typeof item.foo === "boolean";
    const [booleans, strings] = partitionByType(input, isBoolean);

    expect(booleans).toStrictEqual([{ foo: true }]);
    expect(strings).toStrictEqual([{ foo: "anything" }]);
  });
});

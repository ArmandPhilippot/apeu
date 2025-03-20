import { describe, expect, it } from "vitest";
import { splitObject } from "./objects";

describe("splitObject", () => {
  it("should correctly split an object when given a valid key", () => {
    const input = {
      name: "John",
      age: 30,
      city: "New York",
    };

    const result = splitObject(input, "name");

    expect(result).toStrictEqual({
      extracted: { name: "John" },
      remaining: { age: 30, city: "New York" },
    });
  });

  it("should return original object in remaining when key does not exist", () => {
    const input = {
      name: "John",
      age: 30,
    };

    const result = splitObject(input, "address");

    expect(result).toStrictEqual({
      remaining: {
        name: "John",
        age: 30,
      },
    });
  });

  it("should return original object in remaining when key is undefined", () => {
    const input = {
      name: "John",
      age: 30,
    };

    const result = splitObject(input, undefined);

    expect(result).toStrictEqual({
      remaining: {
        name: "John",
        age: 30,
      },
    });
  });

  it("should return empty object when input object is undefined", () => {
    const result = splitObject(undefined, "name");

    expect(result).toStrictEqual({});
  });

  it("should handle empty object correctly", () => {
    const input = {};

    const result = splitObject(input, "name");

    expect(result).toStrictEqual({
      remaining: {},
    });
  });

  it("should correctly split object with nested properties", () => {
    const input = {
      user: { id: 1, name: "John" },
      settings: { theme: "dark" },
    };

    const result = splitObject(input, "user");

    expect(result).toStrictEqual({
      extracted: { user: { id: 1, name: "John" } },
      remaining: { settings: { theme: "dark" } },
    });
  });

  it("should handle different value types correctly", () => {
    const input = {
      string: "text",
      number: 42,
      boolean: true,
      /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Fake data. */
      array: [1, 2, 3],
      null: null,
    };

    const result = splitObject(input, "number");

    expect(result).toStrictEqual({
      extracted: { number: 42 },
      remaining: {
        string: "text",
        boolean: true,
        /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Fake data. */
        array: [1, 2, 3],
        null: null,
      },
    });
  });

  it("should maintain type safety with the returned objects", () => {
    type TestType = {
      id: number;
      name: string;
      age?: number;
    };

    const input: TestType = {
      id: 1,
      name: "John",
    };

    const result = splitObject(input, "id");

    expect(result.extracted.id).toBe(1);
    expect(result.remaining.name).toBe("John");

    // @ts-expect-error - This should cause a TypeScript error
    expect(result.remaining.id).toBeUndefined();
  });
});

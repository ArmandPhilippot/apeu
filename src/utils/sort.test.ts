import { describe, expect, it } from "vitest";
import { sortByKey } from "./sort";

describe("sort-by-key", () => {
  it("can be used to sort an array of objects by Date", () => {
    const entries = [
      { foo: "id", bar: true, baz: new Date("2024-04-20T17:56:00.000Z") },
      {
        foo: "aspernatur",
        bar: false,
        baz: new Date("2024-04-21T12:26:00.000Z"),
      },
      { foo: "fugiat", bar: false, baz: new Date("2024-04-29T13:34:00.000Z") },
    ];

    expect(entries.sort((a, b) => sortByKey(a, b, "baz")))
      .toMatchInlineSnapshot(`
      [
        {
          "bar": true,
          "baz": 2024-04-20T17:56:00.000Z,
          "foo": "id",
        },
        {
          "bar": false,
          "baz": 2024-04-21T12:26:00.000Z,
          "foo": "aspernatur",
        },
        {
          "bar": false,
          "baz": 2024-04-29T13:34:00.000Z,
          "foo": "fugiat",
        },
      ]
    `);
  });

  it("can be used to sort an array of objects by string", () => {
    const entries = [
      { foo: "id", bar: true, baz: new Date("2024-04-29T13:34:00.000Z") },
      {
        foo: "aspernatur",
        bar: false,
        baz: new Date("2024-04-20T17:56:00.000Z"),
      },
      { foo: "ut", bar: true, baz: new Date("2024-04-21T12:26:00.000Z") },
    ];

    expect(entries.sort((a, b) => sortByKey(a, b, "foo")))
      .toMatchInlineSnapshot(`
      [
        {
          "bar": false,
          "baz": 2024-04-20T17:56:00.000Z,
          "foo": "aspernatur",
        },
        {
          "bar": true,
          "baz": 2024-04-29T13:34:00.000Z,
          "foo": "id",
        },
        {
          "bar": true,
          "baz": 2024-04-21T12:26:00.000Z,
          "foo": "ut",
        },
      ]
    `);
  });

  it("throws an error if the property type is not supported", () => {
    const entries = [
      { foo: "id", bar: true, baz: new Date("2024-04-20T19:56") },
      { foo: "aspernatur", bar: false, baz: new Date("2024-04-29T15:34") },
    ];

    expect(() =>
      entries.sort((a, b) => sortByKey(a, b, "bar")),
    ).toThrowErrorMatchingInlineSnapshot(
      `[Error: Unsupported property type for sorting]`,
    );
  });
});

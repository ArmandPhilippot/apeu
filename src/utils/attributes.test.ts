import { describe, expect, it } from "vitest";
import { getCSSVars } from "./attributes";

describe("get-css-vars", () => {
  it("stringifies the given object as css variables", () => {
    const cssVars: Parameters<typeof getCSSVars>[0] = {
      foo: "bar",
      baz: "42px",
    };

    expect(getCSSVars(cssVars)).toMatchInlineSnapshot(
      `"--foo: bar; --baz: 42px;"`,
    );
  });

  it("removes undefined or null values", () => {
    const cssVars: Parameters<typeof getCSSVars>[0] = {
      foo: undefined,
      baz: "42px",
      qux: null,
    };

    expect(getCSSVars(cssVars)).toMatchInlineSnapshot(`"--baz: 42px;"`);
  });
});

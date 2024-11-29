import { describe, expect, it } from "vitest";
import { getCSSVars, getSpacingVarValue } from "./attributes";

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

describe("get-spacing-var-value", () => {
  it("returns the CSS variables matching the given spacing", () => {
    const spacing: Parameters<typeof getSpacingVarValue>[0] = "md";

    expect(getSpacingVarValue(spacing)).toMatchInlineSnapshot(
      `"var(--spacing-md)"`,
    );
  });

  it("returns 0 when the given spacing is null", () => {
    const spacing: Parameters<typeof getSpacingVarValue>[0] = null;

    expect(getSpacingVarValue(spacing)).toMatchInlineSnapshot(`0`);
  });

  it("returns null when the given spacing is undefined", () => {
    const spacing: Parameters<typeof getSpacingVarValue>[0] = undefined;

    expect(getSpacingVarValue(spacing)).toMatchInlineSnapshot(`null`);
  });
});

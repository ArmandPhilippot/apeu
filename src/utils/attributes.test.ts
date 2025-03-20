import { describe, expect, it } from "vitest";
import {
  getCSSVars,
  getSpacingVarFromGap,
  getSpacingVarValue,
} from "./attributes";

describe("get-css-vars", () => {
  it("stringifies the given object as css variables", () => {
    const cssVars: Parameters<typeof getCSSVars>[0] = {
      foo: "bar",
      baz: "42px",
    };

    expect(getCSSVars(cssVars)).toMatchInlineSnapshot(
      `"--foo: bar; --baz: 42px;"`
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
      `"var(--spacing-md)"`
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

describe("get-spacing-var-from-gap", () => {
  it("should return a valid CSS value from a single gap", () => {
    const result = getSpacingVarFromGap("2xs");

    expect(result).toBe("var(--spacing-2xs)");
  });

  it("should return a valid CSS value from an undefined gap", () => {
    const result = getSpacingVarFromGap(null);

    expect(result).toBe(0);
  });

  it("should return a valid CSS value from a decompound gap", () => {
    const result = getSpacingVarFromGap({ col: "3xs", row: "md" });

    expect(result).toBe("var(--spacing-md) var(--spacing-3xs)");
  });

  it("should return a valid CSS value from a column gap", () => {
    const result = getSpacingVarFromGap({ col: "3xs" });

    expect(result).toBe("0 var(--spacing-3xs)");
  });

  it("should return a valid CSS value from a row gap", () => {
    const result = getSpacingVarFromGap({ row: "2xs" });

    expect(result).toBe("var(--spacing-2xs) 0");
  });
});

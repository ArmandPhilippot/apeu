import { describe, expect, it } from "vitest";
import { devOnlyPages } from "./dev-only-pages";

describe("dev-only-pages", () => {
  it("returns an Astro integration to enable dev only pages", () => {
    const result = devOnlyPages({ prefix: "__foo" });

    expect(result.hooks["astro:config:setup"]).toBeDefined();
    expect(result.name).toBe("dev-only-pages");
  });
});

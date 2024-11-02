import { describe, expect, it } from "vitest";
import { pagefind } from "./pagefind";

describe("pagefind", () => {
  it("returns an Astro integration to generate the search index on build", () => {
    const result = pagefind();

    expect(result.hooks["astro:config:setup"]).toBeDefined();
    expect(result.hooks["astro:server:setup"]).toBeDefined();
    expect(result.hooks["astro:build:done"]).toBeDefined();
    expect(result.name).toBe("pagefind");
  });
});

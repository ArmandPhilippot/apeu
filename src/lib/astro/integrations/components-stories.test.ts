import { describe, expect, it } from "vitest";
import { componentsStories } from "./components-stories";

describe("components-stories", () => {
  it("returns an Astro integration to enable dev only pages", () => {
    const result = componentsStories({ components: "./path/to/components" });

    expect(result.hooks["astro:config:setup"]).toBeDefined();
    expect(result.name).toBe("components-stories");
  });
});

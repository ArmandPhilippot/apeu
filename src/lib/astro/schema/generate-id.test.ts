import { describe, expect, it } from "vitest";
import { generateAuthorId, generatePageId } from "./generate-id";

const base = new URL("file:///content/");

describe("generateAuthorId", () => {
  it("removes the virtual authors directory and the extension", () => {
    expect(
      generateAuthorId({
        entry: "authors/armand-philippot.json",
        base,
        data: {},
      })
    ).toBe("armand-philippot");
  });
});

describe("generatePageId", () => {
  it("removes the virtual pages directory and the extension", () => {
    expect(
      generatePageId({ entry: "en/pages/legal-notice.md", base, data: {} })
    ).toBe("en/legal-notice");
  });

  it("keeps the locale prefix", () => {
    expect(
      generatePageId({ entry: "fr/pages/search.md", base, data: {} })
    ).toBe("fr/search");
  });

  it("drops a trailing index segment", () => {
    expect(
      generatePageId({ entry: "en/pages/about/index.mdx", base, data: {} })
    ).toBe("en/about");
  });
});

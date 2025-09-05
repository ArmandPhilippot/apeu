import { describe, expect, it } from "vitest";
import { getStorySeo } from "./stories";

describe("get-story-seo", () => {
  it("computes seo meta from a breadcrumb", () => {
    const meta = getStorySeo({
      breadcrumb: [
        { label: "Home", path: "/" },
        { label: "Design system", path: "/design-system" },
        { label: "Components", path: "/design-system/components" },
        { label: "Atoms", path: "/design-system/components/atoms" },
        { label: "Story", path: "/design-system/components/atoms/story" },
      ],
    });

    expect(meta).toStrictEqual({
      title: "Story | Atoms | Components | Design system",
      noindex: true,
      nofollow: true,
    });
  });

  it("allows overriding seo flags", () => {
    const meta = getStorySeo({
      breadcrumb: [
        { label: "Home", path: "/" },
        { label: "Design system", path: "/design-system" },
        { label: "Components", path: "/design-system/components" },
        { label: "Atoms", path: "/design-system/components/atoms" },
        { label: "Story", path: "/design-system/components/atoms/story" },
      ],
      seo: { noindex: false, nofollow: false, title: "Overridden" },
    });

    expect(meta.noindex).toBe(false);
    expect(meta.nofollow).toBe(false);
    expect(meta.title).toBe("Overridden");
  });
});

import { describe, it, expect, vi } from "vitest";

vi.mock("virtual:astro-stories/config", () => {
  return {
    base: "/stories",
    stories: {
      "my-custom-story": {
        route: "/stories/my-custom-story",
        type: "story",
        slug: "my-custom-story",
      },
      index: {
        route: "/stories",
        type: "index",
        slug: "index",
      },
    },
  };
});

describe("getStaticPaths", () => {
  it("returns params + props for all stories", async () => {
    expect.assertions(1);

    const { getStaticPaths } = await import("./[...story].astro");
    const paths = getStaticPaths();

    expect(paths).toStrictEqual([
      {
        params: { story: "my-custom-story" },
        props: { entry: expect.objectContaining({ slug: "my-custom-story" }) },
      },
      {
        params: { story: undefined }, // Special case for base
        props: { entry: expect.objectContaining({ slug: "index" }) },
      },
    ]);
  });
});

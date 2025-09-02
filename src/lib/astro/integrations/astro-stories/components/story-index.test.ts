import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { ComponentProps } from "astro/types";
import { beforeEach, describe, expect, it } from "vitest";
import StoryIndex from "./story-index.astro";

type LocalTestContext = {
  container: AstroContainer;
};

describe("StoryIndex", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
  });

  it<LocalTestContext>("renders a list of stories", async ({ container }) => {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory.
    expect.assertions(2);

    const props = {
      breadcrumb: [],
      children: [{ label: "A story", route: "/stories/a-story" }],
      label: "My stories index",
      route: "/stories/my-index",
      type: "index",
    } satisfies ComponentProps<typeof StoryIndex>;

    const result = await container.renderToString(StoryIndex, {
      props,
    });

    expect(result).toContain("A story");
    expect(result).toContain("/stories/a-story");
  });

  it<LocalTestContext>("can display a stories found message", async ({
    container,
  }) => {
    expect.assertions(1);

    const props = {
      breadcrumb: [],
      children: [],
      label: "My stories index",
      route: "/stories/my-index",
      type: "index",
    } satisfies ComponentProps<typeof StoryIndex>;

    const result = await container.renderToString(StoryIndex, {
      props,
    });

    expect(result).toContain("No stories found.");
  });
});

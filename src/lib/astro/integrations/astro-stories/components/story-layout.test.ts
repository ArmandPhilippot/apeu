import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { ComponentProps } from "astro/types";
import { beforeEach, describe, expect, it } from "vitest";
import StoryLayout from "./story-layout.astro";

type LocalTestContext = {
  container: AstroContainer;
};

describe("StoryLayout", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
  });

  it<LocalTestContext>("can render a story", async ({ container }) => {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory.
    expect.assertions(3);

    const story = {
      breadcrumb: [],
      frontmatter: {},
      headings: [],
      label: "My custom story",
      route: "/stories/my-custom-story",
      type: "story",
    } satisfies ComponentProps<typeof StoryLayout>["story"];

    const children = "dolor voluptatem tenetur";
    const result = await container.renderToString(StoryLayout, {
      props: { story },
      slots: { default: children },
    });

    expect(result).toContain("<title>My custom story</title>");
    expect(result).toContain("My custom story</h1>");
    expect(result).toContain(children);
  });

  it<LocalTestContext>("can render an index", async ({ container }) => {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory.
    expect.assertions(3);

    const story = {
      breadcrumb: [],
      label: "My custom index",
      route: "/stories/my-custom-index",
      type: "index",
    } satisfies ComponentProps<typeof StoryLayout>["story"];

    const children = "dolor voluptatem tenetur";
    const result = await container.renderToString(StoryLayout, {
      props: { story },
      slots: { default: children },
    });

    expect(result).toContain("<title>My custom index</title>");
    expect(result).toContain("My custom index</h1>");
    expect(result).toContain(children);
  });

  it<LocalTestContext>("can use the frontmatter to override the title", async ({
    container,
  }) => {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory.
    expect.assertions(2);

    const story = {
      breadcrumb: [],
      frontmatter: {
        title: "An overridden title",
      },
      headings: [],
      label: "My custom story",
      route: "/stories/my-custom-story",
      type: "story",
    } satisfies ComponentProps<typeof StoryLayout>["story"];

    const children = "dolor voluptatem tenetur";
    const result = await container.renderToString(StoryLayout, {
      props: { story },
      slots: { default: children },
    });

    expect(result).toContain("<title>An overridden title</title>");
    expect(result).toContain("An overridden title</h1>");
  });
});

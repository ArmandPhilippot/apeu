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
      frontmatter: {
        title: "First story",
      },
      headings: [],
      label: "My awesome story",
      route: "/stories/my-awesome-story",
      type: "story",
    } satisfies ComponentProps<typeof StoryLayout>["story"];
    const children = "dolor voluptatem tenetur";
    const result = await container.renderToString(StoryLayout, {
      props: { story },
      slots: { default: children },
    });

    expect(result).toContain("<title>My awesome story</title>");
    expect(result).toContain("First story");
    expect(result).toContain(children);
  });

  it<LocalTestContext>("can render an index", async ({ container }) => {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory.
    expect.assertions(2);

    const story = {
      breadcrumb: [],
      label: "A story index",
      route: "/stories/my-index",
      type: "index",
    } satisfies ComponentProps<typeof StoryLayout>["story"];
    const children = "dolor voluptatem tenetur";
    const result = await container.renderToString(StoryLayout, {
      props: { story },
      slots: { default: children },
    });

    expect(result).toContain("A story index");
    expect(result).toContain(children);
  });

  it<LocalTestContext>("can define a story as standalone", async ({
    container,
  }) => {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory.
    expect.assertions(3);

    const story = {
      breadcrumb: [],
      frontmatter: {
        title: "First story",
        isStandalone: true,
      },
      headings: [],
      label: "My awesome story",
      route: "/stories/my-awesome-story",
      type: "story",
    } satisfies ComponentProps<typeof StoryLayout>["story"];
    const children = "dolor voluptatem tenetur";
    const result = await container.renderToString(StoryLayout, {
      props: { story },
      slots: { default: children },
    });

    expect(result).not.toContain("<title>My awesome story</title>");
    expect(result).not.toContain("First story");
    expect(result).toContain(children);
  });
});

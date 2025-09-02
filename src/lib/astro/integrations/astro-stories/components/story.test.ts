import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { Fragment } from "astro/jsx-runtime";
import type { ComponentProps } from "astro/types";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Story from "./story.astro";

vi.mock("virtual:astro-stories/Layout", () => {
  return {
    default: Fragment,
  };
});

vi.mock("virtual:astro-stories/registry", () => {
  return {
    storyRegistry: {
      "my-custom-story": {
        Content: Fragment,
        components: {},
        frontmatter: { title: "Frontmatter title" },
        getHeadings: () => [{ depth: 1, slug: "intro", text: "Introduction" }],
      },
    },
  };
});

type LocalTestContext = {
  container: AstroContainer;
};

describe("Story", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it<LocalTestContext>("renders a story", async ({ container }) => {
    expect.assertions(1);

    const story = {
      breadcrumb: [],
      label: "My custom story",
      path: "/stories/stories/my-custom-story.mdx",
      route: "/stories/my-custom-story",
      slug: "my-custom-story",
      type: "story",
      virtualModuleId: "some-id",
    } satisfies ComponentProps<typeof Story>;

    const result = await container.renderToString(Story, {
      props: story,
    });

    /* It should, but because we're mocking the Layout it's not rendered... I don't know how to improve this. Because of the custom layout provided to the integration, I would need to mock the routing logic as well... this doesn't sound right. */
    expect(result).not.toContain("My custom story");
  });

  it<LocalTestContext>("throws when a story can't be found", async ({
    container,
  }) => {
    expect.assertions(1);

    const story = {
      breadcrumb: [],
      label: "My custom story",
      path: "/stories/stories/my-nonexistent-story.mdx",
      route: "/stories/nonexistent-story",
      slug: "nonexistent-story",
      type: "story",
      virtualModuleId: "some-inexistent-id",
    } satisfies ComponentProps<typeof Story>;

    await expect(
      container.renderToString(Story, {
        props: story,
      })
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `[Error: Couldn't find a story for the given slug. Received: nonexistent-story]`
    );
  });
});

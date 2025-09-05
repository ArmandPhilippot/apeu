import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { Fragment } from "astro/jsx-runtime";
import type { ComponentProps } from "astro/types";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import StoryIndex from "./story-index.astro";

vi.mock("astro:content", async (importOriginal) => {
  const mod = await importOriginal<typeof import("astro:content")>();
  return {
    ...mod,
    getCollection: vi.fn(() => []),
    getEntry: vi.fn(),
  };
});

vi.mock("virtual:astro-stories/Layout", () => {
  return {
    default: Fragment,
  };
});

type LocalTestContext = {
  container: AstroContainer;
};

describe("StoryIndex", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it<LocalTestContext>("renders a list of stories", async ({ container }) => {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory.
    expect.assertions(2);

    const props = {
      breadcrumb: [],
      children: [{ label: "A story", path: "/stories/a-story" }],
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

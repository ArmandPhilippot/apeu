import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { ComponentProps } from "astro/types";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  createLayoutMockEntries,
  setupCollectionMocks,
} from "../../../../tests/helpers/astro-content";
import { clearEntriesIndexCache } from "../../../lib/astro/collections/indexes";
import StoryLayout from "./story-layout.astro";

vi.mock("astro:content", async (importOriginal) => {
  const mod = await importOriginal<typeof import("astro:content")>();
  return {
    ...mod,
    getCollection: vi.fn(() => []),
    getEntry: vi.fn(),
  };
});

type LocalTestContext = {
  container: AstroContainer;
};

describe("StoryLayout", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();

    const layoutEntries = createLayoutMockEntries(["en", "fr"]);
    setupCollectionMocks(layoutEntries);
  });

  afterEach(() => {
    clearEntriesIndexCache();
    vi.clearAllMocks();
  });

  it<LocalTestContext>("can render a story", async ({ container }) => {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory.
    expect.assertions(2);

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

  it<LocalTestContext>("can define a story without layout", async ({
    container,
  }) => {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory.
    expect.assertions(3);

    const story = {
      breadcrumb: [],
      frontmatter: {
        seo: {
          title: "My SEO title for this story",
        },
        title: "First story",
        wrapInLayout: false,
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

    expect(result).not.toContain("<title>My SEO title for this story</title>");
    expect(result).toContain("First story");
    expect(result).toContain(children);
  });

  it<LocalTestContext>("can define a story without page frame", async ({
    container,
  }) => {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory.
    expect.assertions(3);

    const story = {
      breadcrumb: [],
      frontmatter: {
        seo: {
          title: "My SEO title for this story",
        },
        title: "First story",
        wrapInPageFrame: false,
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

    expect(result).toContain("<title>My SEO title for this story</title>");
    expect(result).not.toContain("First story");
    expect(result).toContain(children);
  });
});

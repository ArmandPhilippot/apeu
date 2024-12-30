import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { ComponentProps } from "astro/types";
import { beforeEach, describe, expect, it } from "vitest";
import CollectionListByYear from "./collection-list-by-year.astro";

type LocalTestContext = {
  container: AstroContainer;
};

describe("CollectionListByYear", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
  });

  it<LocalTestContext>("renders a section per year in the list", async ({
    container,
  }) => {
    const props = {
      items: [
        {
          collection: "blogPosts",
          description: "Excerpt of the post 1.",
          id: "post-1",
          locale: "en",
          meta: {
            publishedOn: new Date("2024-12-30"),
            updatedOn: new Date("2024-12-30"),
          },
          route: "#post-1",
          title: "Post 1",
        },
        {
          collection: "blogPosts",
          description: "Excerpt of the post 2.",
          id: "post-2",
          locale: "en",
          meta: {
            publishedOn: new Date("2024-10-20"),
            updatedOn: new Date("2024-11-15"),
          },
          route: "#post-2",
          title: "Post 2",
        },
        {
          collection: "blogPosts",
          description: "Excerpt of the post 3.",
          id: "post-3",
          locale: "en",
          meta: {
            publishedOn: new Date("2023-11-10"),
            updatedOn: new Date("2023-11-10"),
          },
          route: "#post-3",
          title: "Post 3",
        },
      ],
    } satisfies ComponentProps<typeof CollectionListByYear>;

    const result = await container.renderToString(CollectionListByYear, {
      props,
    });

    const sections = [...result.matchAll(/<section(?:.*?)<\/section>/g)];

    // 2024 and 2023
    expect(sections).toHaveLength(2);
  });
});

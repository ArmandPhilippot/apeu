import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { ComponentProps } from "astro/types";
import { beforeEach, describe, expect, it, vi } from "vitest";
import NotFoundView from "./not-found-view.astro";

type LocalTestContext = {
  container: AstroContainer;
};

describe("NotFoundView", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
  });

  it<LocalTestContext>("renders a search form", async ({ container }) => {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory.
    expect.assertions(2);

    const props = {
      entry: {
        Content: vi.fn().mockImplementation(() => null),
        collection: "pages",
        description: "The not found page.",
        hasContent: false,
        headings: [],
        id: "en/not-found",
        locale: "en",
        meta: {
          publishedOn: new Date(),
          updatedOn: new Date(),
        },
        route: "/not-found",
        seo: {
          description: "",
          title: "Not found",
        },
        slug: "not-found",
        title: "Not found",
      },
    } satisfies ComponentProps<typeof NotFoundView>;
    const result = await container.renderToString(NotFoundView, {
      props,
    });

    expect(result).toContain("not-found-search");
    expect(result).toContain("</form>");
  });
});

import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { ComponentProps } from "astro/types";
import { beforeEach, describe, expect, it, vi } from "vitest";
import SearchView from "./search-view.astro";

type LocalTestContext = {
  container: AstroContainer;
};

describe("SearchView", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
  });

  it<LocalTestContext>("renders the pagefind UI", async ({ container }) => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(2);

    const props = {
      entry: {
        Content: vi.fn().mockImplementation(() => null),
        collection: "pages",
        description: "The search page.",
        hasContent: false,
        headings: [],
        id: "en/search",
        locale: "en",
        meta: {
          publishedOn: new Date(),
          updatedOn: new Date(),
        },
        route: "/search",
        seo: {
          description: "",
          title: "Search",
        },
        slug: "search",
        title: "Search",
      },
    } satisfies ComponentProps<typeof SearchView>;
    const result = await container.renderToString(SearchView, {
      props,
    });

    expect(result).toContain("</ap-pagefind-search>");
    expect(result).toContain(`id="pagefind"`);
  });
});

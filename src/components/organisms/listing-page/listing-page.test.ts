import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { ComponentProps } from "astro/types";
import { beforeEach, describe, expect, it } from "vitest";
import ListingPage from "./listing-page.astro";

type LocalTestContext = {
  container: AstroContainer;
};

describe("ListingPage", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
  });

  it<LocalTestContext>("renders its title, meta and entries", async ({
    container,
  }) => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(5);

    const props = {
      entries: [
        { description: "The card 1 excerpt.", heading: "Card 1" },
        { description: "The card 2 excerpt.", heading: "Card 2" },
        { description: "The card 3 excerpt.", heading: "Card 3" },
        { description: "The card 4 excerpt.", heading: "Card 4" },
        { description: "The card 5 excerpt.", heading: "Card 5" },
      ],
      pagination: { currentPage: 1, lastPage: 1 },
      route: "#page-route",
      totalEntries: "10 entries",
      title: "unde non eum",
    } satisfies ComponentProps<typeof ListingPage>;
    const result = await container.renderToString(ListingPage, {
      props,
    });

    expect(result).toContain(props.entries[0]?.heading);
    expect(result).toContain(props.entries[0]?.description);
    expect(result).toContain(props.title);
    expect(result).toContain(props.totalEntries);
    expect(result).not.toContain("listing-page-pagination");
  });

  it<LocalTestContext>("can render a pagination", async ({ container }) => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(2);

    const props = {
      entries: [
        { description: "The card 1 excerpt.", heading: "Card 1" },
        { description: "The card 2 excerpt.", heading: "Card 2" },
      ],
      pagination: { currentPage: 1, lastPage: 5 },
      route: "#page-route",
      totalEntries: "10 entries",
      title: "unde non eum",
    } satisfies ComponentProps<typeof ListingPage>;
    const result = await container.renderToString(ListingPage, {
      props,
    });

    expect(result).toContain(props.route);
    expect(result).toContain("listing-page-pagination");
  });
});

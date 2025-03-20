import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { ComponentProps } from "astro/types";
import { beforeEach, describe, expect, it } from "vitest";
import PagefindSearch from "./pagefind-search.astro";

type LocalTestContext = {
  container: AstroContainer;
};

describe("PagefindSearch", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
  });

  it<LocalTestContext>("renders the pagefind UI", async ({ container }) => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(2);

    const props = {} satisfies ComponentProps<typeof PagefindSearch>;
    const result = await container.renderToString(PagefindSearch, {
      props,
    });

    expect(result).toContain("</ap-pagefind-search>");
    expect(result).toContain(`id="pagefind"`);
  });
});

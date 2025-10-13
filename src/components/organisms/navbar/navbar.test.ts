import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { ComponentProps } from "astro/types";
import { beforeEach, describe, expect, it } from "vitest";
import Navbar from "./navbar.astro";

type LocalTestContext = {
  container: AstroContainer;
};

describe("Navbar", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
  });

  it<LocalTestContext>("renders the navbar", async ({ container }) => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(3);

    const props = {
      altLanguages: null,
      mainNav: [],
    } satisfies ComponentProps<typeof Navbar>;
    const result = await container.renderToString(Navbar, {
      props,
    });

    expect(result).toContain("navbar-menu-modal");
    expect(result).toContain("navbar-search-modal");
    expect(result).toContain("navbar-settings-modal");
  });
});

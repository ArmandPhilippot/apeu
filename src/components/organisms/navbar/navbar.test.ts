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
    const props = {
      id: "perspiciatis",
    } satisfies ComponentProps<typeof Navbar>;
    const result = await container.renderToString(Navbar, {
      props,
    });

    expect.assertions(4);

    expect(result).toContain(props.id);
    expect(result).toContain("Menu");
    expect(result).toContain("Search");
    expect(result).toContain("Settings");
  });
});

import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { ComponentProps } from "astro/types";
import { beforeEach, describe, expect, it } from "vitest";
import MainNav from "./main-nav.astro";

type LocalTestContext = {
  container: AstroContainer;
};

describe("MainNav", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
  });

  it<LocalTestContext>("renders a list of navigation items", async ({
    container,
  }) => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(4);

    const props = {
      items: [
        { label: "quia voluptate atque", url: "#et-reprehenderit-et" },
        { label: "odit accusamus quidem", url: "#quod-voluptas-earum" },
      ] as const,
    } satisfies ComponentProps<typeof MainNav>;
    const label = "pariatur dolorem ipsum";
    const result = await container.renderToString(MainNav, {
      props,
      slots: { default: label },
    });

    expect(result).toContain(props.items[0].label);
    expect(result).toContain(props.items[0].url);
    expect(result).toContain(props.items[1].label);
    expect(result).toContain(props.items[1].url);
  });
});

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
    expect.assertions(4);

    const props = {
      id: "perspiciatis",
    } satisfies ComponentProps<typeof Navbar>;
    const nav = "voluptatem cumque accusantium";
    const search = "totam molestiae tempora";
    const settings = "dolore vero exercitationem";
    const result = await container.renderToString(Navbar, {
      props,
      slots: { nav, search, settings },
    });

    expect(result).toContain(props.id);
    expect(result).toContain(nav);
    expect(result).toContain(search);
    expect(result).toContain(settings);
  });

  it<LocalTestContext>("throws an error when the nav slot is missing", async ({
    container,
  }) => {
    expect.assertions(1);

    const props = {
      id: "perspiciatis",
    } satisfies ComponentProps<typeof Navbar>;
    const search = "totam molestiae tempora";
    const settings = "dolore vero exercitationem";

    await expect(async () =>
      container.renderToString(Navbar, {
        props,
        slots: { search, settings },
      })
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `[MissingSlotError: A nav slot is required.]`
    );
  });

  it<LocalTestContext>("throws an error when the search slot is missing", async ({
    container,
  }) => {
    expect.assertions(1);

    const props = {
      id: "perspiciatis",
    } satisfies ComponentProps<typeof Navbar>;
    const nav = "voluptatem cumque accusantium";
    const settings = "dolore vero exercitationem";

    await expect(async () =>
      container.renderToString(Navbar, {
        props,
        slots: { nav, settings },
      })
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `[MissingSlotError: A search slot is required.]`
    );
  });

  it<LocalTestContext>("throws an error when the settings slot is missing", async ({
    container,
  }) => {
    expect.assertions(1);

    const props = {
      id: "perspiciatis",
    } satisfies ComponentProps<typeof Navbar>;
    const nav = "voluptatem cumque accusantium";
    const search = "totam molestiae tempora";

    await expect(async () =>
      container.renderToString(Navbar, {
        props,
        slots: { nav, search },
      })
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `[MissingSlotError: A settings slot is required.]`
    );
  });
});

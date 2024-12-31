import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { ComponentProps } from "astro/types";
import { beforeEach, describe, expect, it } from "vitest";
import Copyright from "./copyright.astro";

type LocalTestContext = {
  container: AstroContainer;
};

describe("Copyright", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
  });

  it<LocalTestContext>("renders a copyright", async ({ container }) => {
    const props = {
      creationYear: new Date().getFullYear(),
      owner: "Wilford",
    } satisfies ComponentProps<typeof Copyright>;
    const result = await container.renderToString(Copyright, {
      props,
    });

    expect.assertions(1);

    expect(result).toContain(`&copy; ${props.creationYear} ${props.owner}.`);
  });

  it<LocalTestContext>("can add the current year when different from the creation year", async ({
    container,
  }) => {
    const props = {
      creationYear: 2010,
      owner: "Wilford",
    } satisfies ComponentProps<typeof Copyright>;
    const result = await container.renderToString(Copyright, {
      props,
    });

    expect.assertions(1);

    expect(result).toContain(
      `&copy; ${props.creationYear} - ${new Date().getFullYear()} ${props.owner}.`,
    );
  });
});

import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { ComponentProps } from "astro/types";
import { beforeEach, describe, expect, it } from "vitest";
import ThemeSwitch from "./theme-switch.astro";

type LocalTestContext = {
  container: AstroContainer;
};

describe("ThemeSwitch", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
  });

  it<LocalTestContext>("should render a switch button", async ({
    container,
  }) => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(2);

    const props = {
      label: "optio accusantium vel",
    } satisfies ComponentProps<typeof ThemeSwitch>;
    const result = await container.renderToString(ThemeSwitch, { props });

    expect(result).toContain('role="switch"');
    expect(result).toContain(props.label);
  });

  it<LocalTestContext>("should hide the label with hideLabel", async ({
    container,
  }) => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(2);

    const props = {
      hideLabel: true,
      label: "optio accusantium vel",
    } satisfies ComponentProps<typeof ThemeSwitch>;
    const result = await container.renderToString(ThemeSwitch, { props });

    expect(result).toContain("sr-only");
    expect(result).toContain(props.label);
  });

  it<LocalTestContext>("should inline the label and the options with isInline", async ({
    container,
  }) => {
    expect.assertions(1);

    const props = {
      isInline: true,
      label: "optio accusantium vel",
    } satisfies ComponentProps<typeof ThemeSwitch>;
    const result = await container.renderToString(ThemeSwitch, { props });

    expect(result).toContain('data-inline="true"');
  });
});

import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { ComponentProps } from "astro/types";
import { beforeEach, describe, expect, it } from "vitest";
import ThemeSetting from "./theme-setting.astro";

type LocalTestContext = {
  container: AstroContainer;
};

describe("ThemeSetting", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
  });

  it<LocalTestContext>("should render a toggle component to update the theme", async ({
    container,
  }) => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(3);

    const props = {
      label: "fugiat animi sed",
      setting: "theme",
    } satisfies ComponentProps<typeof ThemeSetting>;
    const result = await container.renderToString(ThemeSetting, {
      props,
    });

    expect(result).toContain(`data-setting="${props.setting}"`);
    expect(result).toContain('data-variant="toggle"');
    expect(result).toContain(props.label);
  });

  it<LocalTestContext>("should render a switch component to update the theme", async ({
    container,
  }) => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(2);

    const props = {
      label: "fugiat animi sed",
      setting: "theme",
      variant: "switch",
    } satisfies ComponentProps<typeof ThemeSetting>;
    const result = await container.renderToString(ThemeSetting, {
      props,
    });

    expect(result).toContain(`data-setting="${props.setting}"`);
    expect(result).toContain('data-variant="switch"');
  });

  it<LocalTestContext>("can use a prefix from an id", async ({ container }) => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(4);

    const props = {
      id: "voluptatem",
      label: "fugiat animi sed",
      setting: "theme",
    } satisfies ComponentProps<typeof ThemeSetting>;
    const result = await container.renderToString(ThemeSetting, {
      props,
    });

    expect(result).toContain(`id="${props.id}"`);
    expect(result).toContain(`${props.id}-${props.setting}-auto`);
    expect(result).toContain(`${props.id}-${props.setting}-dark`);
    expect(result).toContain(`${props.id}-${props.setting}-light`);
  });
});

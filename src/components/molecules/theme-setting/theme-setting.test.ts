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

  it<LocalTestContext>("renders a toggle component to change theme", async ({
    container,
  }) => {
    const props = {
      label: "fugiat animi sed",
      setting: "theme",
    } satisfies ComponentProps<typeof ThemeSetting>;
    const result = await container.renderToString(ThemeSetting, {
      props,
    });

    expect.assertions(2);

    expect(result).toContain(`data-setting="${props.setting}"`);
    expect(result).toContain('data-variant="toggle"');
  });

  it<LocalTestContext>("renders its label", async ({ container }) => {
    const props = {
      label: "fugiat animi sed",
      setting: "theme",
    } satisfies ComponentProps<typeof ThemeSetting>;
    const result = await container.renderToString(ThemeSetting, {
      props,
    });

    expect.assertions(1);

    expect(result).toContain(props.label);
  });

  it<LocalTestContext>("can use a prefix from an id", async ({ container }) => {
    const props = {
      id: "voluptatem",
      label: "fugiat animi sed",
      setting: "theme",
    } satisfies ComponentProps<typeof ThemeSetting>;
    const result = await container.renderToString(ThemeSetting, {
      props,
    });

    expect.assertions(4);

    expect(result).toContain(`id="${props.id}"`);
    expect(result).toContain(`${props.id}-${props.setting}-auto`);
    expect(result).toContain(`${props.id}-${props.setting}-dark`);
    expect(result).toContain(`${props.id}-${props.setting}-light`);
  });
});

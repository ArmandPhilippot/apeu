import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { ComponentProps } from "astro/types";
import { beforeEach, describe, expect, it } from "vitest";
import SettingsForm from "./settings-form.astro";

type LocalTestContext = {
  container: AstroContainer;
};

describe("SettingsForm", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
  });

  it<LocalTestContext>("renders a settings form", async ({ container }) => {
    const props = {} satisfies ComponentProps<typeof SettingsForm>;
    const result = await container.renderToString(SettingsForm, {
      props,
    });

    expect.assertions(2);

    expect(result).toContain("</form>");
    expect(result).toContain("Theme:");
  });

  it<LocalTestContext>("can use an id", async ({ container }) => {
    const props = {
      id: "voluptates",
    } satisfies ComponentProps<typeof SettingsForm>;
    const result = await container.renderToString(SettingsForm, {
      props,
    });

    expect.assertions(2);

    expect(result).toContain(`id="${props.id}"`);
    expect(result).toContain(`${props.id}-theme`);
  });
});

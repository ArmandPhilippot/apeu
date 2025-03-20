import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { ComponentProps } from "astro/types";
import { beforeEach, describe, expect, it } from "vitest";
import RadioGroup from "./radio-group.astro";

type LocalTestContext = {
  container: AstroContainer;
};

describe("RadioGroup", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
  });

  it<LocalTestContext>("renders a group of radio buttons", async ({
    container,
  }) => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(2);

    const props = {
      label: "pariatur dolorem ipsum",
      name: "optio",
    } satisfies ComponentProps<typeof RadioGroup>;
    const items = "nihil facere est";
    const result = await container.renderToString(RadioGroup, {
      props,
      slots: { default: items },
    });

    expect(result).toContain(props.label);
    expect(result).toContain(items);
  });
});

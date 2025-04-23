import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { ComponentProps } from "astro/types";
import { beforeEach, describe, expect, it } from "vitest";
import ProgressBar from "./progress-bar.astro";

type LocalTestContext = {
  container: AstroContainer;
};

describe("ProgressBar", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
  });

  it<LocalTestContext>("can render a progress bar", async ({ container }) => {
    expect.assertions(1);

    const props = {} satisfies ComponentProps<typeof ProgressBar>;
    const result = await container.renderToString(ProgressBar, {
      props,
    });

    expect(result).toContain("</progress");
  });

  it<LocalTestContext>("can use a current value", async ({ container }) => {
    expect.assertions(1);

    const props = {
      current: 0.5,
    } satisfies ComponentProps<typeof ProgressBar>;
    const result = await container.renderToString(ProgressBar, {
      props,
    });

    expect(result).toContain(`${props.current}/1`);
  });

  it<LocalTestContext>("can use a custom max value", async ({ container }) => {
    expect.assertions(1);

    const props = {
      current: 50,
      max: 100,
    } satisfies ComponentProps<typeof ProgressBar>;
    const result = await container.renderToString(ProgressBar, {
      props,
    });

    expect(result).toContain(`${props.current}/${props.max}`);
  });
});

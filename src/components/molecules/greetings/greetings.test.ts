import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { ComponentProps } from "astro/types";
import { beforeEach, describe, expect, it } from "vitest";
import Greetings from "./greetings.astro";

type LocalTestContext = {
  container: AstroContainer;
};

describe("Greetings", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
  });

  it<LocalTestContext>("renders the name", async ({ container }) => {
    const props = {
      name: "John Doe",
    } satisfies ComponentProps<typeof Greetings>;
    const result = await container.renderToString(Greetings, {
      props,
    });

    expect.assertions(1);

    expect(result).toContain(props.name);
  });
});

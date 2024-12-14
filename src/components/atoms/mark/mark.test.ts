import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { beforeEach, describe, expect, it } from "vitest";
import Mark from "./mark.astro";

type LocalTestContext = {
  container: AstroContainer;
};

describe("Mark", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
  });

  it<LocalTestContext>("should renders its children", async ({ container }) => {
    const mark = "dolor voluptatem tenetur";
    const result = await container.renderToString(Mark, {
      slots: { default: mark },
    });

    expect.assertions(1);

    expect(result).toContain(`${mark}</mark>`);
  });
});

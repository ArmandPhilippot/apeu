import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { ComponentProps } from "astro/types";
import { beforeEach, describe, expect, it } from "vitest";
import CopyToClipboard from "./copy-to-clipboard.astro";

type LocalTestContext = {
  container: AstroContainer;
};

describe("CopyToClipboard", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
  });

  it<LocalTestContext>("should render a button to copy to clipboard", async ({
    container,
  }) => {
    const props = {
      feedback: "dicta voluptatem aut",
      label: "et quas numquam",
      selector: "reprehenderit",
    } satisfies ComponentProps<typeof CopyToClipboard>;
    const result = await container.renderToString(CopyToClipboard, {
      props,
    });

    expect.assertions(4);

    expect(result).toContain("<button");
    expect(result).toContain(`data-selector="${props.selector}"`);
    expect(result).toContain(props.label);
    expect(result).toContain(props.feedback);
  });
});

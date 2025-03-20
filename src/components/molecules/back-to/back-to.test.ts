import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { ComponentProps } from "astro/types";
import { beforeEach, describe, expect, it } from "vitest";
import BackTo from "./back-to.astro";

type LocalTestContext = {
  container: AstroContainer;
};

describe("BackTo", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
  });

  it<LocalTestContext>("renders an anchor link with a visually hidden label", async ({
    container,
  }) => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(2);

    const props = {
      anchor: "#adipisci-non-odio",
      label: "dolor nam maiores",
    } satisfies ComponentProps<typeof BackTo>;
    const result = await container.renderToString(BackTo, {
      props,
    });

    expect(result).toContain(`href="${props.anchor}"`);
    expect(result).toContain(props.label);
  });

  it<LocalTestContext>("throws an error when the to prop is not an anchor", async ({
    container,
  }) => {
    expect.assertions(1);

    await expect(async () =>
      container.renderToString(BackTo, {
        props: { anchor: "adipisci-non-odio", label: "aut ut libero" },
      })
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `[Error: The \`anchor\` property should be an anchor on the same page. It must start with \`#\`.]`
    );
  });
});

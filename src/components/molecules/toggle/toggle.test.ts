import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { ComponentProps } from "astro/types";
import { beforeEach, describe, expect, it } from "vitest";
import Toggle from "./toggle.astro";

type LocalTestContext = {
  container: AstroContainer;
};

describe("Toggle", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
  });

  it<LocalTestContext>("renders a toggle with a label", async ({
    container,
  }) => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(2);

    const props = {
      groupName: "enim",
      items: [
        { id: "ut", label: "velit earum quos", value: "alias" },
        { id: "et", label: "dolorum esse consequuntur", value: "laboriosam" },
      ],
      label: "autem vel nostrum",
    } satisfies ComponentProps<typeof Toggle>;
    const result = await container.renderToString(Toggle, {
      props,
    });

    const items = [...result.matchAll(/<input.*?>/g)];

    expect(result).toContain(props.label);
    expect(items).toHaveLength(props.items.length);
  });
});

import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { ComponentProps } from "astro/types";
import { beforeEach, describe, expect, it } from "vitest";
import Meta from "./meta.astro";

type LocalTestContext = {
  container: AstroContainer;
};

describe("Meta", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
  });

  it<LocalTestContext>("should render the given items", async ({
    container,
  }) => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(3);

    const props = {
      items: [{ label: "Item 1", values: ["value1"] }],
    } satisfies ComponentProps<typeof Meta>;
    const result = await container.renderToString(Meta, { props });

    expect(result).toContain("</dl>");
    expect(result).toContain(props.items[0]?.label);
    expect(result).toContain(props.items[0]?.values[0]);
  });

  it<LocalTestContext>("can render an item description", async ({
    container,
  }) => {
    expect.assertions(1);

    const props = {
      items: [
        {
          description: "The item description",
          label: "Item 1",
          values: ["value1"],
        },
      ],
    } satisfies ComponentProps<typeof Meta>;
    const result = await container.renderToString(Meta, { props });

    expect(result).toContain(`title="${props.items[0]?.description}"`);
  });

  it<LocalTestContext>("can render an item icon", async ({ container }) => {
    expect.assertions(1);

    const props = {
      items: [
        {
          icon: { name: "arrow-right" },
          label: "Item 1",
          values: ["value1"],
        },
      ],
    } satisfies ComponentProps<typeof Meta>;
    const result = await container.renderToString(Meta, { props });

    expect(result).toContain("meta-icon");
  });

  it<LocalTestContext>("can render an item with a visually hidden label", async ({
    container,
  }) => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(2);

    const props = {
      hideLabel: true,
      items: [
        {
          icon: { name: "arrow-right" },
          label: "Item 1",
          values: ["value1"],
        },
      ],
    } satisfies ComponentProps<typeof Meta>;
    const result = await container.renderToString(Meta, { props });

    expect(result).toContain(props.items[0]?.label);
    expect(result).toContain("sr-only");
  });
});

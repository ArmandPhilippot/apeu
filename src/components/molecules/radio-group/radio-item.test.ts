import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { ComponentProps } from "astro/types";
import { beforeEach, describe, expect, it } from "vitest";
import RadioItem from "./radio-item.astro";

type LocalTestContext = {
  container: AstroContainer;
};

describe("RadioItem", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
  });

  it<LocalTestContext>("renders a radio button with label", async ({
    container,
  }) => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(5);

    const props = {
      fieldId: "libero",
      name: "optio",
      value: "voluptatem",
    } satisfies ComponentProps<typeof RadioItem>;
    const label = "pariatur dolorem ipsum";
    const result = await container.renderToString(RadioItem, {
      props,
      slots: { default: label },
    });

    expect(result).toContain(`type="radio"`);
    expect(result).toContain(`id="${props.fieldId}"`);
    expect(result).toContain(`name="${props.name}"`);
    expect(result).toContain(`value="${props.value}"`);
    expect(result).toContain(label);
  });

  it<LocalTestContext>("throws an error if the label is missing", async ({
    container,
  }) => {
    expect.assertions(1);

    const props = {
      fieldId: "libero",
      name: "optio",
      value: "voluptatem",
    } satisfies ComponentProps<typeof RadioItem>;

    await expect(async () =>
      container.renderToString(RadioItem, {
        props,
      })
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `[MissingSlotError: A default slot is required.]`
    );
  });
});

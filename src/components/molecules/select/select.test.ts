import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { ComponentProps } from "astro/types";
import { beforeEach, describe, expect, it } from "vitest";
import Select from "./select.astro";

type LocalTestContext = {
  container: AstroContainer;
};

describe("Select", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
  });

  it<LocalTestContext>("renders a select element and its options", async ({
    container,
  }) => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(3);

    const props = {
      label: "Choose an option",
      options: [
        { label: "Option 1", value: "option-1" },
        { label: "Option 2", value: "option-2" },
        { label: "Option 3", value: "option-3" },
      ],
      value: "option-2",
    } satisfies ComponentProps<typeof Select>;
    const result = await container.renderToString(Select, {
      props,
    });
    const optionsEl = [...result.matchAll(/<option.*?<\/option>/g)];

    expect(result).toContain(props.label);
    expect(result).toContain("</select>");
    expect(optionsEl).toHaveLength(props.options.length);
  });

  it<LocalTestContext>("can visually hide its label", async ({ container }) => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(2);

    const props = {
      hideLabel: true,
      label: "Choose an option",
      options: [
        { label: "Option 1", value: "option-1" },
        { label: "Option 2", value: "option-2" },
        { label: "Option 3", value: "option-3" },
      ],
      value: "option-2",
    } satisfies ComponentProps<typeof Select>;
    const result = await container.renderToString(Select, {
      props,
    });

    expect(result).toContain(props.label);
    expect(result).toContain("sr-only");
  });

  it<LocalTestContext>("throws an error if the value is invalid", async ({
    container,
  }) => {
    expect.assertions(1);

    const props = {
      hideLabel: true,
      label: "Choose an option",
      options: [
        { label: "Option 1", value: "option-1" },
        { label: "Option 2", value: "option-2" },
        { label: "Option 3", value: "option-3" },
      ],
      value: "option-2",
    } satisfies ComponentProps<typeof Select>;

    const invalidProps = { ...props, value: "something" };

    await expect(async () =>
      container.renderToString(Select, { props: invalidProps })
    ).rejects.toThrowErrorMatchingInlineSnapshot();
  });
});

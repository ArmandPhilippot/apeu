import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { ComponentProps } from "astro/types";
import { beforeEach, describe, expect, it } from "vitest";
import SelectField from "./select-field.astro";

type LocalTestContext = {
  container: AstroContainer;
};

describe("SelectField", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
  });

  it<LocalTestContext>("renders a select element and its options", async ({
    container,
  }) => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(2);

    const props = {
      options: [
        { label: "Option 1", value: "option-1" },
        { label: "Option 2", value: "option-2" },
        { label: "Option 3", value: "option-3" },
      ],
      value: "option-2",
    } satisfies ComponentProps<typeof SelectField>;
    const result = await container.renderToString(SelectField, {
      props,
    });
    const optionsEl = [...result.matchAll(/<option.*?<\/option>/g)];

    expect(result).toContain("</select>");
    expect(optionsEl).toHaveLength(props.options.length);
  });

  it<LocalTestContext>("throws an error if the value is invalid", async ({
    container,
  }) => {
    expect.assertions(1);

    const props = {
      options: [
        { label: "Option 1", value: "option-1" },
        { label: "Option 2", value: "option-2" },
        { label: "Option 3", value: "option-3" },
      ],
      value: "option-2",
    } satisfies ComponentProps<typeof SelectField>;

    const invalidProps = { ...props, value: "something" };

    await expect(async () =>
      container.renderToString(SelectField, { props: invalidProps })
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `[Error: The provided value does not match any value in your "options". Received: something]`
    );
  });
});

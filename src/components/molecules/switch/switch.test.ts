import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { ComponentProps } from "astro/types";
import { beforeEach, describe, expect, it } from "vitest";
import Switch from "./switch.astro";

type LocalTestContext = {
  container: AstroContainer;
};

describe("Switch", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
  });

  it<LocalTestContext>("should render a switch button", async ({
    container,
  }) => {
    const props = {
      items: [
        { label: "voluptatum illo commodi", value: "est" },
        { label: "ut et quos", value: "distinctio" },
      ] as const,
      label: "optio accusantium vel",
      value: "est",
    } satisfies ComponentProps<typeof Switch>;
    const result = await container.renderToString(Switch, { props });

    expect.assertions(4);

    expect(result).toContain('role="switch"');
    expect(result).toContain(props.label);
    expect(result).toContain(props.items[0].label);
    expect(result).toContain(props.items[1].label);
  });

  it<LocalTestContext>("should render the button as checked", async ({
    container,
  }) => {
    const props = {
      items: [
        { label: "voluptatum illo commodi", value: "est" },
        { label: "ut et quos", value: "distinctio" },
      ] as const,
      label: "optio accusantium vel",
      value: "distinctio",
    } satisfies ComponentProps<typeof Switch>;
    const result = await container.renderToString(Switch, { props });

    expect.assertions(1);

    expect(result).toContain('aria-checked="true"');
  });

  it<LocalTestContext>("should visually hide the options labels with hideItemsLabel defined with true", async ({
    container,
  }) => {
    const props = {
      hideItemsLabel: true,
      items: [
        { icon: "arrow-right", label: "voluptatum illo commodi", value: "est" },
        { icon: "blog", label: "ut et quos", value: "distinctio" },
      ] as const,
      label: "optio accusantium vel",
      value: "est",
    } satisfies ComponentProps<typeof Switch>;
    const result = await container.renderToString(Switch, { props });

    expect.assertions(2);

    expect(result).toContain(`<title>${props.items[0].label}</title>`);
    expect(result).toContain(`<title>${props.items[1].label}</title>`);
  });

  it<LocalTestContext>("should visually hide the options labels with hideItemsLabel defined with false", async ({
    container,
  }) => {
    const props = {
      hideItemsLabel: false,
      items: [
        { icon: "arrow-right", label: "voluptatum illo commodi", value: "est" },
        { icon: "blog", label: "ut et quos", value: "distinctio" },
      ] as const,
      label: "optio accusantium vel",
      value: "est",
    } satisfies ComponentProps<typeof Switch>;
    const result = await container.renderToString(Switch, { props });

    expect.assertions(2);

    expect(result).not.toContain(`<title>${props.items[0].label}</title>`);
    expect(result).not.toContain(`<title>${props.items[1].label}</title>`);
  });

  it<LocalTestContext>("should hide the label with hideLabel", async ({
    container,
  }) => {
    const props = {
      hideLabel: true,
      items: [
        { label: "voluptatum illo commodi", value: "est" },
        { label: "ut et quos", value: "distinctio" },
      ] as const,
      label: "optio accusantium vel",
      value: "est",
    } satisfies ComponentProps<typeof Switch>;
    const result = await container.renderToString(Switch, { props });

    expect.assertions(1);

    expect(result).toContain(`title="${props.label}"`);
  });

  it<LocalTestContext>("should inline the label and the options with isInline", async ({
    container,
  }) => {
    const props = {
      isInline: true,
      items: [
        { label: "voluptatum illo commodi", value: "est" },
        { label: "ut et quos", value: "distinctio" },
      ] as const,
      label: "optio accusantium vel",
      value: "est",
    } satisfies ComponentProps<typeof Switch>;
    const result = await container.renderToString(Switch, { props });

    expect.assertions(1);

    expect(result).toContain('data-inline="true"');
  });

  it<LocalTestContext>("should throw an error with an invalid value", async ({
    container,
  }) => {
    const props = {
      items: [
        { label: "voluptatum illo commodi", value: "est" },
        { label: "ut et quos", value: "distinctio" },
      ] as const,
      label: "optio accusantium vel",
      value: "invalid",
    } satisfies ComponentProps<typeof Switch>;

    expect.assertions(1);

    await expect(async () =>
      container.renderToString(Switch, { props }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `[Error: The switch value should be the value of one of its items, received: invalid.]`,
    );
  });

  it<LocalTestContext>("should throw an error when using hideItemsLabel without icons", async ({
    container,
  }) => {
    const props = {
      hideItemsLabel: true,
      items: [
        { label: "voluptatum illo commodi", value: "est" },
        { label: "ut et quos", value: "distinctio" },
      ] as const,
      label: "optio accusantium vel",
      value: "est",
    } satisfies ComponentProps<typeof Switch>;

    expect.assertions(1);

    await expect(async () =>
      container.renderToString(Switch, { props }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `[Error: The hideItemsLabel option is invalid when items do not have icons.]`,
    );
  });
});

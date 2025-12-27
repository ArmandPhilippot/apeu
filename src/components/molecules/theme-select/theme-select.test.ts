import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { ComponentProps } from "astro/types";
import { beforeEach, describe, expect, it } from "vitest";
import ThemeSelect from "./theme-select.astro";

type LocalTestContext = {
  container: AstroContainer;
};

describe("ThemeSelect", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
  });

  it<LocalTestContext>("renders a label and the theme options", async ({
    container,
  }) => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(4);

    const props = {
      current: "auto",
      label: "non nulla blanditiis",
      themes: {
        auto: "Foo",
        dark: "Bar",
        light: "Baz",
      },
    } satisfies ComponentProps<typeof ThemeSelect>;

    const result = await container.renderToString(ThemeSelect, { props });

    expect(result).toContain(props.label);
    expect(result).toContain(props.themes.auto);
    expect(result).toContain(props.themes.dark);
    expect(result).toContain(props.themes.light);
  });

  it<LocalTestContext>("throws an error if current is invalid", async ({
    container,
  }) => {
    expect.assertions(1);

    const props = {
      current: "auto",
      label: "non nulla blanditiis",
      themes: {
        auto: "Foo",
        dark: "Bar",
        light: "Baz",
      },
    } satisfies ComponentProps<typeof ThemeSelect>;

    const invalidProps = { ...props, current: "something" };

    await expect(async () =>
      container.renderToString(ThemeSelect, { props: invalidProps })
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `[Error: The provided value for "current" does not match any "themes" key. Received: something]`
    );
  });
});

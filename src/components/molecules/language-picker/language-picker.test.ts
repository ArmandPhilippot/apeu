import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { ComponentProps } from "astro/types";
import { beforeEach, describe, expect, it } from "vitest";
import LanguagePicker from "./language-picker.astro";

/* cSpell:ignore Français */

type LocalTestContext = {
  container: AstroContainer;
};

describe("LanguagePicker", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
  });

  const props = {
    current: "en",
    id: "test1",
    label: "non nulla blanditiis",
    languages: {
      en: { name: "English", route: "#en" },
      fr: { name: "Français", route: "#fr" },
    },
  } satisfies ComponentProps<typeof LanguagePicker>;

  it<LocalTestContext>("renders label and correct number of items", async ({
    container,
  }) => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(2);

    const result = await container.renderToString(LanguagePicker, { props });
    const linkItems = [...result.matchAll(/<li/g)];

    expect(result).toContain(props.label);
    expect(linkItems).toHaveLength(Object.keys(props.languages).length);
  });

  it<LocalTestContext>("renders expected language names and routes", async ({
    container,
  }) => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(4);

    const result = await container.renderToString(LanguagePicker, { props });

    expect(result).toContain(props.languages.en.name);
    expect(result).toContain(props.languages.en.route);
    expect(result).toContain(props.languages.fr.name);
    expect(result).toContain(props.languages.fr.route);
  });

  it<LocalTestContext>("throws an error if current does not match", async ({
    container,
  }) => {
    expect.assertions(1);

    const invalidProps = { ...props, current: "ru" };

    await expect(async () =>
      container.renderToString(LanguagePicker, {
        props: invalidProps,
      })
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `[Error: The value for \`current\` does not match any key in \`languages\`.]`
    );
  });
});

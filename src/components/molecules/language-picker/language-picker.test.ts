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

  it<LocalTestContext>("renders a dropdown", async ({ container }) => {
    const props = {
      current: "en",
      id: "test1",
      label: "non nulla blanditiis",
      languages: {
        en: { name: "English", route: "#en" },
        fr: { name: "Français", route: "#fr" },
      },
    } satisfies ComponentProps<typeof LanguagePicker>;
    const result = await container.renderToString(LanguagePicker, {
      props,
    });

    expect.assertions(6);

    const linkItems = [...result.matchAll(/<li/g)];

    expect(result).toContain(props.label);
    expect(result).toContain(props.languages.en.name);
    expect(result).toContain(props.languages.en.route);
    expect(result).toContain(props.languages.fr.name);
    expect(result).toContain(props.languages.fr.route);
    expect(linkItems).toHaveLength(Object.keys(props.languages).length);
  });

  it<LocalTestContext>("throws an error if current does not match", async ({
    container,
  }) => {
    const props = {
      current: "ru",
      id: "test1",
      label: "non nulla blanditiis",
      languages: {
        en: { name: "English", route: "#en" },
        fr: { name: "Français", route: "#fr" },
      },
    } satisfies ComponentProps<typeof LanguagePicker>;

    expect.assertions(1);

    await expect(async () =>
      container.renderToString(LanguagePicker, {
        props,
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `[Error: The value for \`current\` does not match any key in \`languages\`.]`,
    );
  });
});

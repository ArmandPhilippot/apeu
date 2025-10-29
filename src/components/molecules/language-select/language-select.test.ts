import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { ComponentProps } from "astro/types";
import { beforeEach, describe, expect, it } from "vitest";
import LanguageSelect from "./language-select.astro";

/* cSpell:ignore Français */

type LocalTestContext = {
  container: AstroContainer;
};

describe("LanguageSelect", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
  });

  it<LocalTestContext>("renders a label and the language routes", async ({
    container,
  }) => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(5);

    const props = {
      current: "en",
      label: "non nulla blanditiis",
      languages: {
        en: { label: "English", path: "#en" },
        fr: { label: "Français", path: "#fr" },
      },
    } satisfies ComponentProps<typeof LanguageSelect>;

    const result = await container.renderToString(LanguageSelect, { props });

    expect(result).toContain(props.label);
    expect(result).toContain(props.languages.en.label);
    expect(result).toContain(props.languages.en.path);
    expect(result).toContain(props.languages.fr.label);
    expect(result).toContain(props.languages.fr.path);
  });

  it<LocalTestContext>("throws an error if current is invalid", async ({
    container,
  }) => {
    expect.assertions(1);

    const props = {
      current: "ru",
      hideLabel: true,
      label: "Choose an option",
      languages: {
        en: { label: "English", path: "#en" },
        fr: { label: "Français", path: "#fr" },
      },
    } satisfies ComponentProps<typeof LanguageSelect>;

    const invalidProps = { ...props, current: "something" };

    await expect(async () =>
      container.renderToString(LanguageSelect, { props: invalidProps })
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `[Error: The provided value for "current" does not match any "languages" key. Received: something]`
    );
  });
});

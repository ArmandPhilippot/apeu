import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { ComponentProps } from "astro/types";
import { beforeEach, describe, expect, it, vi } from "vitest";
import SettingsForm from "./settings-form.astro";

vi.mock("../../../utils/constants", async (importOriginal) => {
  const mod = await importOriginal<typeof import("../../../utils/constants")>();
  return {
    ...mod,
    CONFIG: {
      ...mod.CONFIG,
      LANGUAGES: {
        DEFAULT: "en",
      },
    },
  };
});

vi.mock("../../../utils/i18n", async (importOriginal) => {
  const mod = await importOriginal<typeof import("../../../utils/i18n")>();

  return {
    ...mod,
    useI18n: vi.fn(() => {
      return {
        locale: "en",
        route: vi.fn(),
        translate: (key: string) => `translated_${key}`,
        translatePlural: (key: string, { count }: { count: number }) =>
          `translated_${key}_${count}`,
      };
    }),
  };
});

type LocalTestContext = {
  container: AstroContainer;
};

describe("SettingsForm", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
  });

  it<LocalTestContext>("renders a settings form", async ({ container }) => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(2);

    const props = {} satisfies ComponentProps<typeof SettingsForm>;
    const result = await container.renderToString(SettingsForm, {
      props,
    });

    expect(result).toContain("</form>");
    expect(result).toContain("translated_form.settings.label.theme.website");
  });

  it<LocalTestContext>("can use an id", async ({ container }) => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(2);

    const props = {
      id: "voluptates",
    } satisfies ComponentProps<typeof SettingsForm>;
    const result = await container.renderToString(SettingsForm, {
      props,
    });

    expect(result).toContain(`id="${props.id}"`);
    expect(result).toContain(`${props.id}-theme`);
  });

  it<LocalTestContext>("can use the given routes in the language picker", async ({
    container,
  }) => {
    expect.assertions(1);

    const props = {
      altLanguages: [{ locale: "fr", route: "#ma-route-fr" }] as const,
      id: "voluptates",
    } satisfies ComponentProps<typeof SettingsForm>;
    const result = await container.renderToString(SettingsForm, {
      props,
    });

    expect(result).toContain(props.altLanguages[0].route);
  });

  it<LocalTestContext>("does not use the given route for the current locale", async ({
    container,
  }) => {
    expect.assertions(1);

    const props = {
      altLanguages: [{ locale: "en", route: "#my-en-route" }] as const,
      id: "voluptates",
    } satisfies ComponentProps<typeof SettingsForm>;
    const result = await container.renderToString(SettingsForm, {
      props,
    });

    expect(result).not.toContain(props.altLanguages[0].route);
  });
});

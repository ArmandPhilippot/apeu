import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { ComponentProps } from "astro/types";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CONFIG } from "../../../utils/constants";
import { useI18n } from "../../../utils/i18n";
import SettingsForm from "./settings-form.astro";

vi.mock("../../../utils/constants", async (importOriginal) => {
  const mod =
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    await importOriginal<typeof import("../../../utils/constants")>();
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

type LocalTestContext = {
  container: AstroContainer;
};

describe("SettingsForm", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it<LocalTestContext>("renders a settings form", async ({ container }) => {
    const props = {} satisfies ComponentProps<typeof SettingsForm>;
    const result = await container.renderToString(SettingsForm, {
      props,
    });

    expect.assertions(2);

    expect(result).toContain("</form>");
    expect(result).toContain(
      useI18n(CONFIG.LANGUAGES.DEFAULT).translate(
        "form.settings.label.theme.website",
      ),
    );
  });

  it<LocalTestContext>("can use an id", async ({ container }) => {
    const props = {
      id: "voluptates",
    } satisfies ComponentProps<typeof SettingsForm>;
    const result = await container.renderToString(SettingsForm, {
      props,
    });

    expect.assertions(2);

    expect(result).toContain(`id="${props.id}"`);
    expect(result).toContain(`${props.id}-theme`);
  });
});

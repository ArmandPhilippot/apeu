import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { ComponentProps } from "astro/types";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CONFIG } from "../../../utils/constants";
import { useI18n } from "../../../utils/i18n";
import License from "./license.astro";

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

type LocalTestContext = {
  container: AstroContainer;
};

describe("License", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it<LocalTestContext>("renders an svg element and its title", async ({
    container,
  }) => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(2);

    const props = {} satisfies ComponentProps<typeof License>;
    const result = await container.renderToString(License, {
      props,
    });

    expect(result).toContain("</svg>");
    expect(result).toContain(
      useI18n(CONFIG.LANGUAGES.DEFAULT).translate("license.title")
    );
  });
});

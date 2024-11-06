import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { ComponentProps } from "astro/types";
import { beforeEach, describe, expect, it } from "vitest";
import { CONFIG } from "../../../utils/constants";
import { useI18n } from "../../../utils/i18n";
import ContactForm from "./contact-form.astro";

type LocalTestContext = {
  container: AstroContainer;
};

describe("ContactForm", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
  });

  it<LocalTestContext>("renders a contact form", async ({ container }) => {
    const { translate } = useI18n(CONFIG.LANGUAGES.DEFAULT);
    const props = {
      id: "odit",
    } satisfies ComponentProps<typeof ContactForm>;
    const result = await container.renderToString(ContactForm, {
      props,
    });

    expect.assertions(5);

    expect(result).toContain("</form>");
    expect(result).toContain(translate("form.contact.label.name"));
    expect(result).toContain(translate("form.contact.label.email"));
    expect(result).toContain(translate("form.contact.label.object"));
    expect(result).toContain(translate("form.contact.label.message"));
  });
});

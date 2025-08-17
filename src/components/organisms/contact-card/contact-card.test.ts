import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { ComponentProps } from "astro/types";
import { beforeEach, describe, expect, it } from "vitest";
import { useI18n } from "../../../services/i18n";
import { CONFIG } from "../../../utils/constants";
import ContactCard from "./contact-card.astro";

type LocalTestContext = {
  container: AstroContainer;
};

describe("ContactCard", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
  });

  it<LocalTestContext>("renders a contact button", async ({ container }) => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(2);

    const props = { contactPageRoute: "#contact" } satisfies ComponentProps<
      typeof ContactCard
    >;
    const result = await container.renderToString(ContactCard, {
      props,
    });
    const { translate } = useI18n(CONFIG.LANGUAGES.DEFAULT);

    expect(result).toContain(translate("cta.contact.me"));
    expect(result).toContain(`href="${props.contactPageRoute}"`);
  });

  it<LocalTestContext>("can render a list of social links", async ({
    container,
  }) => {
    expect.assertions(1);

    const props = {
      contactPageRoute: "#contact",
      socialMedia: {
        diaspora: "#diaspora",
        github: "#github",
        linkedin: "#linkedin",
        stackoverflow: "#stackoverflow",
      },
    } satisfies ComponentProps<typeof ContactCard>;
    const result = await container.renderToString(ContactCard, {
      props,
    });

    const listItems = [...result.matchAll(/<li.*?<\/li>/g)];

    expect(listItems).toHaveLength(Object.keys(props.socialMedia).length);
  });

  it<LocalTestContext>("can render a heading", async ({ container }) => {
    expect.assertions(1);

    const heading = "nobis in ullam";
    const props = { contactPageRoute: "#contact" } satisfies ComponentProps<
      typeof ContactCard
    >;
    const result = await container.renderToString(ContactCard, {
      props,
      slots: { heading },
    });

    expect(result).toContain(heading);
  });
});

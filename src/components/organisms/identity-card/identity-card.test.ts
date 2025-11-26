import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { ComponentProps } from "astro/types";
import { beforeEach, describe, expect, it } from "vitest";
import { useI18n } from "../../../services/i18n";
import { CONFIG } from "../../../utils/constants";
import { toLowerCase } from "../../../utils/strings";
import IdentityCard from "./identity-card.astro";

type LocalTestContext = {
  container: AstroContainer;
};

describe("IdentityCard", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
  });

  it<LocalTestContext>("renders a heading and the author name", async ({
    container,
  }) => {
    expect.assertions(1);

    const props = {
      author: {
        name: "John Doe",
      },
      heading: "Contact me",
    } satisfies ComponentProps<typeof IdentityCard>;
    const result = await container.renderToString(IdentityCard, {
      props,
    });

    expect(result).toContain(props.author.name);
  });

  it<LocalTestContext>("can render the pronunciation", async ({
    container,
  }) => {
    expect.assertions(1);

    const props = {
      author: {
        name: "John Doe",
        nameIPA: "voluptatem maxime cupiditate",
      },
      heading: "Contact me",
    } satisfies ComponentProps<typeof IdentityCard>;
    const result = await container.renderToString(IdentityCard, {
      props,
    });

    expect(result).toContain(props.author.nameIPA);
  });

  it<LocalTestContext>("can render its avatar", async ({ container }) => {
    expect.assertions(1);

    const props = {
      author: {
        name: "John Doe",
        avatar: {
          format: "jpg",
          height: 200,
          src: "https://picsum.photos/150/200",
          width: 150,
        },
      },
      heading: "Contact me",
    } satisfies ComponentProps<typeof IdentityCard>;
    const result = await container.renderToString(IdentityCard, {
      props,
    });

    expect(result).toContain(props.author.avatar.src);
  });

  it<LocalTestContext>("can render its country", async ({ container }) => {
    expect.assertions(1);

    const props = {
      author: {
        name: "John Doe",
        country: "FR",
      },
      heading: "Contact me",
    } satisfies ComponentProps<typeof IdentityCard>;
    const result = await container.renderToString(IdentityCard, {
      props,
    });

    expect(result).toContain(
      useI18n(CONFIG.LANGUAGES.DEFAULT).translate(
        `meta.value.country.name.${toLowerCase(props.author.country)}`
      )
    );
  });

  it<LocalTestContext>("can render its job", async ({ container }) => {
    expect.assertions(1);

    const props = {
      author: {
        name: "John Doe",
        job: "nam dignissimos et",
      },
      heading: "Contact me",
    } satisfies ComponentProps<typeof IdentityCard>;
    const result = await container.renderToString(IdentityCard, {
      props,
    });

    expect(result).toContain(props.author.job);
  });

  it<LocalTestContext>("can render its nationality", async ({ container }) => {
    expect.assertions(1);

    const props = {
      author: {
        name: "John Doe",
        nationality: "FR",
      },
      heading: "Contact me",
    } satisfies ComponentProps<typeof IdentityCard>;
    const result = await container.renderToString(IdentityCard, {
      props,
    });

    expect(result).toContain(
      useI18n(CONFIG.LANGUAGES.DEFAULT).translate(
        `meta.value.nationality.${toLowerCase(props.author.nationality)}`
      )
    );
  });

  it<LocalTestContext>("can render its spoken languages", async ({
    container,
  }) => {
    expect.assertions(1);

    const props = {
      author: {
        name: "John Doe",
        spokenLanguages: ["es"] as const,
      },
      heading: "Contact me",
    } satisfies ComponentProps<typeof IdentityCard>;
    const result = await container.renderToString(IdentityCard, {
      props,
    });

    expect(result).toContain(
      useI18n(CONFIG.LANGUAGES.DEFAULT).translate(
        `language.name.${props.author.spokenLanguages[0]}`
      )
    );
  });
});

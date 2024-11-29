import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { ComponentProps } from "astro/types";
import { beforeEach, describe, expect, it } from "vitest";
import { CONFIG } from "../../../utils/constants";
import { useI18n } from "../../../utils/i18n";
import { toLowerCase } from "../../../utils/strings";
import IdentityCard from "./identity-card.astro";

type LocalTestContext = {
  container: AstroContainer;
};

describe("IdentityCard", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
  });

  it<LocalTestContext>("renders the author name", async ({ container }) => {
    const props = {
      author: {
        name: "John Doe",
      },
    } satisfies ComponentProps<typeof IdentityCard>;
    const result = await container.renderToString(IdentityCard, {
      props,
    });

    expect.assertions(1);

    expect(result).toContain(props.author.name);
  });

  it<LocalTestContext>("can render the pronunciation", async ({
    container,
  }) => {
    const props = {
      author: {
        name: "John Doe",
        nameIPA: "voluptatem maxime cupiditate",
      },
    } satisfies ComponentProps<typeof IdentityCard>;
    const result = await container.renderToString(IdentityCard, {
      props,
    });

    expect.assertions(1);

    expect(result).toContain(props.author.nameIPA);
  });

  it<LocalTestContext>("can render its avatar", async ({ container }) => {
    const props = {
      author: {
        name: "John Doe",
        avatar: {
          height: 200,
          src: "https://picsum.photos/150/200",
          width: 150,
        },
      },
    } satisfies ComponentProps<typeof IdentityCard>;
    const result = await container.renderToString(IdentityCard, {
      props,
    });

    expect.assertions(1);

    expect(result).toContain(props.author.avatar.src);
  });

  it<LocalTestContext>("can render its country", async ({ container }) => {
    const props = {
      author: {
        name: "John Doe",
        country: "FR",
      },
    } satisfies ComponentProps<typeof IdentityCard>;
    const result = await container.renderToString(IdentityCard, {
      props,
    });

    expect.assertions(1);

    expect(result).toContain(
      useI18n(CONFIG.LANGUAGES.DEFAULT).translate(
        `meta.value.country.name.${toLowerCase(props.author.country)}`,
      ),
    );
  });

  it<LocalTestContext>("can render its job", async ({ container }) => {
    const props = {
      author: {
        name: "John Doe",
        job: "nam dignissimos et",
      },
    } satisfies ComponentProps<typeof IdentityCard>;
    const result = await container.renderToString(IdentityCard, {
      props,
    });

    expect.assertions(1);

    expect(result).toContain(props.author.job);
  });

  it<LocalTestContext>("can render its nationality", async ({ container }) => {
    const props = {
      author: {
        name: "John Doe",
        nationality: "FR",
      },
    } satisfies ComponentProps<typeof IdentityCard>;
    const result = await container.renderToString(IdentityCard, {
      props,
    });

    expect.assertions(1);

    expect(result).toContain(
      useI18n(CONFIG.LANGUAGES.DEFAULT).translate(
        `meta.value.nationality.${toLowerCase(props.author.nationality)}`,
      ),
    );
  });

  it<LocalTestContext>("can render its spoken languages", async ({
    container,
  }) => {
    const props = {
      author: {
        name: "John Doe",
        spokenLanguages: ["es"] as const,
      },
    } satisfies ComponentProps<typeof IdentityCard>;
    const result = await container.renderToString(IdentityCard, {
      props,
    });

    expect.assertions(1);

    expect(result).toContain(
      useI18n(CONFIG.LANGUAGES.DEFAULT).translate(
        `language.name.${props.author.spokenLanguages[0]}`,
      ),
    );
  });

  it<LocalTestContext>("can render a heading", async ({ container }) => {
    const heading = "dicta hic rerum";
    const props = {
      author: {
        name: "John Doe",
      },
    } satisfies ComponentProps<typeof IdentityCard>;
    const result = await container.renderToString(IdentityCard, {
      props,
      slots: { heading },
    });

    expect.assertions(1);

    expect(result).toContain(heading);
  });
});

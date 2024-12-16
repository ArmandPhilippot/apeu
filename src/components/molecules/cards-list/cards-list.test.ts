import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { ComponentProps } from "astro/types";
import { beforeEach, describe, expect, it } from "vitest";
import CardsList from "./cards-list.astro";

type LocalTestContext = {
  container: AstroContainer;
};

describe("CardsList", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
  });

  it<LocalTestContext>("renders a list of items", async ({ container }) => {
    const props = {
      items: [
        {
          body: "Inventore ex magnam sequi illo qui expedita reprehenderit. Sint optio magni accusamus. Omnis voluptas provident. Aut esse at enim qui molestias dolorem nihil.",
          heading: "illum similique ut",
          url: "#fuga-sunt-dicta",
        },
        {
          body: "Nihil ad est doloribus. Aspernatur et est sit assumenda alias deleniti quia labore aut. Eaque itaque eius et error deserunt. Eos qui qui autem ut amet libero sit magni maxime. Illum laudantium repudiandae id et. Ut nostrum deleniti expedita velit.",
          heading: "cumque id voluptatibus",
          url: "#ex-corrupti-illum",
        },
      ],
    } satisfies ComponentProps<typeof CardsList>;
    const result = await container.renderToString(CardsList, {
      props,
      slots: { default: (item: (typeof props.items)[number]) => item.body },
    });

    expect.assertions(1);

    const listItems = [...result.matchAll(/<li(?:.*?)<\/li>/g)];

    expect(listItems).toHaveLength(props.items.length);
  });

  it<LocalTestContext>("can render a list of items defined as container", async ({
    container,
  }) => {
    const props = {
      isContainer: true,
      items: [
        {
          body: "Inventore ex magnam sequi illo qui expedita reprehenderit. Sint optio magni accusamus. Omnis voluptas provident. Aut esse at enim qui molestias dolorem nihil.",
          heading: "illum similique ut",
          url: "#fuga-sunt-dicta",
        },
        {
          body: "Nihil ad est doloribus. Aspernatur et est sit assumenda alias deleniti quia labore aut. Eaque itaque eius et error deserunt. Eos qui qui autem ut amet libero sit magni maxime. Illum laudantium repudiandae id et. Ut nostrum deleniti expedita velit.",
          heading: "cumque id voluptatibus",
          url: "#ex-corrupti-illum",
        },
      ],
    } satisfies ComponentProps<typeof CardsList>;
    const result = await container.renderToString(CardsList, {
      props,
      slots: { default: (item: (typeof props.items)[number]) => item.body },
    });

    expect.assertions(1);

    expect(result).toContain("container");
  });

  it<LocalTestContext>("throws an error when the default slot is missing", async ({
    container,
  }) => {
    const props = {
      items: [
        {
          body: "Inventore ex magnam sequi illo qui expedita reprehenderit. Sint optio magni accusamus. Omnis voluptas provident. Aut esse at enim qui molestias dolorem nihil.",
          heading: "illum similique ut",
          url: "#fuga-sunt-dicta",
        },
        {
          body: "Nihil ad est doloribus. Aspernatur et est sit assumenda alias deleniti quia labore aut. Eaque itaque eius et error deserunt. Eos qui qui autem ut amet libero sit magni maxime. Illum laudantium repudiandae id et. Ut nostrum deleniti expedita velit.",
          heading: "cumque id voluptatibus",
          url: "#ex-corrupti-illum",
        },
      ],
    } satisfies ComponentProps<typeof CardsList>;

    expect.assertions(1);

    await expect(async () =>
      container.renderToString(CardsList, {
        props,
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `[Error: CardsList requires a function that describes how to render a single item as child.]`,
    );
  });
});

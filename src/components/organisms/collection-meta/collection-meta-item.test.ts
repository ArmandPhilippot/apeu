import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { ComponentProps } from "astro/types";
import { beforeEach, describe, expect, it } from "vitest";
import CollectionMetaItem from "./collection-meta-item.astro";

type LocalTestContext = {
  container: AstroContainer;
};

describe("CollectionMetaItem", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
  });

  it<LocalTestContext>("renders a label and its body", async ({
    container,
  }) => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(2);

    const props = {
      label: "Any label",
    } satisfies ComponentProps<typeof CollectionMetaItem>;
    const body = "ducimus aspernatur eligendi";
    const result = await container.renderToString(CollectionMetaItem, {
      props,
      slots: { default: body },
    });

    expect(result).toContain(props.label);
    expect(result).toContain(body);
  });

  it<LocalTestContext>("hides labels when hideLabel is true", async ({
    container,
  }) => {
    expect.assertions(1);

    const props = {
      hideLabel: true,
      label: "Any label",
    } satisfies ComponentProps<typeof CollectionMetaItem>;
    const result = await container.renderToString(CollectionMetaItem, {
      props,
    });

    expect(result).toContain('class="sr-only"');
  });
});

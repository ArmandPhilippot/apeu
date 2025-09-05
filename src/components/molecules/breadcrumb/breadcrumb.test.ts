import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { ComponentProps } from "astro/types";
import { beforeEach, describe, expect, it } from "vitest";
import Breadcrumb from "./breadcrumb.astro";

type LocalTestContext = {
  container: AstroContainer;
};

describe("Breadcrumb", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
  });

  it<LocalTestContext>("renders a list of breadcrumb items", async ({
    container,
  }) => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(5);

    const props = {
      items: [
        { label: "omnis assumenda aut", path: "#voluptate-est-sed" },
        { label: "voluptas odio voluptatem", path: "#est-ducimus-sit" },
        { label: "sunt ratione quis", path: "#sunt-illo-iusto" },
      ],
    } satisfies ComponentProps<typeof Breadcrumb>;
    const result = await container.renderToString(Breadcrumb, {
      props,
    });

    const listItems = [...result.matchAll(/<li[^>]*>[\S\s]*?<\/li>/g)];

    expect(listItems).toHaveLength(props.items.length);
    expect(result).toContain(props.items[0]?.path);
    expect(result).toContain(props.items[1]?.path);
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- `path` index. */
    expect(result).toContain(props.items[2]?.label);
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- `path` index. */
    expect(result).not.toContain(props.items[2]?.path);
  });

  it<LocalTestContext>("can render the items centered", async ({
    container,
  }) => {
    expect.assertions(1);

    const props = {
      isCentered: true,
      items: [
        { label: "omnis assumenda aut", path: "#voluptate-est-sed" },
        { label: "voluptas odio voluptatem", path: "#est-ducimus-sit" },
        { label: "sunt ratione quis", path: "#sunt-illo-iusto" },
      ],
    } satisfies ComponentProps<typeof Breadcrumb>;
    const result = await container.renderToString(Breadcrumb, {
      props,
    });

    expect(result).toContain('data-centered="true"');
  });
});

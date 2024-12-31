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
    const props = {
      items: [
        { label: "omnis assumenda aut", url: "#voluptate-est-sed" },
        { label: "voluptas odio voluptatem", url: "#est-ducimus-sit" },
        { label: "sunt ratione quis", url: "#sunt-illo-iusto" },
      ],
    } satisfies ComponentProps<typeof Breadcrumb>;
    const result = await container.renderToString(Breadcrumb, {
      props,
    });

    expect.assertions(6);

    const listItems = [...result.matchAll(/<li(?:.*?)<\/li>/g)];

    expect(result).toContain("</ol>");
    expect(listItems).toHaveLength(props.items.length);
    expect(result).toContain(props.items[0]?.url);
    expect(result).toContain(props.items[1]?.url);
    expect(result).toContain(props.items[2]?.label);
    expect(result).not.toContain(props.items[2]?.url);
  });

  it<LocalTestContext>("can render the items centered", async ({
    container,
  }) => {
    const props = {
      isCentered: true,
      items: [
        { label: "omnis assumenda aut", url: "#voluptate-est-sed" },
        { label: "voluptas odio voluptatem", url: "#est-ducimus-sit" },
        { label: "sunt ratione quis", url: "#sunt-illo-iusto" },
      ],
    } satisfies ComponentProps<typeof Breadcrumb>;
    const result = await container.renderToString(Breadcrumb, {
      props,
    });

    expect.assertions(1);

    expect(result).toContain('data-centered="true"');
  });
});

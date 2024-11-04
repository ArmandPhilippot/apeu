import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { ComponentProps } from "astro/types";
import { beforeEach, describe, expect, it } from "vitest";
import SearchForm from "./search-form.astro";

type LocalTestContext = {
  container: AstroContainer;
};

describe("SearchForm", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
  });

  it<LocalTestContext>("renders a search form", async ({ container }) => {
    const props = {
      id: "aliquid",
      queryParam: "quasi",
      resultsPage: "/qui-animi-impedit",
    } satisfies ComponentProps<typeof SearchForm>;
    const result = await container.renderToString(SearchForm, {
      props,
    });

    expect.assertions(3);

    expect(result).toContain("</form>");
    expect(result).toContain(`id="${props.id}"`);
    expect(result).toContain(`type="search"`);
  });

  it<LocalTestContext>("can be inlined", async ({ container }) => {
    const props = {
      id: "aliquid",
      isInline: true,
      queryParam: "quasi",
      resultsPage: "/qui-animi-impedit",
    } satisfies ComponentProps<typeof SearchForm>;
    const result = await container.renderToString(SearchForm, {
      props,
    });

    expect.assertions(1);

    expect(result).toContain("inlined");
  });

  it<LocalTestContext>("throws an error if the results page is invalid", async ({
    container,
  }) => {
    const props = {
      id: "aliquid",
      queryParam: "quasi",
      resultsPage: "#qui-animi-impedit",
    } satisfies ComponentProps<typeof SearchForm>;

    expect.assertions(1);

    await expect(async () =>
      container.renderToString(SearchForm, {
        props,
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `[Error: \`resultsPage\` must be a valid route starting with \`/\`.]`,
    );
  });
});

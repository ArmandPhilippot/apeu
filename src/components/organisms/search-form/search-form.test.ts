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
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(3);

    const props = {
      id: "aliquid",
      queryParam: "quasi",
      resultsPage: "/qui-animi-impedit",
    } satisfies ComponentProps<typeof SearchForm>;
    const result = await container.renderToString(SearchForm, {
      props,
    });

    expect(result).toContain("</form>");
    expect(result).toContain(`id="${props.id}"`);
    expect(result).toContain(`type="search"`);
  });

  it<LocalTestContext>("can be inlined", async ({ container }) => {
    expect.assertions(1);

    const props = {
      id: "aliquid",
      isInline: true,
      queryParam: "quasi",
      resultsPage: "/qui-animi-impedit",
    } satisfies ComponentProps<typeof SearchForm>;
    const result = await container.renderToString(SearchForm, {
      props,
    });

    expect(result).toContain("inlined");
  });

  it<LocalTestContext>("throws an error if the results page is invalid", async ({
    container,
  }) => {
    expect.assertions(1);

    const props = {
      id: "aliquid",
      queryParam: "quasi",
      resultsPage: "#qui-animi-impedit",
    } satisfies ComponentProps<typeof SearchForm>;

    await expect(async () =>
      container.renderToString(SearchForm, {
        props,
      })
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `[Error: \`resultsPage\` must be a valid route starting with \`/\`.]`
    );
  });
});

import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { beforeEach, describe, expect, it } from "vitest";
import TableOfContents from "./table-of-contents.astro";

type LocalTestContext = {
  container: AstroContainer;
};

describe("TableOfContents", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
  });

  it<LocalTestContext>("renders the a list of anchor links", async ({
    container,
  }) => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(2);

    const headings = [
      { label: "qui velit ratione", slug: "#rerum-velit-dolorem" },
      { label: "dolorem sit omnis", slug: "#quam-fuga-voluptas" },
      { label: "inventore qui suscipit", slug: "#culpa-asperiores-atque" },
    ];
    const result = await container.renderToString(TableOfContents, {
      props: { headings },
    });

    const listItems = [...result.matchAll(/<li/g)];

    expect(result).toContain("<ol");
    expect(listItems).toHaveLength(headings.length);
  });

  it<LocalTestContext>("can render a nested list of anchor links", async ({
    container,
  }) => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(2);

    const headings = [
      { label: "dolorum nihil nobis", slug: "#dignissimos-ipsa-ex" },
      {
        label: "quam eum corrupti",
        slug: "#et-blanditiis-ducimus",
        children: [
          {
            label: "nam explicabo facere",
            slug: "#voluptates-minus-molestiae",
          },
          { label: "minus non aut", slug: "#doloremque-cum-neque" },
        ],
      },
      {
        label: "cupiditate atque reprehenderit",
        slug: "#eum-vero-consequatur",
        children: [
          {
            label: "similique soluta adipisci",
            slug: "#aperiam-autem-aut",
            children: [
              { label: "doloribus molestiae eos", slug: "#molestias-sint-et" },
              { label: "aut illo quibusdam", slug: "#a-cum-eum" },
            ],
          },
          { label: "labore labore qui", slug: "#quaerat-et-amet" },
        ],
      },
      { label: "laudantium quia recusandae", slug: "#iste-accusamus-quod" },
    ];
    const result = await container.renderToString(TableOfContents, {
      props: { headings },
    });
    const flattenHeadings = (
      nestedHeadings: typeof headings
    ): typeof headings =>
      nestedHeadings.flatMap((heading) => {
        if (heading.children !== undefined) {
          return [heading, ...flattenHeadings(heading.children)];
        }

        return heading;
      });

    const listItems = [...result.matchAll(/<li/g)];

    expect(result).toContain("<ol");
    expect(listItems).toHaveLength(flattenHeadings(headings).length);
  });
});

import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { ComponentProps } from "astro/types";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Pagination from "./pagination.astro";

type LocalTestContext = {
  container: AstroContainer;
};

describe("Pagination", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
  });

  it<LocalTestContext>("renders the pagination", async ({ container }) => {
    const props = {
      current: 1,
      last: 10,
      renderLink: vi.fn().mockImplementation((page: number) => page),
    } satisfies ComponentProps<typeof Pagination>;
    const result = await container.renderToString(Pagination, {
      props,
    });

    expect.assertions(3);

    const listItems = [...result.matchAll(/<li(?:.*?)<\/li>/g)];
    /**
     * current page + 1 page on the right + ellipsis + last page + next page
     * link
     */
    const totalItems = 5;

    expect(result).toContain("<nav");
    expect(listItems).toHaveLength(totalItems);
    // Items without the ellipsis and the current page
    expect(props.renderLink).toHaveBeenCalledTimes(totalItems - 2);
  });

  it<LocalTestContext>("can show a previous page link", async ({
    container,
  }) => {
    const props = {
      current: 10,
      last: 10,
      renderLink: vi.fn().mockImplementation((page: number) => page),
    } satisfies ComponentProps<typeof Pagination>;
    const result = await container.renderToString(Pagination, {
      props,
    });

    expect.assertions(2);

    const listItems = [...result.matchAll(/<li(?:.*?)<\/li>/g)];
    /**
     * current page + 1 page on the left + ellipsis + first page + previous
     * page link
     */
    const totalItems = 5;

    expect(listItems).toHaveLength(totalItems);
    // Items without the ellipsis and the current page
    expect(props.renderLink).toHaveBeenCalledTimes(totalItems - 2);
  });

  it<LocalTestContext>("can show two ellipsis and both next/previous page links", async ({
    container,
  }) => {
    const props = {
      current: 10,
      last: 20,
      renderLink: vi.fn().mockImplementation((page: number) => page),
    } satisfies ComponentProps<typeof Pagination>;
    const result = await container.renderToString(Pagination, {
      props,
    });

    expect.assertions(2);

    const listItems = [...result.matchAll(/<li(?:.*?)<\/li>/g)];
    /**
     * current page + 1 page on each side + 2 ellipsis + first page + last page
     * + previous page link + next page link
     */
    const totalItems = 9;

    expect(listItems).toHaveLength(totalItems);
    // Items without the 2 ellipsis and the current page
    expect(props.renderLink).toHaveBeenCalledTimes(totalItems - 3);
  });

  it<LocalTestContext>("can show a custom number of siblings", async ({
    container,
  }) => {
    const props = {
      current: 10,
      last: 20,
      renderLink: vi.fn().mockImplementation((page: number) => page),
      siblings: 3,
    } satisfies ComponentProps<typeof Pagination>;
    const result = await container.renderToString(Pagination, {
      props,
    });

    expect.assertions(2);

    const listItems = [...result.matchAll(/<li(?:.*?)<\/li>/g)];
    /**
     * current page + 3 pages on each side + 2 ellipsis + first page + last page
     * + previous page link + next page link
     */
    const totalItems = 13;

    expect(listItems).toHaveLength(totalItems);
    // Items without the 2 ellipsis and the current page
    expect(props.renderLink).toHaveBeenCalledTimes(totalItems - 3);
  });
});

import { describe, expect, it } from "vitest";
import { getPagination, renderPaginationLink } from "./pagination";

/* eslint-disable @typescript-eslint/no-magic-numbers -- We are testing page numbers so we need "magic" numbers here. */
describe("get-pagination", () => {
  it("should return pages around the current page with the first and last pages included", () => {
    const config = { currentPage: 5, totalPages: 10, siblings: 2 };
    const result = getPagination(config);

    expect(result).toStrictEqual([1, 2, 3, 4, 5, 6, 7, 10]);
  });

  it("should include the last page even if current page is near the beginning", () => {
    const config = { currentPage: 2, totalPages: 10, siblings: 2 };
    const result = getPagination(config);

    expect(result).toStrictEqual([1, 2, 3, 4, 10]);
  });

  it("should include the first page even if current page is near the end", () => {
    const config = { currentPage: 9, totalPages: 10, siblings: 2 };
    const result = getPagination(config);

    expect(result).toStrictEqual([1, 7, 8, 9, 10]);
  });

  it("should return all the pages when totalPages is small", () => {
    const config = { currentPage: 1, totalPages: 3, siblings: 2 };
    const result = getPagination(config);

    expect(result).toStrictEqual([1, 2, 3]);
  });

  it("should return all the pages when the gap is equal to 1", () => {
    const config = { currentPage: 2, totalPages: 5, siblings: 1 };
    const result = getPagination(config);

    expect(result).toStrictEqual([1, 2, 3, 4, 5]);
  });

  it("should handle the case where there are no pages between start and end", () => {
    const config = { currentPage: 1, totalPages: 2, siblings: 0 };
    const result = getPagination(config);

    expect(result).toStrictEqual([1, 2]);
  });

  it("should return only the first page if totalPages is equal to 1", () => {
    const config = { currentPage: 1, totalPages: 1, siblings: 2 };
    const result = getPagination(config);

    expect(result).toStrictEqual([1]);
  });
});

describe("render-pagination-link", () => {
  it("should return the given route for the first page", () => {
    const basePath = "/base-path";

    expect(renderPaginationLink(basePath)(1)).toBe(basePath);
  });

  it("should return the given route suffixed with the page number of other pages", () => {
    const basePath = "/base-path";

    expect(renderPaginationLink(basePath)(10)).toBe(`${basePath}/page/10`);
  });
});
/* eslint-enable @typescript-eslint/no-magic-numbers */

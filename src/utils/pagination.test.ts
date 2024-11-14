import { describe, expect, it } from "vitest";
import { getPagination } from "./pagination";

describe("get-pagination", () => {
  it("should return pages around the current page with the first and last pages included", () => {
    const config = { currentPage: 5, totalPages: 10, siblings: 2 };
    const result = getPagination(config);
    expect(result).toEqual([1, 2, 3, 4, 5, 6, 7, 10]);
  });

  it("should include the last page even if current page is near the beginning", () => {
    const config = { currentPage: 2, totalPages: 10, siblings: 2 };
    const result = getPagination(config);
    expect(result).toEqual([1, 2, 3, 4, 10]);
  });

  it("should include the first page even if current page is near the end", () => {
    const config = { currentPage: 9, totalPages: 10, siblings: 2 };
    const result = getPagination(config);
    expect(result).toEqual([1, 7, 8, 9, 10]);
  });

  it("should return all the pages when totalPages is small", () => {
    const config = { currentPage: 1, totalPages: 3, siblings: 2 };
    const result = getPagination(config);
    expect(result).toEqual([1, 2, 3]);
  });

  it("should return all the pages when the gap is equal to 1", () => {
    const config = { currentPage: 2, totalPages: 5, siblings: 1 };
    const result = getPagination(config);
    expect(result).toEqual([1, 2, 3, 4, 5]);
  });

  it("should handle the case where there are no pages between start and end", () => {
    const config = { currentPage: 1, totalPages: 2, siblings: 0 };
    const result = getPagination(config);
    expect(result).toEqual([1, 2]);
  });

  it("should return only the first page if totalPages is equal to 1", () => {
    const config = { currentPage: 1, totalPages: 1, siblings: 2 };
    const result = getPagination(config);
    expect(result).toEqual([1]);
  });
});

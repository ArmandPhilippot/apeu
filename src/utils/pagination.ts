const range = (start: number, end: number) => {
  return Array.from({ length: end - start + 1 }, (_, i) => i + start);
};

type PaginationConfig = {
  currentPage: number;
  siblings: number;
  totalPages: number;
};

type PageRange = {
  startPage: number;
  endPage: number;
  totalPages: number;
};

const calculatePageRange = ({
  currentPage,
  siblings,
  totalPages,
}: PaginationConfig): PageRange => ({
  startPage: Math.max(1, currentPage - siblings),
  endPage: Math.min(totalPages, currentPage + siblings),
  totalPages,
});

const hasSinglePageGap = (start: number, end: number): boolean =>
  end - start === 2;

const getStartingPages = (startPage: number): number[] => {
  if (startPage <= 1) return [];
  if (hasSinglePageGap(1, startPage)) return [1, 2];
  return [1];
};

const getCenterPages = ({
  startPage,
  endPage,
}: Omit<PageRange, "totalPages">): number[] => range(startPage, endPage);

const getEndingPages = ({
  endPage,
  totalPages,
}: Omit<PageRange, "startPage">): number[] => {
  if (endPage >= totalPages) return [];
  if (hasSinglePageGap(endPage, totalPages))
    return [totalPages - 1, totalPages];
  return [totalPages];
};

/**
 * Retrieve a pages list with gaps from the given configuration.
 *
 * @param {PaginationConfig} config - A configuration object.
 * @returns {number[]} The pages list.
 */
export const getPagination = (config: PaginationConfig): number[] => {
  const { endPage, startPage, totalPages } = calculatePageRange(config);

  return [
    ...getStartingPages(startPage),
    ...getCenterPages({ endPage, startPage }),
    ...getEndingPages({ endPage, totalPages }),
  ];
};

export const renderPaginationLink = (route: string) => (pageNumber: number) => {
  if (pageNumber === 1) return route;
  return `${route}/page/${pageNumber}`;
};

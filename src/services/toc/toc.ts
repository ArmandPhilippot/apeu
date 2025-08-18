import type { MarkdownHeading } from "astro";
import type { HeadingNode } from "../../types/data";
import { HEADING_TAGS } from "../../utils/constants";

type HeadingNodeWithParentIndex = HeadingNode & {
  parentIndex: number;
};

/**
 * Convert a list of markdown headings to an array of indexed headings.
 *
 * @param {MarkdownHeading[]} headings - The headings list.
 * @returns {HeadingNodeWithParentIndex[]} The indexed headings.
 */
const addParentIndexToHeadings = (
  headings: MarkdownHeading[]
): HeadingNodeWithParentIndex[] => {
  const depthLastIndexes = Array.from(
    { length: HEADING_TAGS.length },
    () => -1
  );

  return [...headings].map((heading, index): HeadingNodeWithParentIndex => {
    const depth = (HEADING_TAGS as readonly string[]).indexOf(
      `h${heading.depth}`
    );
    const parentDepthIndexes = depthLastIndexes.slice(0, depth);

    depthLastIndexes[depth] = index;

    return {
      children: [],
      slug: `#${heading.slug}`,
      label: heading.text,
      parentIndex: Math.max(...parentDepthIndexes),
    };
  });
};

/**
 * Build a table of contents from markdown headings.
 *
 * @param {MarkdownHeading[]} headings - The headings to use in the ToC.
 * @returns {HeadingNode[]} The table of contents.
 */
export const buildToc = (headings: MarkdownHeading[]): HeadingNode[] => {
  const headingsTree = addParentIndexToHeadings(headings);
  const toc: HeadingNode[] = [];

  for (const heading of headingsTree) {
    const { parentIndex, ...node } = heading;
    const parentHeading = headingsTree[parentIndex];

    if (parentIndex >= 0 && parentHeading !== undefined) {
      parentHeading.children?.push(node);
    } else {
      toc.push(node);
    }
  }

  return toc;
};

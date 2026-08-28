/**
 * Flattens the entries and sorts them to ensure parent (index) pages
 * appear before their child pages — based on the `id` order.
 *
 * @template T - The entries type.
 * @param {T[][]} nested - A nested array.
 * @returns {T[]} A flatten and sorted array.
 */
export const flattenAndSortByHierarchy = <T extends { id: string }>(
  nested: T[][]
): T[] =>
  nested.flat().toSorted((a, b) => {
    const aDepth = a.id.split("/").length;
    const bDepth = b.id.split("/").length;

    // First sort by depth (parents before children)
    if (aDepth !== bDepth) {
      return aDepth - bDepth;
    }

    // Then sort alphabetically for consistent ordering
    return a.id.localeCompare(b.id);
  });

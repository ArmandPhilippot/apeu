type Predicate<T, S extends T> = (item: T) => item is S;

/**
 * Partition the given items by type using a predicate function.
 *
 * @template T - The items type.
 * @template S - A subset of T.
 * @param {T[]} items - The items to partitions.
 * @param {Predicate<T, S>} matchPredicate - A function to determine the partitioning.
 * @returns {[S[], Exclude<T, S>[]]} The partitions.
 */
export const partitionByType = <T, S extends T>(
  items: T[],
  matchPredicate: Predicate<T, S>
): [S[], Exclude<T, S>[]] => {
  const matches: S[] = [];
  const noMatches: Exclude<T, S>[] = [];

  for (const item of items) {
    if (matchPredicate(item)) matches.push(item);
    else noMatches.push(item as Exclude<T, S>);
  }

  return [matches, noMatches];
};

/**
 * Ensures the given item is an array.
 *
 * @template T - The item type.
 * @param {T | T[]} item - The item to ensure as an array.
 * @returns {T[]} The item as an array.
 */
export const ensureArray = <T extends string>(item: T | T[]): T[] =>
  typeof item === "string" ? [item] : item;

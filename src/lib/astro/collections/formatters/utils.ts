import { getEntries, getEntry, type CollectionKey } from "astro:content";
import type { CollectionReference } from "../../../../types/utilities";
import { getTaxonomyLink } from "./taxonomies";

export const resolveReferences = async <C extends CollectionKey>(
  references: CollectionReference<C>[] | undefined,
) => {
  if (!references?.length) return null;

  const entries = await getEntries(references);

  /* The type returned from `getEntries` is wrong: when the id does not match
   * an entry, it returns an array with `undefined` as child. */
  return entries.filter((entry) => entry !== undefined);
};

export const getCategoryFromReference = async (
  reference: CollectionReference<"blogCategories"> | undefined,
) => {
  const category = reference ? await getEntry(reference) : null;

  return category ? getTaxonomyLink(category) : null;
};

export const getTagsFromReferences = async (
  references: CollectionReference<"tags">[] | undefined,
) => {
  const resolvedTags = await resolveReferences(references);

  return resolvedTags ? resolvedTags.map(getTaxonomyLink) : null;
};

import type { CollectionEntry } from "astro:content";
import type { Author, AuthorLink, AuthorPreview } from "../../../../types/data";
import type { IndexedEntry } from "../../../../types/routing";

/**
 * Retrieve the data necessary to display an author link from a
 * collection entry.
 *
 * @param {CollectionEntry<"authors">} author - The author data.
 * @returns {AuthorLink} An object describing an author link.
 */
export const getAuthorLink = ({
  data: { isWebsiteOwner, name, website },
}: CollectionEntry<"authors">): AuthorLink => {
  return {
    isWebsiteOwner,
    name,
    website,
  };
};

/**
 * Retrieve the data necessary to display an author preview from a
 * collection entry.
 *
 * @param {IndexedEntry<"authors">} author - The author data.
 * @returns {AuthorPreview} An object describing an author preview.
 */
export const getAuthorPreview = ({
  raw,
}: IndexedEntry<"authors">): AuthorPreview => {
  const {
    email,
    firstName,
    firstNameIPA,
    lastName,
    lastNameIPA,
    ...remainingData
  } = raw.data;

  return {
    ...remainingData,
    collection: raw.collection,
    id: raw.id,
  };
};

/**
 * Convert an author collection entry to a formatted Author object.
 *
 * @param {IndexedEntry<"authors">} author - The author data.
 * @returns {Author} An object describing an author.
 */
export const getAuthor = (author: IndexedEntry<"authors">): Author => {
  return {
    ...author.raw.data,
    collection: author.raw.collection,
    id: author.raw.id,
  };
};

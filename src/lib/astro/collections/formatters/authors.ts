import type { CollectionEntry } from "astro:content";
import type { Author, AuthorLink, AuthorPreview } from "../../../../types/data";

/**
 * Retrieve the data necessary to display an author link from a collection
 * entry.
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
 * Retrieve the data necessary to display an author preview from a collection
 * entry.
 *
 * @param {CollectionEntry<"authors">} author - The author data.
 * @returns {AuthorPreview} An object describing an author preview.
 */
export const getAuthorPreview = ({
  collection,
  data,
  id,
}: CollectionEntry<"authors">): AuthorPreview => {
  const {
    email,
    firstName,
    firstNameIPA,
    lastName,
    lastNameIPA,
    ...remainingData
  } = data;

  return {
    ...remainingData,
    collection,
    id,
  };
};

/**
 * Convert an author collection entry to a formatted Author object.
 *
 * @param {CollectionEntry<"authors">} author - The author data.
 * @returns {Author} An object describing an author.
 */
export const getAuthor = ({
  collection,
  data,
  id,
}: CollectionEntry<"authors">): Author => {
  return {
    ...data,
    collection,
    id,
  };
};

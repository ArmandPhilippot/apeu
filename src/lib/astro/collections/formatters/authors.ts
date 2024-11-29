import type { CollectionEntry } from "astro:content";
import type { Author, AuthorLink, AuthorPreview } from "../../../../types/data";

export const getAuthorLink = ({
  data: { isWebsiteOwner, name, website },
}: CollectionEntry<"authors">): AuthorLink => {
  return {
    isWebsiteOwner,
    name,
    website,
  };
};

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

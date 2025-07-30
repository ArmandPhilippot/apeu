import {
  render,
  type CollectionEntry,
  type ReferenceDataEntry,
} from "astro:content";
import type { RoutableCollectionKey } from "../../../../types/routing";
import type {
  AuthorLink,
  FormattedEntry,
  Img,
  QueryMode,
} from "../../../../types/data";
import { getMetaFromRemarkPluginFrontmatter } from "../../../../utils/frontmatter";
import type { Blend } from "../../../../types/utilities";
import {
  getCategoryFromReference,
  getTagsFromReferences,
  resolveReferences,
  resolveTranslations,
} from "./utils";
import { getAuthorLink } from "./authors";

function processCover(
  cover: Blend<CollectionEntry<RoutableCollectionKey>["data"]>["cover"]
): Img | null {
  return cover === undefined
    ? null
    : {
        ...(cover.position ? { position: cover.position } : {}),
        src: cover.src,
      };
}

async function resolveAndMapAuthors(
  authors: ReferenceDataEntry<"authors">[]
): Promise<AuthorLink[]> {
  const resolved = await resolveReferences(authors);
  return resolved?.map(getAuthorLink) ?? [];
}

export type FormatEntryReturnMap<F extends QueryMode> = {
  "blog.categories": FormattedEntry<"blog.categories", F>;
  "blog.posts": FormattedEntry<"blog.posts", F>;
  guides: FormattedEntry<"guides", F>;
  "index.pages": FormattedEntry<"index.pages", F>;
  notes: FormattedEntry<"notes", F>;
  pages: FormattedEntry<"pages", F>;
  projects: FormattedEntry<"projects", F>;
  tags: FormattedEntry<"tags", F>;
};

/**
 * Transform a collection entry to obtain a formatted preview.
 *
 * @template T - The routable collection key.
 * @param {CollectionEntry<T>} entry - The collection entry.
 * @returns {Promise<FormatEntryReturnMap<"preview">[T]>} The formatted preview.
 */
export async function getRoutableEntryPreview<T extends RoutableCollectionKey>(
  entry: CollectionEntry<T>
): Promise<FormatEntryReturnMap<"preview">[T]>;
export async function getRoutableEntryPreview<T extends RoutableCollectionKey>(
  entry: CollectionEntry<T>
) {
  const { locale, meta, seo, ...remainingData } = entry.data;
  const { isDraft, ...remainingMeta } = meta;

  const { remarkPluginFrontmatter } = await render(entry);
  const { readingTime } = getMetaFromRemarkPluginFrontmatter(
    remarkPluginFrontmatter,
    locale
  );

  // Handle cover conditionally if it exists
  const processedData = {
    ...remainingData,
    ...("cover" in remainingData
      ? {
          cover: processCover(remainingData.cover),
        }
      : {}),
  };

  const transformedMeta = {
    ...remainingMeta,
    readingTime,
    ...("authors" in remainingMeta
      ? { authors: await resolveAndMapAuthors(remainingMeta.authors) }
      : {}),
    ...("category" in remainingMeta
      ? { category: await getCategoryFromReference(remainingMeta.category) }
      : {}),
    ...("tags" in remainingMeta
      ? { tags: await getTagsFromReferences(remainingMeta.tags) }
      : {}),
  };

  return {
    ...processedData,
    collection: entry.collection,
    id: entry.id,
    locale,
    meta: transformedMeta,
  };
}

/**
 * Transform a collection entry to obtain a full formatted entry.
 *
 * @template T - The routable collection key.
 * @param {CollectionEntry<T>} entry - The collection entry.
 * @returns {Promise<FormatEntryReturnMap<"preview">[T]>} The formatted entry.
 */
export async function getRoutableEntry<T extends RoutableCollectionKey>(
  entry: CollectionEntry<T>
): Promise<FormatEntryReturnMap<"full">[T]>;
export async function getRoutableEntry<T extends RoutableCollectionKey>(
  entry: CollectionEntry<T>
) {
  const preview = await getRoutableEntryPreview(entry);
  const { remarkPluginFrontmatter, ...renderResult } = await render(entry);
  const altLanguages = await resolveTranslations(entry.data.i18n);

  return {
    ...preview,
    ...renderResult,
    hasContent: entry.body !== undefined && entry.body !== "",
    seo: {
      ...entry.data.seo,
      languages: altLanguages,
    },
    slug: entry.data.slug,
  };
}

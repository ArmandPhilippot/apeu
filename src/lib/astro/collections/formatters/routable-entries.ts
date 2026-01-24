import {
  render,
  type CollectionEntry,
  type ReferenceDataEntry,
} from "astro:content";
import type {
  AuthorLink,
  BlogCategory,
  BlogPost,
  Guide,
  Img,
  IndexPage,
  Note,
  Page,
  Project,
  QueryMode,
  Tag,
} from "../../../../types/data";
import type { Blend } from "../../../../types/utilities";
import type { EntryByIdIndex } from "../indexes";
import type { IndexedEntry, RoutableCollectionKey } from "../types";
import { getAuthorLink } from "./authors";
import {
  getCategoryRoute,
  getMetaFromRemarkPluginFrontmatter,
  getTagsRoutes,
  resolveReferences,
  resolveTranslations,
} from "./utils";

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

function resolveAndMapAuthors(
  authors: ReferenceDataEntry<"authors">[],
  indexById: EntryByIdIndex
): AuthorLink[] {
  const resolved = resolveReferences(authors, indexById);
  return resolved?.map((author) => getAuthorLink(author.raw)) ?? [];
}

export type FormatEntryReturnMap<F extends QueryMode> = {
  "blog.categories": BlogCategory<F>;
  "blog.posts": BlogPost<F>;
  guides: Guide<F>;
  "index.pages": IndexPage<F>;
  notes: Note<F>;
  pages: Page<F>;
  projects: Project<F>;
  tags: Tag<F>;
};

/**
 * Transform a collection entry to obtain a formatted preview.
 *
 * @template T - The routable collection key.
 * @param {IndexedEntry<T>} entry - The collection entry.
 * @param {EntryByIdIndex} indexById - A map of indexed entries by id.
 * @returns {Promise<FormatEntryReturnMap<"preview">[T]>} The formatted preview.
 */
export async function getRoutableEntryPreview<T extends RoutableCollectionKey>(
  entry: IndexedEntry<T>,
  indexById: EntryByIdIndex
): Promise<FormatEntryReturnMap<"preview">[T]>;
export async function getRoutableEntryPreview<T extends RoutableCollectionKey>(
  entry: IndexedEntry<T>,
  indexById: EntryByIdIndex
) {
  const { locale, meta, seo, ...remainingData } = entry.raw.data;
  const { isDraft, ...remainingMeta } = meta;

  const { remarkPluginFrontmatter } = await render(entry.raw);
  const { readingTime } = getMetaFromRemarkPluginFrontmatter(
    remarkPluginFrontmatter,
    locale
  );

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
      ? {
          authors: resolveAndMapAuthors(remainingMeta.authors, indexById),
        }
      : {}),
    ...("category" in remainingMeta
      ? {
          category: getCategoryRoute(remainingMeta.category, indexById),
        }
      : {}),
    ...("tags" in remainingMeta
      ? { tags: getTagsRoutes(remainingMeta.tags, indexById) }
      : {}),
  };

  return {
    ...processedData,
    collection: entry.raw.collection,
    id: entry.raw.id,
    locale,
    meta: transformedMeta,
    ...("route" in entry ? { route: entry.route } : {}),
  };
}

/**
 * Transform a collection entry to obtain a full formatted entry.
 *
 * @template T - The routable collection key.
 * @param {IndexedEntry<T>} entry - The collection entry.
 * @param {EntryByIdIndex} indexById - A map of indexed entries by id.
 * @returns {Promise<FormatEntryReturnMap<"full">[T]>} The formatted entry.
 */
export async function getRoutableEntry<T extends RoutableCollectionKey>(
  entry: IndexedEntry<T>,
  indexById: EntryByIdIndex
): Promise<FormatEntryReturnMap<"full">[T]>;
export async function getRoutableEntry<T extends RoutableCollectionKey>(
  entry: IndexedEntry<T>,
  indexById: EntryByIdIndex
) {
  const preview = await getRoutableEntryPreview(entry, indexById);
  const { remarkPluginFrontmatter, ...renderResult } = await render(entry.raw);
  const altLanguages = resolveTranslations(entry.raw.data.i18n, indexById);

  return {
    ...preview,
    ...renderResult,
    hasContent: entry.raw.body !== undefined && entry.raw.body !== "",
    seo: {
      ...entry.raw.data.seo,
      languages: altLanguages,
    },
    slug: entry.slug,
  };
}

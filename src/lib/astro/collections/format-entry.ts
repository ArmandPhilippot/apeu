import type {
  CollectionEntry,
  CollectionKey,
  DataEntryMap,
} from "astro:content";
import { getAuthor, getAuthorPreview } from "./formatters/authors";
import { getBlogPost, getBlogPostPreview } from "./formatters/blog-posts";
import { getBlog } from "./formatters/blogroll";
import { getBookmark } from "./formatters/bookmarks";
import { getGuide, getGuidePreview } from "./formatters/guides";
import { getNote, getNotePreview } from "./formatters/notes";
import { getPage, getPagePreview } from "./formatters/pages";
import { getProject, getProjectPreview } from "./formatters/projects";
import { getTaxonomy, getTaxonomyPreview } from "./formatters/taxonomies";

export type EntryFormat = "full" | "preview";

export type FormatEntryReturnMap<F extends EntryFormat | undefined> = {
  authors: F extends "full" ? typeof getAuthor : typeof getAuthorPreview;
  blogCategories: F extends "full"
    ? typeof getTaxonomy
    : typeof getTaxonomyPreview;
  blogPosts: F extends "full" ? typeof getBlogPost : typeof getBlogPostPreview;
  blogroll: typeof getBlog;
  bookmarks: typeof getBookmark;
  guides: F extends "full" ? typeof getGuide : typeof getGuidePreview;
  notes: F extends "full" ? typeof getNote : typeof getNotePreview;
  pages: F extends "full" ? typeof getPage : typeof getPagePreview;
  projects: F extends "full" ? typeof getProject : typeof getProjectPreview;
  tags: F extends "full" ? typeof getTaxonomy : typeof getTaxonomyPreview;
};

/* eslint-disable complexity -- I should refactor this but the only way to make TypeScript happy is the switch statement. So I leave it as it is for now since this is working. */

/**
 * Format a collection entry to obtain either a full formatted entry or only a preview.
 *
 * @template C, F
 * @param {CollectionKey} entry - The collection entry.
 * @param {EntryFormat} [format] - The format of the returned entry.
 * @returns {Promise<ReturnType<FormatEntryReturnMap<F>[C]>>} The formatted entry.
 * @throws When the collection is invalid.
 */
export async function formatEntry<
  C extends CollectionKey,
  F extends EntryFormat = "full",
>(
  entry: CollectionEntry<C> | DataEntryMap[C][keyof DataEntryMap[C] & string],
  format?: F
): Promise<ReturnType<FormatEntryReturnMap<F>[C]>>;
export async function formatEntry<
  C extends CollectionKey,
  F extends EntryFormat = "full",
>(
  // The DataEntryMap part is required due to the return type of getEntry...
  entry: CollectionEntry<C> | DataEntryMap[C][keyof DataEntryMap[C] & string],
  format?: F
) {
  const isFullVersion = format !== "preview";

  switch (entry.collection) {
    case "authors":
      return isFullVersion ? getAuthor(entry) : getAuthorPreview(entry);
    case "blogCategories":
    case "tags":
      return isFullVersion ? getTaxonomy(entry) : getTaxonomyPreview(entry);
    case "blogPosts":
      return isFullVersion ? getBlogPost(entry) : getBlogPostPreview(entry);
    case "blogroll":
      return getBlog(entry);
    case "bookmarks":
      return getBookmark(entry);
    case "guides":
      return isFullVersion ? getGuide(entry) : getGuidePreview(entry);
    case "notes":
      return isFullVersion ? getNote(entry) : getNotePreview(entry);
    case "pages":
      return isFullVersion ? getPage(entry) : getPagePreview(entry);
    case "projects":
      return isFullVersion ? getProject(entry) : getProjectPreview(entry);
    default:
      throw new Error("Unsupported collection name.");
  }
}
/* eslint-enable complexity */

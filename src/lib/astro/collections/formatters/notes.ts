import { render, type CollectionEntry } from "astro:content";
import type { Note, NotePreview } from "../../../../types/data";
import { getMetaFromRemarkPluginFrontmatter } from "../../../../utils/frontmatter";
import { getTagsFromReferences, resolveTranslations } from "./utils";

/**
 * Convert a note collection entry to a NotePreview object.
 *
 * @param {CollectionEntry<"notes">} note - The note collection entry.
 * @returns {Promise<NotePreview>} An object describing the note preview.
 */
export const getNotePreview = async (
  note: CollectionEntry<"notes">
): Promise<NotePreview> => {
  const { locale, meta, seo, slug, ...remainingData } = note.data;
  const { isDraft, tags, ...remainingMeta } = meta;
  const resolvedTags = await getTagsFromReferences(tags);
  const { remarkPluginFrontmatter } = await render(note);
  const { readingTime } = getMetaFromRemarkPluginFrontmatter(
    remarkPluginFrontmatter,
    locale
  );

  return {
    ...remainingData,
    collection: note.collection,
    id: note.id,
    locale,
    meta: {
      ...remainingMeta,
      readingTime,
      tags: resolvedTags,
    },
  };
};

/**
 * Convert a note collection entry to a Note object.
 *
 * @param {CollectionEntry<"notes">} note - The note collection entry.
 * @returns {Promise<Note>} An object describing the note.
 */
export const getNote = async (
  note: CollectionEntry<"notes">
): Promise<Note> => {
  const preview = await getNotePreview(note);
  const { remarkPluginFrontmatter, ...renderResult } = await render(note);
  const altLanguages = await resolveTranslations(note.data.i18n);

  return {
    ...preview,
    ...renderResult,
    hasContent: note.body !== undefined && note.body !== "",
    seo: {
      ...note.data.seo,
      languages: altLanguages,
    },
    slug: note.data.slug,
  };
};

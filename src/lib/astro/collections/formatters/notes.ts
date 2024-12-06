import { render, type CollectionEntry } from "astro:content";
import type { Note, NotePreview } from "../../../../types/data";
import { getMetaFromRemarkPluginFrontmatter } from "../../../../utils/frontmatter";
import { getTagsFromReferences } from "./utils";

export const getNotePreview = async (
  note: CollectionEntry<"notes">,
): Promise<NotePreview> => {
  const { locale, meta, seo, slug, ...remainingData } = note.data;
  const { isDraft, tags, ...remainingMeta } = meta;
  const resolvedTags = await getTagsFromReferences(tags);
  const { remarkPluginFrontmatter } = await render(note);
  const { readingTime } = getMetaFromRemarkPluginFrontmatter(
    remarkPluginFrontmatter,
    locale,
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

export const getNote = async (
  note: CollectionEntry<"notes">,
): Promise<Note> => {
  const preview = await getNotePreview(note);
  const { remarkPluginFrontmatter, ...renderResult } = await render(note);

  return {
    ...preview,
    ...renderResult,
    hasContent: !!note.body,
    seo: note.data.seo,
    slug: note.data.slug,
  };
};

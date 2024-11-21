import { render, type CollectionEntry } from "astro:content";
import type { Note, NotePreview } from "../../../../types/data";
import { getTagsFromReferences } from "./utils";

export const getNotePreview = async ({
  collection,
  data,
  id,
}: CollectionEntry<"notes">): Promise<NotePreview> => {
  const { meta, seo, slug, ...remainingData } = data;
  const { isDraft, tags, ...remainingMeta } = meta;
  const resolvedTags = await getTagsFromReferences(tags);

  return {
    ...remainingData,
    collection,
    id,
    meta: {
      ...remainingMeta,
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
    seo: note.data.seo,
    slug: note.data.slug,
  };
};

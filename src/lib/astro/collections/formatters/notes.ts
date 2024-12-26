import { render, type CollectionEntry } from "astro:content";
import type { Note, NotePreview } from "../../../../types/data";
import { getMetaFromRemarkPluginFrontmatter } from "../../../../utils/frontmatter";
import { getTagsFromReferences, resolveTranslations } from "./utils";

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
  const altLanguages = await resolveTranslations(note.data.i18n);

  return {
    ...preview,
    ...renderResult,
    hasContent: !!note.body,
    seo: {
      ...note.data.seo,
      languages: altLanguages,
    },
    slug: note.data.slug,
  };
};

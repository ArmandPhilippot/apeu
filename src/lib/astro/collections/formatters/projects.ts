import { render, type CollectionEntry } from "astro:content";
import type { Project, ProjectPreview } from "../../../../types/data";
import { getMetaFromRemarkPluginFrontmatter } from "../../../../utils/frontmatter";
import { isObject } from "../../../../utils/type-checks";
import { getTagsFromReferences, resolveTranslations } from "./utils";

/**
 * Convert a project collection entry to a ProjectPreview object.
 *
 * @param {CollectionEntry<"projects">} project - The project collection entry.
 * @returns {Promise<ProjectPreview>} An object describing the project preview.
 */
export const getProjectPreview = async (
  project: CollectionEntry<"projects">
): Promise<ProjectPreview> => {
  const { cover, locale, meta, seo, slug, ...remainingData } = project.data;
  const { isDraft, tags, ...remainingMeta } = meta;
  const resolvedTags = await getTagsFromReferences(tags);
  const { remarkPluginFrontmatter } = await render(project);
  const { readingTime } = getMetaFromRemarkPluginFrontmatter(
    remarkPluginFrontmatter,
    locale
  );

  return {
    ...remainingData,
    cover: isObject(cover)
      ? {
          ...(cover.position ? { position: cover.position } : {}),
          src: cover.src,
        }
      : null,
    collection: project.collection,
    id: project.id,
    locale,
    meta: {
      ...remainingMeta,
      readingTime,
      tags: resolvedTags,
    },
  };
};

/**
 * Convert a project collection entry to a Project object.
 *
 * @param {CollectionEntry<"projects">} project - The project collection entry.
 * @returns {Promise<Project>} An object describing the project.
 */
export const getProject = async (
  project: CollectionEntry<"projects">
): Promise<Project> => {
  const preview = await getProjectPreview(project);
  const { remarkPluginFrontmatter, ...renderResult } = await render(project);
  const altLanguages = await resolveTranslations(project.data.i18n);

  return {
    ...preview,
    ...renderResult,
    hasContent: project.body !== undefined && project.body !== "",
    seo: {
      ...project.data.seo,
      languages: altLanguages,
    },
    slug: project.data.slug,
  };
};

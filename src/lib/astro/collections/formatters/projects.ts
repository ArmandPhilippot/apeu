import { render, type CollectionEntry } from "astro:content";
import type { Project, ProjectPreview } from "../../../../types/data";
import { getMetaFromRemarkPluginFrontmatter } from "../../../../utils/frontmatter";
import { getTagsFromReferences, resolveTranslations } from "./utils";

export const getProjectPreview = async (
  project: CollectionEntry<"projects">,
): Promise<ProjectPreview> => {
  const { locale, meta, seo, slug, ...remainingData } = project.data;
  const { isDraft, tags, ...remainingMeta } = meta;
  const resolvedTags = await getTagsFromReferences(tags);
  const { remarkPluginFrontmatter } = await render(project);
  const { readingTime } = getMetaFromRemarkPluginFrontmatter(
    remarkPluginFrontmatter,
    locale,
  );

  return {
    ...remainingData,
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

export const getProject = async (
  project: CollectionEntry<"projects">,
): Promise<Project> => {
  const preview = await getProjectPreview(project);
  const { remarkPluginFrontmatter, ...renderResult } = await render(project);
  const altLanguages = await resolveTranslations(project.data.i18n);

  return {
    ...preview,
    ...renderResult,
    hasContent: !!project.body,
    seo: {
      ...project.data.seo,
      languages: altLanguages,
    },
    slug: project.data.slug,
  };
};

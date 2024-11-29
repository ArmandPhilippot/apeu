import { render, type CollectionEntry } from "astro:content";
import type { Project, ProjectPreview } from "../../../../types/data";
import { getTagsFromReferences } from "./utils";

export const getProjectPreview = async ({
  collection,
  data,
  id,
}: CollectionEntry<"projects">): Promise<ProjectPreview> => {
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

export const getProject = async (
  project: CollectionEntry<"projects">,
): Promise<Project> => {
  const preview = await getProjectPreview(project);
  const { remarkPluginFrontmatter, ...renderResult } = await render(project);

  return {
    ...preview,
    ...renderResult,
    hasContent: !!project.body,
    seo: project.data.seo,
    slug: project.data.slug,
  };
};

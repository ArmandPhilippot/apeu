import { render } from "astro:content";
import type {
  RawTaxonomyEntry,
  Taxonomy,
  TaxonomyLink,
  TaxonomyPreview,
} from "../../../../types/data";
import { resolveTranslations } from "./utils";

export const getTaxonomyLink = (taxonomy: RawTaxonomyEntry): TaxonomyLink => {
  const { route, title } = taxonomy.data;

  return {
    route,
    title,
  };
};

export const getTaxonomyPreview = ({
  collection,
  data,
  id,
}: RawTaxonomyEntry): TaxonomyPreview => {
  const { cover, description, locale, meta: rawMeta, route, title } = data;
  const { isDraft, ...meta } = rawMeta;

  return {
    cover,
    collection,
    description,
    id,
    meta,
    locale,
    route,
    title,
  };
};

export const getTaxonomy = async (
  taxonomy: RawTaxonomyEntry,
): Promise<Taxonomy> => {
  const preview = getTaxonomyPreview(taxonomy);
  const { remarkPluginFrontmatter, ...renderResult } = await render(taxonomy);
  const altLanguages = await resolveTranslations(taxonomy.data.i18n);

  return {
    ...preview,
    ...renderResult,
    hasContent: !!taxonomy.body,
    seo: {
      ...taxonomy.data.seo,
      languages: altLanguages,
    },
    slug: taxonomy.data.slug,
  };
};

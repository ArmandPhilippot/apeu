import { render } from "astro:content";
import type {
  RawTaxonomyEntry,
  Taxonomy,
  TaxonomyLink,
  TaxonomyPreview,
} from "../../../../types/data";
import { isObject } from "../../../../utils/type-checks";
import { resolveTranslations } from "./utils";

/**
 * Convert a taxonomy collection entry to a TaxonomyLink object.
 *
 * @param {RawTaxonomyEntry} taxonomy - The taxonomy collection entry.
 * @returns {Promise<TaxonomyLink>} An object describing the taxonomy link.
 */
export const getTaxonomyLink = (taxonomy: RawTaxonomyEntry): TaxonomyLink => {
  const { route, title } = taxonomy.data;

  return {
    route,
    title,
  };
};

/**
 * Convert a taxonomy collection entry to a TaxonomyPreview object.
 *
 * @param {RawTaxonomyEntry} taxonomy - The taxonomy collection entry.
 * @returns {Promise<TaxonomyPreview>} An object describing the taxonomy preview.
 */
export const getTaxonomyPreview = ({
  collection,
  data,
  id,
}: RawTaxonomyEntry): TaxonomyPreview => {
  const { cover, description, locale, meta: rawMeta, route, title } = data;
  const { isDraft, ...meta } = rawMeta;

  return {
    cover: isObject(cover)
      ? {
          ...(cover.position ? { position: cover.position } : {}),
          src: cover.src,
        }
      : null,
    collection,
    description,
    id,
    meta,
    locale,
    route,
    title,
  };
};

/**
 * Convert a taxonomy collection entry to a Taxonomy object.
 *
 * @param {RawTaxonomyEntry} taxonomy - The taxonomy collection entry.
 * @returns {Promise<Taxonomy>} An object describing the taxonomy.
 */
export const getTaxonomy = async (
  taxonomy: RawTaxonomyEntry
): Promise<Taxonomy> => {
  const preview = getTaxonomyPreview(taxonomy);
  const { remarkPluginFrontmatter, ...renderResult } = await render(taxonomy);
  const altLanguages = await resolveTranslations(taxonomy.data.i18n);

  return {
    ...preview,
    ...renderResult,
    hasContent: taxonomy.body !== undefined && taxonomy.body !== "",
    seo: {
      ...taxonomy.data.seo,
      languages: altLanguages,
    },
    slug: taxonomy.data.slug,
  };
};

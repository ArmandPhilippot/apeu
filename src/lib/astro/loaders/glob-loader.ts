import { glob, type Loader } from "astro/loaders";
import { CONFIG } from "../../../utils/constants";

const getLocalesPattern = () => {
  /* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- The languages number could change so it is safe to expect that a single language is configured. */
  if (CONFIG.LANGUAGES.AVAILABLE.length > 1) {
    return `(${CONFIG.LANGUAGES.AVAILABLE.join("|")})`;
  }

  return CONFIG.LANGUAGES.DEFAULT;
};

const getLocalizedPattern = (pattern: string) => {
  const locales = getLocalesPattern();

  return `${locales}${pattern}`;
};

const collectionsPattern = {
  authors: "authors/*.json",
  "blog.categories": getLocalizedPattern(
    "/blog/categories/**/!(index).{md,mdx}"
  ),
  "blog.posts": getLocalizedPattern("/blog/posts/**/!(index).{md,mdx}"),
  blogroll: "blogroll/*.json",
  bookmarks: "bookmarks/*.json",
  guides: getLocalizedPattern("/guides/**/!(index).{md,mdx}"),
  "index.pages": getLocalizedPattern("/!(pages)/**/index.{md,mdx}"),
  notes: getLocalizedPattern("/notes/**/!(index).{md,mdx}"),
  pages: getLocalizedPattern("/pages/**/*.{md,mdx}"),
  projects: getLocalizedPattern("/projects/**/!(index).{md,mdx}"),
  tags: getLocalizedPattern("/tags/**/!(index).{md,mdx}"),
};

type Collection = keyof typeof collectionsPattern;

/**
 * The `generateId` callback accepted by Astro's `glob()` loader, derived from
 * its signature so it stays in sync with upstream.
 */
export type GenerateId = NonNullable<Parameters<typeof glob>[0]["generateId"]>;

type GlobLoaderOptions = {
  /**
   * Override the default id generation. Useful to strip a virtual directory
   * (e.g. `pages/`) from the generated ids so they match the references used
   * in the content.
   */
  generateId?: GenerateId;
};

/**
 * Create a glob loader for the given collection.
 *
 * @param {Collection} collection - The collection to load.
 * @param {GlobLoaderOptions} [options] - Extra options forwarded to `glob()`.
 * @returns {Loader} A loader for the given collection.
 */
export const globLoader = (
  collection: Collection,
  { generateId }: GlobLoaderOptions = {}
): Loader =>
  glob({
    base: process.env.CONTENT_PATH ?? "./content",
    pattern: collectionsPattern[collection],
    ...(generateId === undefined ? {} : { generateId }),
  });

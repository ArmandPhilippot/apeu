import { glob, type Loader } from "astro/loaders";
import { CONFIG } from "../../../utils/constants";

/* This is not a supported usage, so it could break but I need this to be able
 * to separate the code from the contents (ie. when using a Git submodules). */
const CONTENT_DIR: string = process.env.CONTENT_PATH ?? "./content";

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
 * Create a glob loader for the given collection.
 *
 * @param {Collection} collection - The collection to load.
 * @returns {Loader} A loader for the given collection.
 */
export const globLoader = (collection: Collection): Loader =>
  glob({
    base: CONTENT_DIR,
    pattern: collectionsPattern[collection],
  });

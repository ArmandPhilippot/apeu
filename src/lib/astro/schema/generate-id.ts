import type { GenerateId } from "../loaders";

type GenerateIdOptions = Parameters<GenerateId>[0];

const FILE_EXTENSION_REGEX = /\.[^./]+$/;
const AUTHORS_PREFIX_REGEX = /^authors\//;
const TRAILING_INDEX_REGEX = /\/index$/;

/**
 * Remove the file extension from a glob entry path.
 *
 * @param {string} entry - The file path relative to the collection base.
 * @returns {string} The path without its extension.
 */
const stripExtension = (entry: string): string =>
  entry.replace(FILE_EXTENSION_REGEX, "");

/**
 * Generate the id of an `authors` collection entry.
 *
 * The `authors/` directory is virtual: it only exists to keep the content
 * folder tidy. Stripping it from the id lets other collections reference an
 * author by its file name (e.g. `armand-philippot`) instead of
 * `authors/armand-philippot`.
 *
 * @param {GenerateIdOptions} options - The glob id generation options.
 * @returns {string} The entry id without the virtual `authors/` directory.
 */
export const generateAuthorId = ({ entry }: GenerateIdOptions): string =>
  stripExtension(entry).replace(AUTHORS_PREFIX_REGEX, "");

/**
 * Generate the id of a `pages` collection entry.
 *
 * The `pages/` directory is virtual: it only groups the localized top-level
 * pages on disk. Stripping it from the id (e.g. `en/pages/legal-notice`
 * becomes `en/legal-notice`) keeps the ids aligned with the routes and lets
 * the `i18n` references target `en/legal-notice` directly.
 *
 * @param {GenerateIdOptions} options - The glob id generation options.
 * @returns {string} The entry id without the virtual `pages/` directory.
 */
export const generatePageId = ({ entry }: GenerateIdOptions): string =>
  stripExtension(entry)
    .replace(TRAILING_INDEX_REGEX, "")
    .replace("/pages/", "/");

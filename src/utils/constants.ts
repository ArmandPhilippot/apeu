import type { HTTPStatus } from "../types/data";

export const API_ROUTES = {
  SEND_EMAIL: "/api/send-email",
} as const;

export const CALLOUT_TYPES = [
  "critical",
  "discovery",
  "idea",
  "info",
  "success",
  "warning",
] as const;

export const COMPONENT_KINDS = [
  "atoms",
  "molecules",
  "organisms",
  "templates",
] as const;

export const CONFIG = {
  BRAND: "Armand Philippot",
  CREATION_YEAR: 2024,
  DESCRIPTION: "The personal website of Armand Philippot.",
  HOST: "armand.philippot.eu",
  ITEMS_PER_PAGE: 10,
  LANGUAGES: {
    AVAILABLE: ["en", "fr"],
    DEFAULT: "en",
  },
  // This is mainly used to avoid hardcoding while defining schema.org ids.
  PROTOCOL: "https://",
  SEARCH: {
    QUERY_PARAM: "q",
  },
} as const;

/**
 * A partial list of country codes using the ISO 3166-1 alpha-2 codes
 *
 * I don't plan to support all the countries so this list will be updated only
 * when needed.
 * Note: the alpha-3 version is more readable but using alpha-2 we could reuse
 * these codes to check locales (e.g. `en-US`, `en_US`) if needed.
 *
 * @see https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2
 */
export const COUNTRY_CODES = ["FR"] as const;

/**
 * The HTTP status codes
 *
 * @see https://www.rfc-editor.org/rfc/rfc9110#name-status-codes
 */
export const HTTP_STATUS = {
  /**
   * The request has succeeded.
   */
  OK: {
    CODE: 200,
    TEXT: "OK",
  },
  /**
   * The server cannot or will not process the request due to something that is
   * perceived to be a client error (e.g., malformed request syntax, invalid
   * request message framing, or deceptive request routing).
   */
  BAD_REQUEST: {
    CODE: 400,
    TEXT: "Bad Request",
  },
  /**
   * The server has encountered an unexpected condition that prevented it from
   * fulfilling the request.
   */
  INTERNAL_SERVER_ERROR: {
    CODE: 500,
    TEXT: "Internal Server Error",
  },
  /**
   * The target resource has been assigned a new permanent URI and any future
   * references to this resource should use one of the enclosed URIs.
   */
  MOVED_PERMANENTLY: {
    CODE: 301,
    TEXT: "Moved Permanently",
  },
} as const satisfies Record<Uppercase<string>, HTTPStatus>;

/**
 * A partial list of language codes using the ISO 639-1 codes
 *
 * I don't plan to support all the languages so this list will be updated only
 * when needed.
 *
 * @see https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
 */
export const LANGUAGE_CODES = ["en", "es", "fr"] as const;

export const STORIES_SUFFIX = "stories";

/** The extension used for components stories.
 *
 * `injectRoute` only supports `.astro`, `.js` and `.ts` extensions so
 * we cannot use `.mdx` for our stories.
 * @see https://docs.astro.build/en/reference/integrations-reference/#injectroute-option
 */
export const STORIES_EXT = `${STORIES_SUFFIX}.astro`;

/**
 * The number of words read per minute depending on the lang.
 *
 * I peek those numbers in the following link.I don't know if this is accurate
 * but I didn't find another study as reference.
 * @link https://iovs.arvojournals.org/article.aspx?articleid=2166061
 */
export const WORDS_PER_MINUTE = {
  EN: 228,
  FR: 195,
} satisfies Record<
  Uppercase<(typeof CONFIG.LANGUAGES.AVAILABLE)[number]>,
  number
>;

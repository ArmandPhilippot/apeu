import type { HTTPStatus } from "../types/data";

export const API_ROUTES = {
  SEND_EMAIL: "/api/send-email",
} as const;

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
  LANGUAGES: {
    AVAILABLE: ["en"],
    DEFAULT: "en",
  },
  SEARCH: {
    QUERY_PARAM: "q",
  },
} as const;

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

export const STORIES_SUFFIX = "stories";

/** The extension used for components stories.
 *
 * `injectRoute` only supports `.astro`, `.js` and `.ts` extensions so
 * we cannot use `.mdx` for our stories.
 * @see https://docs.astro.build/en/reference/integrations-reference/#injectroute-option
 */
export const STORIES_EXT = `${STORIES_SUFFIX}.astro`;

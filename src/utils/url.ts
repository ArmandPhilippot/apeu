import { CONFIG } from "./constants";

/**
 * Retrieve the website url (protocol + hostname).
 *
 * @returns {string} The computed website url.
 */
export const getWebsiteUrl =
  (): `${typeof CONFIG.PROTOCOL}${typeof CONFIG.HOST}` =>
    `${CONFIG.PROTOCOL}${CONFIG.HOST}` as const;

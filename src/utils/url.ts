import { CONFIG } from "./constants";

/**
 * Retrieve the website url (protocol + hostname)
 *
 * @returns The url.
 */
export const getWebsiteUrl = () => `${CONFIG.PROTOCOL}${CONFIG.HOST}` as const;

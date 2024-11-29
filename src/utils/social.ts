import type { SocialMedium } from "../types/tokens";

/**
 * Check if the given medium is a valid social medium.
 *
 * @param {unknown} medium - The medium to validate.
 * @returns {boolean} True if the medium is valid.
 */
export const isValidSocialMedium = (
  medium: unknown,
): medium is SocialMedium => {
  if (typeof medium !== "string") return false;

  const validMedia: string[] = [
    "bluesky",
    "diaspora",
    "email",
    "facebook",
    "github",
    "gitlab",
    "linkedin",
    "mastodon",
    "reddit",
    "stackoverflow",
    "whatsapp",
    "x",
  ] satisfies SocialMedium[];

  return validMedia.includes(medium);
};

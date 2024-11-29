export type CalloutType =
  | "critical"
  | "discovery"
  | "idea"
  | "info"
  | "success"
  | "warning";

export type Direction = "bottom" | "left" | "right" | "top";

/**
 * The elevations defined in `src/styles/variables/shadows.css`.
 */
export type Elevation = "raised" | "elevated" | "floating";

export type HeadingLvl = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

/**
 * The filenames available in `src/assets/icons` directory.
 *
 * These tokens are meant to be used with `astro-icon`.
 */
export type IconName =
  | CalloutType
  | `social/${SocialMedium}`
  | "arrow-right"
  | "blog"
  | "bookmark"
  | "caret"
  | "cc-by-sa"
  | "contact"
  | "feed"
  | "folder"
  | "gear"
  | "globe"
  | "guide"
  | "hamburger"
  | "home"
  | "locale"
  | "page"
  | "notepad"
  | "project"
  | "search"
  | "tag";

export type Order = "ASC" | "DESC";

export type SocialMedium =
  | "bluesky"
  | "diaspora"
  | "email"
  | "facebook"
  | "github"
  | "gitlab"
  | "linkedin"
  | "mastodon"
  | "reddit"
  | "stackoverflow"
  | "whatsapp"
  | "x";

/**
 * Those tokens should match the ones defined in `spacing_levels` in
 * `src/styles/variables/spacings.css`.
 */
export type Spacing =
  | "4xs"
  | "3xs"
  | "2xs"
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl";

export type Theme = "auto" | "dark" | "light";

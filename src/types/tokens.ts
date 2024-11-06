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

/**
 * The filenames available in `src/assets/icons` directory.
 *
 * These tokens are meant to be used with `astro-icon`.
 */
export type IconName =
  | CalloutType
  | "caret"
  | "cc-by-sa"
  | "feed"
  | "gear"
  | "hamburger"
  | "home"
  | "locale"
  | "search";

export type Theme = "auto" | "dark" | "light";

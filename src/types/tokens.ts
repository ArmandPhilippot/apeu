import type {
  CALLOUT_TYPES,
  CONFIG,
  COUNTRY_CODES,
  HEADING_TAGS,
  SOCIAL_MEDIA,
  THEMES,
} from "../utils/constants";

export type AvailableLanguage = (typeof CONFIG.LANGUAGES.AVAILABLE)[number];

export type CalloutType = (typeof CALLOUT_TYPES)[number];

export type CSSAlignment =
  | "baseline"
  | "center"
  | "end"
  | "first baseline"
  | "last baseline"
  | "left"
  | "normal"
  | "right"
  | "start"
  | "space-around"
  | "space-between"
  | "space-evenly"
  | "stretch";

type CSSDecompoundGap = {
  row?: Spacing | null | undefined;
  col?: Spacing | null | undefined;
};
export type Gap = CSSDecompoundGap | Spacing;

export type CountryCode = (typeof COUNTRY_CODES)[number];

export type Direction = "bottom" | "left" | "right" | "top";

/**
 * The elevations defined in `src/styles/variables/shadows.css`.
 */
export type Elevation = "raised" | "elevated" | "floating";

export type HeadingLvl = (typeof HEADING_TAGS)[number];

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
  | "copy"
  | "feed"
  | "folder"
  | "gear"
  | "globe"
  | "guide"
  | "hamburger"
  | "home"
  | "locale"
  | "moon"
  | "page"
  | "notepad"
  | "project"
  | "search"
  | "sun"
  | "tag";

export type Order = "ASC" | "DESC";

export type SocialMedium = (typeof SOCIAL_MEDIA)[number];

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

export type Theme = (typeof THEMES)[number];

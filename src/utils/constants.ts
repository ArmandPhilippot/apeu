export const COMPONENT_KINDS = [
  "atoms",
  "molecules",
  "organisms",
  "templates",
] as const;

export const STORIES_SUFFIX = "stories";

/** The extension used for components stories.
 *
 * `injectRoute` only supports `.astro`, `.js` and `.ts` extensions so
 * we cannot use `.mdx` for our stories.
 * @see https://docs.astro.build/en/reference/integrations-reference/#injectroute-option
 */
export const STORIES_EXT = `${STORIES_SUFFIX}.astro`;

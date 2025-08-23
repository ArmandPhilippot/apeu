import type { Crumb, SEO } from "../types/data";
import { COMPONENT_KINDS, STORIES_EXT, STORIES_SUFFIX } from "./constants";
import { getParentDirPath, joinPaths } from "./paths";
import { capitalizeFirstLetter } from "./strings";

const isSubStory = (path: string) => path.endsWith(`/${STORIES_SUFFIX}`);

const getSubStoryRoute = (path: string, baseSlug: string) => {
  const slug = path
    .replace(baseSlug, "")
    .replace(new RegExp(`.${STORIES_EXT}$`), "");
  const parentPath = getParentDirPath(baseSlug);

  return slug === "/index" ? parentPath : joinPaths(parentPath, slug);
};

/**
 * Retrieve the story route.
 *
 * Stories should live alongside components in a directory named after the
 * component name so to avoid route like `foo/bar/button/button` and instead
 * use `foo/bar/button` we need to truncate the path. The same applies for
 * stories located in a subdirectory.
 *
 * @param {string} path - The path to a story file.
 * @returns {string} The computed story route.
 */
export const getStoryRoute = (path: string): string => {
  const route = getParentDirPath(path);

  return isSubStory(route) ? getSubStoryRoute(path, route) : route;
};

/**
 * Retrieve a story name from its slug.
 *
 * @param {string} slug - The slug of a story.
 * @returns {string} The name of a story.
 * @throws {Error} When the story name can't be determined.
 */
export const getStoryNameFromSlug = (slug: string): string => {
  const storyName = slug.split("/").pop();

  if (storyName === "" || storyName === undefined) {
    throw new Error(
      "Could not retrieve the story name from its slug. Are you sure this slug match a story?"
    );
  }

  return storyName
    .split("-")
    .map((story) => capitalizeFirstLetter(story))
    .join("");
};

type ComponentKind = (typeof COMPONENT_KINDS)[number];

type StoryBreadcrumbConfig = {
  kind: ComponentKind | "views";
  route: string;
  title: string;
};

const STORY_KIND_META = {
  atoms: { label: "Atoms", slug: "atoms" },
  molecules: { label: "Molecules", slug: "molecules" },
  organisms: { label: "Organisms", slug: "organisms" },
  templates: { label: "Templates", slug: "templates" },
  views: { label: "Views", slug: "views" },
} satisfies Record<ComponentKind | "views", { label: string; slug: string }>;

const ROOT_CRUMBS: Crumb[] = [
  { label: "Home", url: "/" },
  { label: "Design system", url: "/design-system" },
];

/**
 * Build the breadcrumb trail for a design system story.
 *
 * @template K - The kind of story.
 * @param {Extract<StoryBreadcrumbConfig, { kind: K }>} config - Story configuration.
 * @returns {Crumb[]} An crumbs list for the story.
 */
const getStoryBreadcrumb = (config: StoryBreadcrumbConfig): Crumb[] => {
  const { label, slug } = STORY_KIND_META[config.kind];
  if (config.kind === "views") {
    return [
      ...ROOT_CRUMBS,
      { label, url: `/design-system/${slug}` },
      { label: config.title, url: config.route },
    ];
  }

  return [
    ...ROOT_CRUMBS,
    { label: "Components", url: "/design-system/components" },
    { label, url: `/design-system/components/${slug}` },
    { label: config.title, url: config.route },
  ];
};

/**
 * Derive the `<title>` string for SEO purposes from a breadcrumb trail.
 *
 * @param {Crumb[]} breadcrumb - The breadcrumb trail for the page.
 * @returns {string} A human-readable SEO title string.
 */
const getStorySeoTitle = (breadcrumb: Crumb[]): string =>
  breadcrumb
    .slice(1)
    .reverse()
    .map((crumb) => crumb.label)
    .join(" | ");

type StoryMetaOptions = {
  breadcrumb: StoryBreadcrumbConfig;
  seo?: Pick<SEO, "nofollow" | "noindex"> | null | undefined;
};

type StoryMeta = {
  breadcrumb: Crumb[];
  seo: Pick<SEO, "nofollow" | "noindex" | "title">;
};

/**
 * Compute both breadcrumb and SEO metadata for a story in one call.
 *
 * - Breadcrumb is always derived from the provided story config.
 * - SEO title is derived from the breadcrumb with some overridable data.
 *
 * @param {StoryMetaOptions} options - The story meta config.
 * @returns {StoryMeta} An object containing `breadcrumb` and `seo` metadata.
 */
export const getStoryMeta = ({
  breadcrumb: config,
  seo,
}: StoryMetaOptions): StoryMeta => {
  const breadcrumb = getStoryBreadcrumb(config);
  return {
    breadcrumb,
    seo: {
      noindex: seo?.noindex ?? true,
      nofollow: seo?.nofollow ?? true,
      title: getStorySeoTitle(breadcrumb),
    },
  };
};

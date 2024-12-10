import { glob, type Loader } from "astro/loaders";
import { CONFIG } from "../../../utils/constants";
import {
  isAvailableLanguage,
  isAvailableRoute,
  useI18n,
  type AvailableLanguage,
} from "../../../utils/i18n";

const CONTENT_DIR: string = import.meta.env?.CONTENT_PATH ?? "./content";

const getLocalesPattern = () => {
  if (CONFIG.LANGUAGES.AVAILABLE.length > 1)
    return `(${CONFIG.LANGUAGES.AVAILABLE.join("|")})`;

  return CONFIG.LANGUAGES.DEFAULT;
};

const getLocalizedPattern = (pattern: string) => {
  const locales = getLocalesPattern();

  return `${locales}${pattern}`;
};

const collectionsPattern = {
  authors: "authors/*.json",
  "blog.categories": getLocalizedPattern(
    "/blog/categories/**/!(index).{md,mdx}",
  ),
  "blog.posts": getLocalizedPattern("/blog/posts/**/!(index).{md,mdx}"),
  blogroll: "blogroll/*.json",
  bookmarks: "bookmarks/*.json",
  guides: getLocalizedPattern("/guides/**/!(index).{md,mdx}"),
  notes: getLocalizedPattern("/notes/**/!(index).{md,mdx}"),
  pages: `{${getLocalizedPattern("/pages/**/*.{md,mdx}")},${getLocalizedPattern("/!(pages)/**/index.{md,mdx}")}}`,
  projects: getLocalizedPattern("/projects/**/!(index).{md,mdx}"),
  tags: getLocalizedPattern("/tags/**/!(index).{md,mdx}"),
};

type Collection = keyof typeof collectionsPattern;

type GetCollectionEntrySlugConfig = {
  collection: Exclude<Collection, "authors">;
  locale: AvailableLanguage;
  slug: string;
};

const getCollectionEntryRoute = ({
  collection,
  locale,
  slug,
}: GetCollectionEntrySlugConfig) => {
  const { route } = useI18n(locale);

  if (collection !== "pages") return `${route(collection)}/${slug}`;

  const id = slug.replaceAll("/", ".").replaceAll("-", ".");
  return isAvailableRoute(id) ? route(id) : `/${slug}`;
};

const getLocaleAndSlugFromId = (collection: Collection, id: string) => {
  const [maybeLocale, ...slugParts] = id.split("/");
  const locale =
    maybeLocale && isAvailableLanguage(maybeLocale)
      ? maybeLocale
      : CONFIG.LANGUAGES.DEFAULT;
  const slug = slugParts
    .join("/")
    .replace(`${collection.replace(".", "/")}/`, "");

  return { locale, slug };
};

const isLocalizedCollection = (
  collection: Collection,
): collection is Exclude<Collection, "authors" | "blogroll" | "bookmarks"> =>
  !["authors", "blogroll", "bookmarks"].includes(collection);

export const globLoader = (collection: Collection): Loader => {
  const originalGlob = glob({
    base: CONTENT_DIR,
    pattern: collectionsPattern[collection],
  });

  return {
    ...originalGlob,
    load: async (ctx) => {
      await originalGlob.load(ctx);

      const originalEntries = Array.from(ctx.store.entries());
      ctx.store.clear();

      for (const [originalId, entry] of originalEntries) {
        if (!entry.filePath) continue;

        const id = entry.id.replace(`${collection.replace(".", "/")}/`, "");

        if (isLocalizedCollection(collection)) {
          const { locale, slug } = getLocaleAndSlugFromId(
            collection,
            originalId,
          );
          const route = getCollectionEntryRoute({ collection, locale, slug });
          ctx.store.set({
            ...entry,
            data: {
              ...entry.data,
              locale,
              route,
              slug,
            },
            id,
          });
        } else {
          ctx.store.set({
            ...entry,
            id,
          });
        }
      }
    },
  };
};

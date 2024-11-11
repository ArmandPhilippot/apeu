import { glob, type Loader } from "astro/loaders";
import { CONFIG } from "../../../utils/constants";
import {
  isAvailableLanguage,
  isAvailableRoute,
  useI18n,
  type AvailableLanguage,
} from "../../../utils/i18n";

const getLocalesPattern = () => {
  if (CONFIG.LANGUAGES.AVAILABLE.length > 1)
    return `(${CONFIG.LANGUAGES.AVAILABLE.join("|")})`;

  return CONFIG.LANGUAGES.DEFAULT;
};

export const getLocalizedPattern = (pattern: string) => {
  const locales = getLocalesPattern();

  return `${locales}${pattern}`;
};

const collectionsPattern = {
  "blog.categories": getLocalizedPattern("/blog/categories/**/!(index).md"),
  "blog.posts": getLocalizedPattern("/blog/posts/**/!(index).md"),
  bookmarks: "bookmarks/*.json",
  guides: getLocalizedPattern("/guides/**/!(index).md"),
  notes: getLocalizedPattern("/notes/**/!(index).md"),
  pages: getLocalizedPattern("/pages/**/*.md"),
  projects: getLocalizedPattern("/projects/**/!(index).md"),
  tags: getLocalizedPattern("/tags/**/!(index).md"),
};

type Collection = keyof typeof collectionsPattern;

type GetCollectionEntrySlugConfig = {
  collection: Collection;
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

export const globLoader = (collection: Collection): Loader => {
  const originalGlob = glob({
    base: "./content",
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
        const isLocalized = collection !== "bookmarks";

        if (isLocalized) {
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

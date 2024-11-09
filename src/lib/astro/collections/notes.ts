import { glob, type Loader } from "astro/loaders";
import { defineCollection } from "astro:content";
import { CONFIG } from "../../../utils/constants";
import {
  isAvailableLanguage,
  useI18n,
  type AvailableLanguage,
} from "../../../utils/i18n";
import { contentsBaseSchema, getLocalizedPattern } from "./utils";

const getNoteRoute = (slug: string, locale: AvailableLanguage) => {
  const { route } = useI18n(locale);

  return `${route("notes")}/${slug}`;
};

const getLocaleAndSlugFromId = (id: string) => {
  const [maybeLocale, ...slugParts] = id.split("/");
  const locale =
    maybeLocale && isAvailableLanguage(maybeLocale)
      ? maybeLocale
      : CONFIG.LANGUAGES.DEFAULT;
  const slug = getNoteRoute(slugParts.join("/").replace("notes/", ""), locale);

  return { locale, slug };
};

const notesLoader = (config: Parameters<typeof glob>[0]): Loader => {
  const originalGlob = glob(config);

  return {
    ...originalGlob,
    name: "notes-loader",
    load: async (ctx) => {
      await originalGlob.load(ctx);

      const originalEntries = Array.from(ctx.store.entries());
      ctx.store.clear();

      for (const [id, entry] of originalEntries) {
        if (!entry.filePath) continue;

        const { locale, slug } = getLocaleAndSlugFromId(id);
        ctx.store.set({
          ...entry,
          data: {
            ...entry.data,
            locale,
            slug,
          },
          id: entry.id.replace("notes/", ""),
        });
      }
    },
  };
};

export const notes = defineCollection({
  loader: notesLoader({
    base: "./content",
    pattern: getLocalizedPattern("/notes/**/!(index).md"),
  }),
  schema: contentsBaseSchema.transform(
    ({ isDraft, publishedOn, updatedOn, ...note }) => {
      return {
        ...note,
        meta: {
          isDraft,
          publishedOn,
          updatedOn: updatedOn ?? publishedOn,
        },
      };
    },
  ),
});

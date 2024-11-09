import { glob, type Loader } from "astro/loaders";
import { defineCollection, z } from "astro:content";
import { CONFIG } from "../../../utils/constants";
import {
  isAvailableLanguage,
  isAvailableRoute,
  useI18n,
  type AvailableLanguage,
} from "../../../utils/i18n";
import { getLocalizedPattern } from "./utils";

const getPageRoute = (slug: string, locale: AvailableLanguage) => {
  const { route } = useI18n(locale);
  const id = slug.replaceAll("/", ".").replaceAll("-", ".");

  return isAvailableRoute(id) ? route(id) : `/${slug}`;
};

const getLocaleAndSlugFromId = (id: string) => {
  const [maybeLocale, ...slugParts] = id.split("/");
  const locale =
    maybeLocale && isAvailableLanguage(maybeLocale)
      ? maybeLocale
      : CONFIG.LANGUAGES.DEFAULT;
  const slug = getPageRoute(slugParts.join("/").replace("pages/", ""), locale);

  return { locale, slug };
};

const pagesLoader = (config: Parameters<typeof glob>[0]): Loader => {
  const originalGlob = glob(config);

  return {
    ...originalGlob,
    name: "pages-loader",
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
          id: entry.id.replace("pages/", ""),
        });
      }
    },
  };
};

export const pages = defineCollection({
  loader: pagesLoader({
    base: "./content",
    pattern: getLocalizedPattern("/pages/**/*.md"),
  }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string(),
        description: z.string(),
        isDraft: z.boolean().optional().default(false),
        publishedOn: z.coerce.date(),
        updatedOn: z.coerce.date().optional(),
        cover: z
          .object({
            src: image(),
            alt: z.string(),
          })
          .optional(),
        seo: z.object({
          description: z.string().max(155),
          nofollow: z.boolean().optional(),
          noindex: z.boolean().optional(),
          title: z.string().min(2).max(70),
        }),
        locale: z
          .string()
          .refine(isAvailableLanguage)
          .optional()
          .default(CONFIG.LANGUAGES.DEFAULT),
        slug: z.string().optional(),
      })
      .transform(({ isDraft, publishedOn, updatedOn, ...page }) => {
        return {
          ...page,
          meta: {
            isDraft,
            publishedOn,
            updatedOn: updatedOn ?? publishedOn,
          },
        };
      }),
});

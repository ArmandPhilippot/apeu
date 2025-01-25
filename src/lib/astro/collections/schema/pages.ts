import { defineCollection, reference, z } from "astro:content";
import { isAvailableLanguage } from "../../../../utils/i18n";
import { globLoader } from "../../loaders/glob-loader";
import { contentsBaseSchema } from "./partials";

export const pages = defineCollection({
  loader: globLoader("pages"),
  schema: ({ image }) =>
    contentsBaseSchema
      .extend({
        cover: image().optional(),
        i18n: z
          .record(z.string().refine(isAvailableLanguage), reference("pages"))
          .optional(),
      })
      .transform(({ isDraft, publishedOn, updatedOn, ...page }) => {
        return {
          ...page,
          // `<Image />` component expect the src to be the full object.
          ...(page.cover ? { cover: { src: page.cover } } : {}),
          meta: {
            isDraft,
            publishedOn,
            updatedOn: updatedOn ?? publishedOn,
          },
        };
      }),
});

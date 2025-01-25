import { defineCollection, reference, z } from "astro:content";
import { isAvailableLanguage } from "../../../../utils/i18n";
import { globLoader } from "../../loaders/glob-loader";
import { contentsBaseSchema } from "./partials";

export const tags = defineCollection({
  loader: globLoader("tags"),
  schema: ({ image }) =>
    contentsBaseSchema
      .extend({
        cover: image().optional(),
        i18n: z
          .record(z.string().refine(isAvailableLanguage), reference("tags"))
          .optional(),
      })
      .transform(({ isDraft, publishedOn, updatedOn, ...tag }) => {
        return {
          ...tag,
          // `<Image />` component expect the src to be the full object.
          ...(tag.cover ? { cover: { src: tag.cover } } : {}),
          meta: {
            isDraft,
            publishedOn,
            updatedOn: updatedOn ?? publishedOn,
          },
        };
      }),
});

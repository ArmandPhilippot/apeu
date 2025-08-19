import { defineCollection } from "astro:content";
import { globLoader } from "../loaders";
import { contentsBaseSchema, i18nSchema } from "./partials";

export const tags = defineCollection({
  loader: globLoader("tags"),
  schema: ({ image }) =>
    contentsBaseSchema(image)
      .extend({
        i18n: i18nSchema("tags").optional(),
      })
      .transform(({ isDraft, publishedOn, updatedOn, ...tag }) => {
        return {
          ...tag,
          meta: {
            isDraft,
            publishedOn,
            updatedOn: updatedOn ?? publishedOn,
          },
        };
      }),
});

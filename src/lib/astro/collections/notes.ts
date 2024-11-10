import { defineCollection, reference, z } from "astro:content";
import { globLoader } from "../loaders/glob-loader";
import { contentsBaseSchema } from "./utils";

export const notes = defineCollection({
  loader: globLoader("notes"),
  schema: contentsBaseSchema
    .extend({
      tags: z.array(reference("tags")).optional(),
    })
    .transform(({ isDraft, publishedOn, tags, updatedOn, ...note }) => {
      return {
        ...note,
        meta: {
          isDraft,
          publishedOn,
          tags,
          updatedOn: updatedOn ?? publishedOn,
        },
      };
    }),
});

import { defineCollection } from "astro:content";
import { globLoader } from "../loaders/glob-loader";
import { contentsBaseSchema } from "./utils";

export const notes = defineCollection({
  loader: globLoader("notes"),
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

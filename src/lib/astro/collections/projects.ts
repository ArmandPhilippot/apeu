import { defineCollection, z } from "astro:content";
import { globLoader } from "../loaders/glob-loader";
import { contentsBaseSchema } from "./utils";

export const projects = defineCollection({
  loader: globLoader("projects"),
  schema: ({ image }) =>
    contentsBaseSchema
      .extend({
        cover: z
          .object({
            alt: z.string(),
            src: image(),
          })
          .optional(),
        kind: z.union([
          z.literal("app"),
          z.literal("site"),
          z.literal("theme"),
        ]),
        repository: z.string().url().optional(),
      })
      .transform(
        ({ isDraft, kind, publishedOn, repository, updatedOn, ...note }) => {
          return {
            ...note,
            meta: {
              isDraft,
              kind,
              publishedOn,
              repository,
              updatedOn: updatedOn ?? publishedOn,
            },
          };
        },
      ),
});

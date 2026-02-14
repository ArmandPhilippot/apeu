import { z } from "astro/zod";
import { defineCollection } from "astro:content";
import {
  isString,
  isValidCountryCode,
  isValidLanguageCode,
} from "../../../utils/type-guards";
import { globLoader } from "../loaders";

export const authors = defineCollection({
  loader: globLoader("authors"),
  schema: ({ image }) =>
    z
      .object({
        avatar: image().optional(),
        email: z.email().optional(),
        firstName: z.string(),
        firstNameIPA: z.string().optional(),
        lastName: z.string(),
        lastNameIPA: z.string().optional(),
        website: z.url().optional(),
        isWebsiteOwner: z.boolean().optional().default(false),
        job: z.string().optional(),
        country: z
          .string()
          /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
          .length(2)
          .toUpperCase()
          .refine(isValidCountryCode)
          .optional(),
        nationality: z
          .string()
          /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
          .length(2)
          .toUpperCase()
          .refine(isValidCountryCode)
          .optional(),
        spokenLanguages: z
          .array(z.string().refine(isValidLanguageCode))
          .optional(),
        socialMedia: z
          .object({
            bluesky: z.url().optional(),
            diaspora: z.url().optional(),
            email: z.url().optional(),
            facebook: z.url().optional(),
            github: z.url().optional(),
            gitlab: z.url().optional(),
            linkedin: z.url().optional(),
            mastodon: z.url().optional(),
            reddit: z.url().optional(),
            stackoverflow: z.url().optional(),
            whatsapp: z.url().optional(),
            x: z.url().optional(),
          })
          .optional(),
      })
      .transform((author) => {
        return {
          ...author,
          // `<Image />` component expect the src to be the full object.
          ...(author.avatar === undefined
            ? {}
            : { avatar: { src: author.avatar } }),
          name: `${author.firstName} ${author.lastName}`,
          ...(isString(author.firstNameIPA) && isString(author.lastNameIPA)
            ? { nameIPA: `${author.firstNameIPA} ${author.lastNameIPA}` }
            : {}),
        };
      }),
});

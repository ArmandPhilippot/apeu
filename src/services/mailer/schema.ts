import { z } from "astro/zod";
import { zfd } from "zod-form-data";

/* eslint-disable @typescript-eslint/no-magic-numbers -- Self-explanatory in a Zod schema */
export const mailData = zfd.formData({
  name: zfd.text(z.string().min(2)),
  email: zfd.text(z.email().min(6)),
  object: zfd.text(z.string().min(2).optional()),
  message: zfd.text(z.string().min(5)),
});
/* eslint-enable @typescript-eslint/no-magic-numbers */

export type MailDataSchema = z.infer<typeof mailData>;

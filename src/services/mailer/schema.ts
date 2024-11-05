import { z } from "astro:schema";
import { zfd } from "zod-form-data";

export const mailData = zfd.formData({
  name: zfd.text(z.string().min(2)),
  email: zfd.text(z.string().email().min(6)),
  object: zfd.text(z.string().min(2).optional()),
  message: zfd.text(z.string().min(5)),
});

export type MailDataSchema = z.infer<typeof mailData>;

import {
  SMTP_HOST,
  SMTP_PASSWORD,
  SMTP_PORT,
  SMTP_USER,
} from "astro:env/server";
import { createTransport, type Transporter } from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";

/**
 * Create an SMTP transporter using Nodemailer.
 *
 * @returns {Transporter<SMTPTransport.SentMessageInfo, SMTPTransport.Options>} The NodeMailer transporter.
 */
export const createSMTPTransporter = (): Transporter<
  SMTPTransport.SentMessageInfo,
  SMTPTransport.Options
> => {
  const SECURE_PORT = 465;

  const transporter = createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    /* The secure option should only be `true` with port `465`, so it should be
     * safe to set the option by checking the port */
    secure: SMTP_PORT === SECURE_PORT,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASSWORD,
    },
    connectionTimeout: 10_000,
    socketTimeout: 10_000,
  });

  return transporter;
};

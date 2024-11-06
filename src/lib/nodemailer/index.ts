import nodemailer, { type Transporter } from "nodemailer";
import type { Options } from "nodemailer/lib/smtp-connection";

/**
 * Retrieve the SMTP options from environment variables.
 *
 * @returns {Options} The SMTP options
 */
const getSMTPOptionsFromEnv = (): Options => {
  return {
    host: import.meta.env.SMTP_HOST,
    port: import.meta.env.SMTP_PORT,
    /* The secure option should only be `true` with port `465`, so it should be
     * safe to set the option by checking the port */
    secure: import.meta.env.SMTP_PORT === 465,
    auth: {
      user: import.meta.env.SMTP_USER,
      pass: import.meta.env.SMTP_PASSWORD,
    },
  };
};

/**
 * Create an SMTP transporter using Nodemailer.
 *
 * @returns {SentMessageInfo} The transporter.
 */
export const createSMTPTransporter = (): Transporter => {
  const config = getSMTPOptionsFromEnv();
  const transporter = nodemailer.createTransport(config);

  return transporter;
};

import nodemailer, { type Transporter } from "nodemailer";
import type { Options } from "nodemailer/lib/smtp-connection";

/**
 * Retrieve the SMTP options from environment variables.
 *
 * @returns {Options} The SMTP options
 */
const getSMTPOptionsFromEnv = (): Options => {
  const port = Number(process.env.SMTP_PORT);

  return {
    host: process.env.SMTP_HOST,
    port,
    /* The secure option should only be `true` with port `465`, so it should be
     * safe to set the option by checking the port */
    secure: port === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
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
  const transporter = nodemailer.createTransport({
    ...config,
    connectionTimeout: 10000,
    socketTimeout: 10000,
  });

  return transporter;
};

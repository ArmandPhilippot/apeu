import { createTransport, type Transporter } from "nodemailer";
import type { Options } from "nodemailer/lib/smtp-connection";
import type SMTPTransport from "nodemailer/lib/smtp-transport";

const SECURE_PORT = 465;

/**
 * Retrieve the SMTP options from environment variables.
 *
 * @returns {Options} The SMTP options.
 */
const getSMTPOptionsFromEnv = (): Options => {
  const port = Number(process.env.SMTP_PORT);

  return {
    host: process.env.SMTP_HOST,
    port,
    /* The secure option should only be `true` with port `465`, so it should be
     * safe to set the option by checking the port */
    secure: port === SECURE_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  };
};

/**
 * Create an SMTP transporter using Nodemailer.
 *
 * @returns {Transporter<SMTPTransport.SentMessageInfo, SMTPTransport.Options>} The NodeMailer transporter.
 */
export const createSMTPTransporter = (): Transporter<
  SMTPTransport.SentMessageInfo,
  SMTPTransport.Options
> => {
  const config = getSMTPOptionsFromEnv();
  const transporter = createTransport({
    ...config,
    connectionTimeout: 10_000,
    socketTimeout: 10_000,
  });

  return transporter;
};

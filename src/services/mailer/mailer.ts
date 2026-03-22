import { CONTACT_EMAIL } from "astro:env/server";
import type SMTPTransport from "nodemailer/lib/smtp-transport";
import { createSMTPTransporter } from "../../lib/nodemailer";
import { CONFIG } from "../../utils/constants";
import type { MailDataSchema } from "./schema";

/**
 * Send an email using an SMTP transporter.
 *
 * @param {MailDataSchema} data - The data to send.
 * @returns {Promise<SMTPTransport.SentMessageInfo>} The transporter response.
 */
export const sendMail = async ({
  email,
  message,
  name: sender,
  object,
}: MailDataSchema): Promise<SMTPTransport.SentMessageInfo> => {
  const transporter = createSMTPTransporter();

  transporter.verify((error) => {
    if (error === null) {
      console.log("SMTP server is ready to accept messages");
    } else {
      console.error("SMTP connection error:", error);
    }
  });

  return transporter.sendMail({
    from: { address: CONTACT_EMAIL, name: CONFIG.BRAND },
    to: CONTACT_EMAIL,
    replyTo: { address: email, name: sender },
    subject: `[${CONFIG.HOST}] ${object}`,
    text: message,
  });
};

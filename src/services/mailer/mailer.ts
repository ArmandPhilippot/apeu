import type SMTPTransport from "nodemailer/lib/smtp-transport";
import { createSMTPTransporter } from "../../lib/nodemailer";
import { CONFIG } from "../../utils/constants";
import { isString } from "../../utils/type-checks";
import type { MailDataSchema } from "./schema";

const getRecipientFromEnv = () => {
  const recipient = process.env.CONTACT_EMAIL;

  if (!isString(recipient)) {
    throw new Error("Mailer is misconfigured: contact's email missing.");
  }

  return recipient;
};

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
  const recipient = getRecipientFromEnv();
  const transporter = createSMTPTransporter();

  transporter.verify((error) => {
    if (error === null) {
      console.log("SMTP server is ready to accept messages");
    } else {
      console.error("SMTP connection error:", error);
    }
  });

  return transporter.sendMail({
    from: { address: recipient, name: CONFIG.BRAND },
    to: recipient,
    replyTo: { address: email, name: sender },
    subject: `[${CONFIG.HOST}] ${object}`,
    text: message,
  });
};

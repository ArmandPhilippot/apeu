import { createSMTPTransporter } from "../../lib/nodemailer";
import { CONFIG } from "../../utils/constants";
import { isString } from "../../utils/type-checks";
import type { MailDataSchema } from "./schema";

const getRecipientFromEnv = () => {
  const recipient = import.meta.env.CONTACT_EMAIL;

  if (!isString(recipient))
    throw new Error("Mailer is misconfigured: contact's email missing.");

  return recipient;
};

export const sendMail = async ({
  email,
  message,
  name,
  object,
}: MailDataSchema) => {
  const transporter = createSMTPTransporter();
  const recipient = getRecipientFromEnv();

  return transporter.sendMail({
    from: { address: recipient, name: CONFIG.BRAND },
    to: recipient,
    replyTo: { address: email, name },
    subject: `[${CONFIG.HOST}] ${object}`,
    text: message,
  });
};

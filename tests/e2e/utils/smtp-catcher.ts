import { createServer } from "node:http";
import { simpleParser, type AddressObject } from "mailparser";
import { SMTPServer, type SMTPServerSession } from "smtp-server";
import {
  SMTP_CATCHER_CONTROL_PORT,
  SMTP_CATCHER_HOST,
  SMTP_CATCHER_SMTP_PORT,
} from "./smtp-catcher-config.ts";

export type CaughtMessage = {
  from: string | null;
  replyTo: string | null;
  subject: string | null;
  text: string | null;
  to: string | string[] | null;
};

const HTTP_OK = 200;
const HTTP_NO_CONTENT = 204;
const HTTP_NOT_FOUND = 404;

let messages: CaughtMessage[] = [];

const singleAddressText = (address: AddressObject | undefined): string | null =>
  address?.text ?? null;

const addressListText = (
  address: AddressObject | AddressObject[] | undefined
): string | string[] | null => {
  if (address === undefined) return null;

  return Array.isArray(address)
    ? address.map((entry) => entry.text)
    : address.text;
};

const smtpServer = new SMTPServer({
  authOptional: true,
  /* Nodemailer only attempts AUTH/STARTTLS when the server advertises them
   * in its EHLO response, so disabling both here keeps the session a plain,
   * unauthenticated exchange without needing a matching onAuth handler or a
   * TLS certificate. */
  disabledCommands: ["AUTH", "STARTTLS"],
  onData(stream, _session: SMTPServerSession, callback) {
    simpleParser(stream)
      .then((parsed) => {
        messages.push({
          from: singleAddressText(parsed.from),
          replyTo: singleAddressText(parsed.replyTo),
          subject: parsed.subject ?? null,
          text: parsed.text ?? null,
          to: addressListText(parsed.to),
        });
        callback();
      })
      .catch(callback);
  },
});

const controlServer = createServer((req, res) => {
  if (req.method === "GET" && req.url === "/messages") {
    res.writeHead(HTTP_OK, { "content-type": "application/json" });
    res.end(JSON.stringify(messages));
    return;
  }

  if (req.method === "POST" && req.url === "/reset") {
    messages = [];
    res.writeHead(HTTP_NO_CONTENT);
    res.end();
    return;
  }

  res.writeHead(HTTP_NOT_FOUND);
  res.end();
});

smtpServer.listen(SMTP_CATCHER_SMTP_PORT, SMTP_CATCHER_HOST, () => {
  controlServer.listen(SMTP_CATCHER_CONTROL_PORT, SMTP_CATCHER_HOST, () => {
    console.log(
      `SMTP catcher ready (smtp: ${SMTP_CATCHER_SMTP_PORT}, control: ${SMTP_CATCHER_CONTROL_PORT})`
    );
  });
});

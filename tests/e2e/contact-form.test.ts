import { randomUUID } from "node:crypto";
import { expect, test, type APIRequestContext } from "@playwright/test";
import { SMTP_CATCHER_CONTROL_URL } from "./utils/smtp-catcher-config.ts";
import type { CaughtMessage } from "./utils/smtp-catcher.ts";

/**
 * Poll the SMTP catcher until a message matching `predicate` shows up.
 *
 * Delivery happens asynchronously relative to the API response, and the
 * catcher is shared across parallel workers, so tests must find their own
 * message rather than assuming the array holds only their own.
 *
 * @param {APIRequestContext} request - The Playwright request context used to query the catcher.
 * @param {(message: CaughtMessage) => boolean} predicate - Identifies the message that belongs to the caller.
 * @returns {Promise<CaughtMessage>} The matching caught message.
 */
const findCaughtMessage = async (
  request: APIRequestContext,
  predicate: (message: CaughtMessage) => boolean
): Promise<CaughtMessage> => {
  const fetchMessages = async (): Promise<CaughtMessage[]> => {
    const response = await request.get(`${SMTP_CATCHER_CONTROL_URL}/messages`);

    return (await response.json()) as CaughtMessage[];
  };

  await expect(async () => {
    const messages = await fetchMessages();

    expect(messages.some(predicate)).toBe(true);
  }).toPass({ timeout: 10_000 });

  const messages = await fetchMessages();
  const found = messages.find(predicate);

  if (found === undefined) {
    throw new Error("Timed out waiting for the contact email to be caught.");
  }

  return found;
};

test("submitting the contact form delivers the message through the real API and SMTP pipeline", async ({
  page,
  request,
}) => {
  const nonce = randomUUID();
  const email = "e2e-tester@example.test";
  const message = `Hello from the contact form E2E test (${nonce}).`;

  await page.goto("/en/contact");

  await page.getByLabel("Name").fill("E2E Tester");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Object").fill(nonce);
  await page.getByLabel("Message").fill(message);
  await page.getByRole("button", { name: "Send email" }).click();

  await expect(page.getByRole("alert")).toContainText(/./);

  const caught = await findCaughtMessage(request, (caughtMessage) =>
    Boolean(caughtMessage.subject?.includes(nonce))
  );

  expect(caught.replyTo).toContain(email);
  expect(caught.text?.trim()).toBe(message);
});

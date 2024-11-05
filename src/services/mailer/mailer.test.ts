import { describe, expect, it, vi } from "vitest";
import { sendMail } from "./mailer";

describe("send-mail", () => {
  it("throws when the contact email is not defined", async () => {
    vi.stubEnv("CONTACT_EMAIL", undefined);
    const data = {
      name: "John",
      email: "john@doe.test",
      message: "enim dolor distinctio",
    };

    expect.assertions(1);

    await expect(async () =>
      sendMail(data),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `[Error: Mailer is misconfigured: contact's email missing.]`,
    );
  });
});

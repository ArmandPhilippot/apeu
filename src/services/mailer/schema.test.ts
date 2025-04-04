import { describe, expect, it } from "vitest";
import { mailData } from "./schema";

describe("mailData", () => {
  it("returns the proper form data", () => {
    const formData = {
      name: "John",
      email: "john@doe.test",
      message: "Quam aut molestiae veniam quisquam sit voluptatem qui sint.",
    };

    const data = mailData.parse(formData);

    expect(data.email).toBe(formData.email);
    expect(data.message).toBe(formData.message);
    expect(data.name).toBe(formData.name);
  });

  it("throws on invalid data", () => {
    /* eslint-disable-next-line vitest/require-to-throw-message -- We don't control the message so there is difference while running vitest alone or with coverage */
    expect(() => mailData.parse("invalid-data")).toThrowError();
  });
});

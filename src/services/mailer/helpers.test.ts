import { describe, expect, it } from "vitest";
import { isMailError, isMailSuccess } from "./helpers";

describe("is-mail-error", () => {
  it("returns false when data is not an object", () => {
    expect(isMailError([])).toBe(false);
  });

  it("returns false when data is an object without an error key", () => {
    expect(isMailError({ foo: "bar" })).toBe(false);
  });

  it("returns false when data is an object with an error key that is not an object", () => {
    expect(isMailError({ error: "foo" })).toBe(false);
  });

  it("returns false when data is an object with an error key that does not contain a formErrors key", () => {
    expect(isMailError({ error: { foo: "bar" } })).toBe(false);
  });

  it("returns false when data is an object with an error key that contains a formErrors key which is not an array", () => {
    expect(isMailError({ error: { formErrors: "foo" } })).toBe(false);
  });

  it("returns true when data shape matches MailError type", () => {
    expect(isMailError({ error: { formErrors: [] } })).toBe(true);
  });
});

describe("is-mail-success", () => {
  it("returns false when data is not an object", () => {
    expect(isMailSuccess([])).toBe(false);
  });

  it("returns false when data is an object without message key", () => {
    expect(isMailSuccess({ foo: "bar" })).toBe(false);
  });

  it("returns false when data is an object with a message key that is not a string", () => {
    expect(isMailSuccess({ message: [] })).toBe(false);
  });

  it("returns true when data is an object with a message key that is a string", () => {
    expect(isMailSuccess({ message: "foo" })).toBe(true);
  });
});

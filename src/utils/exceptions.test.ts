import { describe, expect, it } from "vitest";
import {
  InvalidAnchorFormatError,
  InvalidPropsError,
  MissingSiteConfigError,
  MissingSlotError,
  UnsupportedLocaleError,
} from "./exceptions";

describe("InvalidAnchorFormatError", () => {
  it("returns an Error instance", () => {
    const propName = "natus";
    const currentValue = "something";
    const exception = new InvalidAnchorFormatError(propName, currentValue);

    expect(exception instanceof Error).toBe(true);
    expect(exception.message).toBe(
      `The "${propName}" property should be a valid anchor starting with "#". Received: ${currentValue}`
    );
  });
});

describe("InvalidPropsError", () => {
  it("returns an Error instance", () => {
    const error = "natus";
    const exception = new InvalidPropsError(error);

    expect(exception instanceof Error).toBe(true);
    expect(exception.message).toContain(error);
  });
});

describe("MissingSiteConfigError", () => {
  it("returns an Error instance", () => {
    const exception = new MissingSiteConfigError();

    expect(exception instanceof Error).toBe(true);
    expect(exception.message).toContain("`site`");
  });
});

describe("MissingSlotError", () => {
  it("returns an Error instance", () => {
    const slot = "natus";
    const exception = new MissingSlotError(slot);

    expect(exception instanceof Error).toBe(true);
    expect(exception.message).toContain(slot);
  });
});

describe("UnsupportedLocaleError", () => {
  it("returns an Error instance", () => {
    const locale = "natus";
    const exception = new UnsupportedLocaleError(locale);

    expect(exception instanceof Error).toBe(true);
    expect(exception.message).toContain(locale);
  });
});

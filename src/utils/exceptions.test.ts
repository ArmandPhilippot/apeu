import { describe, expect, it } from "vitest";
import {
  MissingSiteConfigError,
  MissingSlotError,
  UnsupportedLocaleError,
} from "./exceptions";

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

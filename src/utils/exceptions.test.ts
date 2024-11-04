import { describe, expect, it } from "vitest";
import { MissingSlotError } from "./exceptions";

describe("MissingSlotError", () => {
  it("returns an Error instance", () => {
    const slot = "natus";
    const exception = new MissingSlotError(slot);

    expect(exception instanceof Error).toBe(true);
    expect(exception.message).toContain(slot);
  });
});

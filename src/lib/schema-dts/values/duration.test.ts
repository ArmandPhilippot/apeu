import { describe, expect, it } from "vitest";
import { getDurationFromReadingTime } from "./duration";

describe("get-duration-from-reading-time", () => {
  it("returns a formatted duration from a reading time", () => {
    const duration = getDurationFromReadingTime({ minutes: 3, seconds: 20 });

    expect(duration).toMatchInlineSnapshot(`"PT3M20S"`);
  });
});

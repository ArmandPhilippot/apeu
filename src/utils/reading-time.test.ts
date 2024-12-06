import { describe, expect, it } from "vitest";
import { getReadingTime } from "./reading-time";

describe("get-reading-time", () => {
  it("can transform a words count into a reading time object", () => {
    const wordsCount = 250;
    const result = getReadingTime(wordsCount, "en");

    expect(result.wordsCount).toBe(wordsCount);
    expect(result).toMatchInlineSnapshot(`
      {
        "inMinutes": 1,
        "inMinutesAndSeconds": {
          "minutes": 1,
          "seconds": 6,
        },
        "wordsCount": 250,
        "wordsPerMinute": 228,
      }
    `);
  });
});

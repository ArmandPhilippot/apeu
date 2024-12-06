import type { Duration } from "schema-dts";
import type { ReadingTime } from "../../../types/data";

export const getDurationFromReadingTime = (
  readingTime: ReadingTime["inMinutesAndSeconds"],
): Duration => `PT${readingTime.minutes}M${readingTime.seconds}S`;

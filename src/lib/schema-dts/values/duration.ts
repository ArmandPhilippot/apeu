import type { Duration } from "schema-dts";
import type { ReadingTime } from "../../../types/data";

/**
 * Convert a reading time object to an ISO 8601 duration format.
 *
 * @param {ReadingTime["inMinutesAndSeconds"]} readingTime - The reading time in minutes and seconds.
 * @returns {Duration} The reading time using ISO 8601 duration format.
 */
export const getDurationFromReadingTime = (
  readingTime: ReadingTime["inMinutesAndSeconds"]
): Duration => `PT${readingTime.minutes}M${readingTime.seconds}S`;

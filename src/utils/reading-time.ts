import type { ReadingTime } from "../types/data";
import type { AvailableLanguage } from "../types/tokens";
import { WORDS_PER_MINUTE } from "./constants";
import { toUpperCase } from "./strings";

/**
 * Retrieve the reading time rounded in minutes and seconds.
 *
 * @param {number} wordsCount - The number of words.
 * @param {number} wordsPerMinute - The reading fluency.
 * @returns {{minutes: number, seconds: number}} The reading time as object.
 */
const getReadingTimeInMinutesAndSeconds = (
  wordsCount: number,
  wordsPerMinute: number
): { minutes: number; seconds: number } => {
  const oneMinuteInSeconds = 60;
  const wordsPerSecond = wordsPerMinute / oneMinuteInSeconds;
  const estimatedTimeInSeconds = wordsCount / wordsPerSecond;
  const estimatedTimeInMinutes = Math.floor(
    estimatedTimeInSeconds / oneMinuteInSeconds
  );

  return {
    minutes: estimatedTimeInMinutes,
    seconds: Math.round(
      estimatedTimeInSeconds - estimatedTimeInMinutes * oneMinuteInSeconds
    ),
  };
};

const twoDecimals = 2;

/**
 * Retrieve the reading time rounded in minutes.
 *
 * @param {number} wordsCount - The number of words.
 * @param {number} wordsPerMinute - The reading fluency.
 * @returns {number} A number representing the reading time in minutes.
 */
const getReadingTimeInMinutes = (
  wordsCount: number,
  wordsPerMinute: number
): number =>
  Math.round(
    Number.parseFloat((wordsCount / wordsPerMinute).toFixed(twoDecimals))
  );

/**
 * Retrieve the reading time depending on a words count.
 *
 * @template T - Should the seconds be included?
 * @param {number} wordsCount - The number of words.
 * @param {AvailableLanguage} locale - The current language.
 * @returns {ReadingTime} A detailed reading time object.
 */
export const getReadingTime = (
  wordsCount: number,
  locale: AvailableLanguage
): ReadingTime => {
  const wordsPerMinute = WORDS_PER_MINUTE[toUpperCase(locale)];

  return {
    inMinutes: getReadingTimeInMinutes(wordsCount, wordsPerMinute),
    inMinutesAndSeconds: getReadingTimeInMinutesAndSeconds(
      wordsCount,
      wordsPerMinute
    ),
    wordsCount,
    wordsPerMinute,
  };
};

import type { ReadingTime } from "../types/data";
import { WORDS_PER_MINUTE } from "./constants";
import type { AvailableLanguage } from "./i18n";
import { toUpperCase } from "./strings";

/**
 * Retrieve the reading time rounded in minutes and seconds.
 *
 * @param {number} wordsCount - The number of words.
 * @param {number} wordsPerMinute - The reading fluency.
 * @returns The reading time.
 */
const getReadingTimeInMinutesAndSeconds = (
  wordsCount: number,
  wordsPerMinute: number,
) => {
  const oneMinuteInSeconds = 60;
  const wordsPerSecond = wordsPerMinute / oneMinuteInSeconds;
  const estimatedTimeInSeconds = wordsCount / wordsPerSecond;
  const estimatedTimeInMinutes = Math.floor(
    estimatedTimeInSeconds / oneMinuteInSeconds,
  );

  return {
    minutes: estimatedTimeInMinutes,
    seconds: Math.round(
      estimatedTimeInSeconds - estimatedTimeInMinutes * oneMinuteInSeconds,
    ),
  };
};

/**
 * Retrieve the reading time rounded in minutes.
 *
 * @param {number} wordsCount - The number of words.
 * @param {number} wordsPerMinute - The reading fluency.
 * @returns {number} The reading time.
 */
const getReadingTimeInMinutes = (
  wordsCount: number,
  wordsPerMinute: number,
): number => Math.round(parseFloat((wordsCount / wordsPerMinute).toFixed(2)));

/**
 * Retrieve the reading time depending on a words count.
 *
 * @template T - Should the seconds be included?
 * @param {number} wordsCount - The number of words.
 * @param {AvailableLanguage} locale - The current language.
 * @returns {ReadingTime} The reading time.
 */
export const getReadingTime = (
  wordsCount: number,
  locale: AvailableLanguage,
): ReadingTime => {
  const wordsPerMinute = WORDS_PER_MINUTE[toUpperCase(locale)];

  return {
    inMinutes: getReadingTimeInMinutes(wordsCount, wordsPerMinute),
    inMinutesAndSeconds: getReadingTimeInMinutesAndSeconds(
      wordsCount,
      wordsPerMinute,
    ),
    wordsCount,
    wordsPerMinute,
  };
};

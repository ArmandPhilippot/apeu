type GMTOffsetOptions = {
  lang: string;
  timezone: string;
};

/**
 * Retrieve the GMT offset for a date based on the timezone and the lang.
 *
 * @param {Date} date - The date to use to retrieve the offset.
 * @param {GMTOffsetOptions} options - The offset options.
 * @returns {number} The offset in hours.
 * @throws {Error} When the GMT can't be determined or when the format is invalid.
 */
export const getGMTOffset = (
  date: Date,
  { lang, timezone }: GMTOffsetOptions
): number => {
  const formatter = new Intl.DateTimeFormat(lang, {
    timeZone: timezone,
    timeZoneName: "shortOffset",
  });
  const parts = formatter.formatToParts(date);
  const offsetPart = parts.find((part) => part.type === "timeZoneName");

  if (offsetPart?.value === undefined || offsetPart.value === "") {
    throw new Error(`Unable to determine GMT offset for timezone: ${timezone}`);
  }

  // Match offsets like "GMT+2", "UTC+2", or "Etc/GMT+2"
  const match = /(?:GMT|UTC|Etc\/GMT)(?<offset>[+-]\d+)/.exec(offsetPart.value);

  if (match?.groups?.offset === undefined) {
    throw new Error(`Unexpected offset format: ${offsetPart.value}`);
  }

  const offsetInHours = Number.parseInt(match.groups.offset, 10);

  return offsetInHours;
};

const MILLISECONDS_PER_SECOND = 1000;
const SECONDS_PER_MINUTE = 60;
const MINUTES_PER_HOUR = 60;
const MILLISECONDS_PER_HOUR =
  MINUTES_PER_HOUR * SECONDS_PER_MINUTE * MILLISECONDS_PER_SECOND;

/**
 * Apply a timezone to a Date.
 *
 * @param {Date} date - The date to update.
 * @param {GMTOffsetOptions} options - The offset options.
 * @returns {Date} The updated date.
 */
export const applyTimezone = (date: Date, options: GMTOffsetOptions): Date => {
  const gmtOffset = getGMTOffset(date, options);
  return new Date(date.getTime() + gmtOffset * MILLISECONDS_PER_HOUR);
};

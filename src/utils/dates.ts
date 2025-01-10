type GMTOffsetOptions = {
  lang: string;
  timezone: string;
};

export const getGMTOffset = (
  date: Date,
  { lang, timezone }: GMTOffsetOptions,
): number => {
  const formatter = new Intl.DateTimeFormat(lang, {
    timeZone: timezone,
    timeZoneName: "shortOffset",
  });
  const parts = formatter.formatToParts(date);
  const offsetPart = parts.find((part) => part.type === "timeZoneName");

  if (!offsetPart || !offsetPart.value) {
    throw new Error(`Unable to determine GMT offset for timezone: ${timezone}`);
  }

  // Match offsets like "GMT+2", "UTC+2", or "Etc/GMT+2"
  const match = offsetPart.value.match(/(?:GMT|UTC|Etc\/GMT)([+-]\d+)/);

  if (!match || !match[1]) {
    throw new Error(`Unexpected offset format: ${offsetPart.value}`);
  }

  const offsetInHours = parseInt(match[1], 10);

  return offsetInHours;
};

export const applyTimezone = (date: Date, options: GMTOffsetOptions): Date => {
  const gmtOffset = getGMTOffset(date, options);
  return new Date(date.getTime() + gmtOffset * 60 * 60 * 1000);
};

import { describe, expect, it, vi } from "vitest";
import { applyTimezone, getGMTOffset } from "./dates";

describe("getGMTOffset", () => {
  it("returns correct offset for Europe/Paris in winter with en-US", () => {
    const date = new Date("2025-01-07T13:40:00Z");
    const offset = getGMTOffset(date, {
      lang: "en-US",
      timezone: "Europe/Paris",
    });
    expect(offset).toBe(1); // GMT+1 in winter
  });

  it("returns correct offset for Europe/Paris in winter with UTC offset", () => {
    const date = new Date("2025-01-07T13:40:00Z");
    const offset = getGMTOffset(date, {
      lang: "fr-FR",
      timezone: "Europe/Paris",
    });
    expect(offset).toBe(1); // GMT+1 in winter
  });

  it("returns correct offset for Europe/Paris in summer with fr-FR", () => {
    const date = new Date("2025-07-07T13:40:00Z");
    const offset = getGMTOffset(date, {
      lang: "fr-FR",
      timezone: "Europe/Paris",
    });
    expect(offset).toBe(2); // GMT+2 in summer
  });

  it("throws an error when offsetPart is missing", () => {
    const formatterMock = vi.spyOn(
      Intl.DateTimeFormat.prototype,
      "formatToParts",
    );
    // Mock implementation returning an empty array (no timeZoneName part)
    formatterMock.mockImplementationOnce(() => [
      { type: "literal", value: "something" },
    ]);

    const date = new Date("2025-01-07T13:40:00Z");
    expect(() =>
      getGMTOffset(date, { lang: "en-US", timezone: "Europe/Paris" }),
    ).toThrowError("Unable to determine GMT offset for timezone: Europe/Paris");

    formatterMock.mockRestore();
  });

  it("throws an error when offsetPart value is empty", () => {
    const formatterMock = vi.spyOn(
      Intl.DateTimeFormat.prototype,
      "formatToParts",
    );
    // Mock implementation returning timeZoneName part with empty value
    formatterMock.mockImplementationOnce(() => [
      { type: "timeZoneName", value: "" },
    ]);

    const date = new Date("2025-01-07T13:40:00Z");
    expect(() =>
      getGMTOffset(date, { lang: "en-US", timezone: "Europe/Paris" }),
    ).toThrowError("Unable to determine GMT offset for timezone: Europe/Paris");

    formatterMock.mockRestore();
  });

  it("throws an error for unexpected offset format", () => {
    const formatterMock = vi.spyOn(
      Intl.DateTimeFormat.prototype,
      "formatToParts",
    );
    formatterMock.mockImplementationOnce(() => [
      { type: "timeZoneName", value: "InvalidOffset" },
    ]);

    const date = new Date("2025-01-07T13:40:00Z");
    expect(() =>
      getGMTOffset(date, { lang: "en-US", timezone: "Europe/Paris" }),
    ).toThrowError("Unexpected offset format: InvalidOffset");

    formatterMock.mockRestore();
  });
});

describe("applyTimezone", () => {
  it("correctly adjusts time to Europe/Paris winter time with en-US", () => {
    const date = new Date("2025-01-07T13:40:00Z");
    const adjustedDate = applyTimezone(date, {
      lang: "en-US",
      timezone: "Europe/Paris",
    });
    expect(adjustedDate.toISOString()).toBe("2025-01-07T14:40:00.000Z"); // Adjusted to GMT+1
  });

  it("correctly adjusts time to Europe/Paris summer time with fr-FR", () => {
    const date = new Date("2025-07-07T13:40:00Z");
    const adjustedDate = applyTimezone(date, {
      lang: "fr-FR",
      timezone: "Europe/Paris",
    });
    expect(adjustedDate.toISOString()).toBe("2025-07-07T15:40:00.000Z"); // Adjusted to GMT+2
  });
});

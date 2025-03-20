/**
 * Represent an invalid props error.
 *
 * @augments Error
 * @class
 */
export class InvalidPropsError extends Error {
  /**
   * Create a new InvalidPropsError error.
   *
   * @param {string} err - A message indicating the invalid properties.
   */
  constructor(err: string) {
    super(err);
    this.name = "InvalidPropsError";
  }
}

/**
 * Represent an error when the `site` property is missing in Astro's config.
 *
 * @augments Error
 * @class
 */
export class MissingSiteConfigError extends Error {
  /**
   * Create a new MissingSiteConfigError error.
   */
  constructor() {
    super(
      "You must define the `site` property in your `astro.config.ts` configuration file."
    );
    this.name = "MissingSiteConfigError";
  }
}

/**
 * Represent an error when a required slot is missing.
 *
 * @augments Error
 * @class
 */
export class MissingSlotError extends Error {
  /**
   * Create a new MissingSlotError error.
   *
   * @param {string} slot - The slot name.
   */
  constructor(slot: string) {
    super(`A ${slot} slot is required.`);
    this.name = "MissingSlotError";
  }
}

/**
 * Represent an error when an unsupported locale is received.
 *
 * @augments Error
 * @class
 */
export class UnsupportedLocaleError extends Error {
  /**
   * Create a new UnsupportedLocaleError error.
   *
   * @param {string} locale - The received locale.
   */
  constructor(locale: string) {
    super(`Unsupported locale, received: ${locale}.`);
    this.name = "UnsupportedLocaleError";
  }
}

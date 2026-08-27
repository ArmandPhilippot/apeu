type InvalidAnchorFormatErrorOptions = ErrorOptions & {
  currentValue: unknown;
};

/**
 * Represents an invalid anchor format error.
 *
 * @augments Error
 * @class
 */
export class InvalidAnchorFormatError extends Error {
  /**
   * Create a new InvalidAnchorFormatError error.
   *
   * @param {string} propName - The name of the invalid property.
   * @param {InvalidAnchorFormatErrorOptions} options - Additional error options.
   */
  constructor(propName: string, options: InvalidAnchorFormatErrorOptions) {
    const err = `The "${propName}" property should be a valid anchor starting with "#". Received: ${String(options.currentValue)}`;
    super(err, options);
    this.name = "InvalidAnchorFormatError";
  }
}

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
   * @param {ErrorOptions} [options] - Additional error options.
   */
  constructor(err: string, options?: ErrorOptions) {
    super(err, options);
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
   * @param {ErrorOptions} [options] - Additional error options.
   */
  constructor(slot: string, options?: ErrorOptions) {
    super(`A ${slot} slot is required.`, options);
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
   * @param {ErrorOptions} [options] - Additional error options.
   */
  constructor(locale: string, options?: ErrorOptions) {
    super(`Unsupported locale, received: ${locale}.`, options);
    this.name = "UnsupportedLocaleError";
  }
}

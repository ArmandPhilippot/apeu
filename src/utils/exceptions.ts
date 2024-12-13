export class InvalidProps extends Error {
  constructor(err: string) {
    super(`Invalid properties: ${err}`);
  }
}

export class MissingSiteConfigError extends Error {
  constructor() {
    super(
      "You must define the `site` property in your `astro.config.ts` configuration file.",
    );
  }
}

export class MissingSlotError extends Error {
  constructor(slot: string) {
    super(`A ${slot} slot is required.`);
  }
}

export class UnsupportedLocaleError extends Error {
  constructor(locale: string) {
    super(`Unsupported locale, received: ${locale}.`);
  }
}

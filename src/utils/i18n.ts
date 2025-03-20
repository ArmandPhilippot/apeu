import { translations } from "../translations";
import type { KeyOfType, LooseAutocomplete } from "../types/utilities";
import { CONFIG } from "./constants";
import { isString } from "./type-checks";

export type AvailableLanguage = keyof typeof translations;

export const availableNamedLanguages = {
  en: "English",
  fr: "Français",
} as const satisfies Record<AvailableLanguage, string>;

type I18nMessages = (typeof translations)[typeof CONFIG.LANGUAGES.DEFAULT];

/**
 * Check if the given language is an available language.
 *
 * @param {string} language - The language to validate.
 * @returns {boolean} True if it is a valid language.
 */
export const isAvailableLanguage = (
  language: string
): language is AvailableLanguage =>
  Object.keys(translations).includes(language);

/**
 * Check if the given language is the default one.
 *
 * @param {string} language - A locale.
 * @returns {boolean} True if it is the default language.
 */
export const isDefaultLanguage = (
  language: string
): language is typeof CONFIG.LANGUAGES.DEFAULT =>
  language === CONFIG.LANGUAGES.DEFAULT;

/**
 * Retrieve the current locale from an unknown locale.
 *
 * `Astro.currentLocale` type is `string | undefined`. This means if we want to
 * use the locale as function parameter we need to accept `undefined` as well.
 * This is not ideal. So we need an helper that fallback to the default locale
 * if `undefined`.
 *
 * @param {string | undefined} locale - Maybe a valid locale.
 * @returns {AvailableLanguage} A valid locale.
 */
export const getCurrentLocale = (
  locale: string | undefined
): AvailableLanguage => {
  if (isString(locale) && isAvailableLanguage(locale)) return locale;

  return CONFIG.LANGUAGES.DEFAULT;
};

type Interpolations = Record<string, number | string>;

const replaceInterpolationsInMsg = (
  message: string,
  interpolations: Interpolations
) => {
  let updatedMsg = message;

  for (const [placeholder, value] of Object.entries(interpolations)) {
    updatedMsg = updatedMsg.replace(`{${placeholder}}`, `${value}`);
  }

  return updatedMsg;
};

type AvailableRoute = keyof I18nMessages["routes"];
type UIKey = I18nMessages["ui"];
export type PluralUIKey = KeyOfType<UIKey, Interpolations>;
type QuantifierKeys = keyof UIKey[PluralUIKey];
export type SingularUIKey = KeyOfType<UIKey, string>;

/**
 * Check if a route is available from its id.
 *
 * @param {string} id - The id of the route to check.
 * @returns {boolean} True if the id match an available route.
 */
export const isAvailableRoute = (id: string): id is AvailableRoute => {
  const availableRoutes = translations[CONFIG.LANGUAGES.DEFAULT].routes;

  return Object.keys(availableRoutes).includes(id);
};

const getQuantifierKeyFromCount = (count: number): QuantifierKeys => {
  if (!count) return "zero";
  if (count === 1) return "one";
  return "more";
};

type TranslatePluralKeysParams = {
  count: number;
  [key: string]: string | number;
};

export type TranslatePluralKeys = (
  key: PluralUIKey,
  interpolations: TranslatePluralKeysParams
) => string;

export type TranslateRoute = (
  key: AvailableRoute,
  localeOverride?: LooseAutocomplete<AvailableLanguage>
) => string;

export type TranslateSingularKeys = (
  key: SingularUIKey,
  interpolations?: Interpolations
) => string;

type UseI18n = (
  currentLocale: LooseAutocomplete<AvailableLanguage> | undefined
) => {
  /**
   * The locale used for translations.
   */
  locale: AvailableLanguage;
  /**
   * A method to retrieve a localized route for a given key.
   */
  route: TranslateRoute;
  /**
   * A method to retrieve a translated message for a given key.
   */
  translate: TranslateSingularKeys;
  /**
   * A method to retrieve a translated message for a given key and a quantifier.
   */
  translatePlural: TranslatePluralKeys;
};

/**
 * Init translation functions and return the locale.
 *
 * @param {LooseAutocomplete<AvailableLanguage> | undefined} currentLocale - A possibly valid locale.
 * @returns {ReturnType<UseI18n>} An object containing translation functions and the locale.
 */
export const useI18n: UseI18n = (
  currentLocale: LooseAutocomplete<AvailableLanguage> | undefined
): ReturnType<UseI18n> => {
  const locale = getCurrentLocale(currentLocale);
  const messages = translations[locale];

  const route: TranslateRoute = (key, localeOverride = locale) => {
    const localizedRoutes =
      localeOverride === locale || !isAvailableLanguage(localeOverride)
        ? messages.routes
        : translations[localeOverride].routes;
    const slug = localizedRoutes[key];

    if (isDefaultLanguage(localeOverride)) return slug;
    return `/${localeOverride}${slug}`;
  };

  const translate: TranslateSingularKeys = (key, interpolations) => {
    const message = messages.ui[key];

    if (interpolations === undefined) return message;
    return replaceInterpolationsInMsg(message, interpolations);
  };

  const translatePlural: TranslatePluralKeys = (
    key,
    { count, ...interpolations }
  ) => {
    const quantifier = getQuantifierKeyFromCount(count);
    const message = messages.ui[key][quantifier];

    return replaceInterpolationsInMsg(message, {
      ...interpolations,
      count: `${count}`,
    });
  };

  return { locale, route, translate, translatePlural };
};

/**
 * Retrieve a `language_TERRITORY` code for a locale.
 *
 * @param {LooseAutocomplete<AvailableLanguage> | null | undefined} locale - The current locale.
 * @returns {string} The language territory code.
 * @throws {Error} When the locale is not supported.
 */
export const getLanguageTerritory = (
  locale: LooseAutocomplete<AvailableLanguage> | null | undefined = CONFIG
    .LANGUAGES.DEFAULT
): string => {
  switch (locale) {
    case "en":
      return "en_US";
    case "fr":
      return "fr_FR";
    default:
      throw new Error(`Locale not supported. Received: ${locale}`);
  }
};

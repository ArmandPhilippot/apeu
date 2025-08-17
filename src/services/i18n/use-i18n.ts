import { translations } from "../../translations";
import type { AvailableLanguage } from "../../types/tokens";
import type { KeyOfType, LooseAutocomplete } from "../../types/utilities";
import { CONFIG } from "../../utils/constants";
import { getCurrentLocale } from "./helpers";

type I18nMessages = (typeof translations)[typeof CONFIG.LANGUAGES.DEFAULT];

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

export type PluralUIKey = KeyOfType<I18nMessages, Interpolations>;
type QuantifierKeys = keyof I18nMessages[PluralUIKey];
export type SingularUIKey = KeyOfType<I18nMessages, string>;

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

  const translate: TranslateSingularKeys = (key, interpolations) => {
    const message = messages[key];

    if (interpolations === undefined) return message;
    return replaceInterpolationsInMsg(message, interpolations);
  };

  const translatePlural: TranslatePluralKeys = (
    key,
    { count, ...interpolations }
  ) => {
    const quantifier = getQuantifierKeyFromCount(count);
    const message = messages[key][quantifier];

    return replaceInterpolationsInMsg(message, {
      ...interpolations,
      count: `${count}`,
    });
  };

  return { locale, translate, translatePlural };
};

import { vi } from "vitest";
import type {
  I18nContext,
  TranslatePluralKeys,
  TranslateSingularKeys,
} from "../../src/services/i18n";

/**
 * Create a mocked context for i18n.
 *
 * @returns {I18nContext} The mocked context.
 */
export function createMockI18n(): I18nContext {
  return {
    locale: "en",
    translate: vi.fn<TranslateSingularKeys>((key, params) => {
      if (params === undefined) return key;
      return `${key}:${JSON.stringify(params)}`;
    }),
    translatePlural: vi.fn<TranslatePluralKeys>(
      (key, params) => `${key}:count=${params.count}`
    ),
  };
}

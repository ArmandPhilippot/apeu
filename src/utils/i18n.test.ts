import { describe, expect, expectTypeOf, it, vi } from "vitest";
import { CONFIG } from "./constants";
import {
  getCurrentLocale,
  getLanguageTerritory,
  isAvailableLanguage,
  isAvailableRoute,
  useI18n,
} from "./i18n";

vi.mock("./constants", async (importOriginal) => {
  const mod =
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    await importOriginal<typeof import("./constants")>();
  return {
    ...mod,
    CONFIG: {
      ...mod.CONFIG,
      LANGUAGES: {
        AVAILABLE: ["en", "fr"],
        DEFAULT: "en",
      },
    },
  };
});

vi.mock("../translations", () => {
  return {
    translations: {
      en: {
        routes: {
          foo: "/foo",
        },
        ui: {
          singular: "Hello!",
          "plural.key": {
            zero: "You have no items.",
            one: "You have a single item.",
            more: "You have a lot of items.",
          },
          "plural.key.with.interpolation": {
            zero: "Hello, {name}! You have no items.",
            one: "Hello, {name}! You have a single item.",
            more: "Hello, {name}! You have {count} items.",
          },
          "singular.with.interpolation": "Hello, {name}!",
        },
      },
      fr: {
        routes: {
          foo: "/bar",
        },
        ui: {},
      },
    },
  };
});

describe("is-available-language", () => {
  it("returns true if the given language is valid", () => {
    expect(isAvailableLanguage(CONFIG.LANGUAGES.DEFAULT)).toBe(true);
  });

  it("returns false if the given language is invalid", () => {
    expect(isAvailableLanguage("et")).toBe(false);
  });
});

describe("get-current-locale", () => {
  it("returns the given locale when it is a valid", () => {
    const locale = "en";
    expect(getCurrentLocale(locale)).toBe(locale);
  });

  it("returns the default locale when it is invalid", () => {
    expect(getCurrentLocale("foo")).toBe(CONFIG.LANGUAGES.DEFAULT);
  });
});

describe("is-available-route", () => {
  it("returns true if the given route is valid", () => {
    expect(isAvailableRoute("foo")).toBe(true);
  });

  it("returns false if the given route is invalid", () => {
    expect(isAvailableRoute("bar")).toBe(false);
  });
});

describe("use-i18n", () => {
  it("returns an object with the locale and methods to translate UI and routes", () => {
    const i18n = useI18n("en");

    expect(i18n.locale).toMatchInlineSnapshot(`"en"`);
    expectTypeOf(i18n.route).toBeFunction();
    expectTypeOf(i18n.translate).toBeFunction();
    expectTypeOf(i18n.translatePlural).toBeFunction();
  });

  it("can return a translated message from a key using translate", () => {
    const { translate } = useI18n("en");

    // @ts-expect-error -- The key comes from the mock
    expect(translate("singular")).toMatchInlineSnapshot(`"Hello!"`);
  });

  it("can return a translated message in default language when the locale is invalid", () => {
    const { translate } = useI18n("foo");

    // @ts-expect-error -- The key comes from the mock
    expect(translate("singular")).toMatchInlineSnapshot(`"Hello!"`);
  });

  it("can return a translated message using interpolations", () => {
    const { translate } = useI18n("foo");

    expect(
      // @ts-expect-error -- The key comes from the mock
      translate("singular.with.interpolation", { name: "John" }),
    ).toMatchInlineSnapshot(`"Hello, John!"`);
  });

  it("can return a pluralized message from a key and a quantifier with value 0 using translatePlural", () => {
    const { translatePlural } = useI18n("en");

    // @ts-expect-error -- The key comes from the mock
    expect(translatePlural("plural.key", { count: 0 })).toMatchInlineSnapshot(
      `"You have no items."`,
    );
  });

  it("can return a pluralized message from a key and a quantifier with value 1 using translatePlural", () => {
    const { translatePlural } = useI18n("en");

    // @ts-expect-error -- The key comes from the mock
    expect(translatePlural("plural.key", { count: 1 })).toMatchInlineSnapshot(
      `"You have a single item."`,
    );
  });

  it("can return a pluralized message from a key and a quantifier with value greater than 1 using translatePlural", () => {
    const { translatePlural } = useI18n("en");

    // @ts-expect-error -- The key comes from the mock
    expect(translatePlural("plural.key", { count: 30 })).toMatchInlineSnapshot(
      `"You have a lot of items."`,
    );
  });

  it("can return a pluralized message from a key, a quantifier and interpolations using translatePlural", () => {
    const { translatePlural } = useI18n("en");

    expect(
      // @ts-expect-error -- The key comes from the mock
      translatePlural("plural.key.with.interpolation", {
        count: 3,
        name: "John",
      }),
    ).toMatchInlineSnapshot(`"Hello, John! You have 3 items."`);
  });

  it("can return a localized route from a key", () => {
    const { route } = useI18n("en");

    // @ts-expect-error -- The key comes from the mock
    expect(route("foo")).toMatchInlineSnapshot(`"/foo"`);
  });

  it("can return a localized route from a key using a locale argument", () => {
    const { route } = useI18n("en");

    // @ts-expect-error -- The key comes from the mock
    expect(route("foo", "fr")).toMatchInlineSnapshot(`"/fr/bar"`);
  });
});

describe("get-language-territory", () => {
  it("returns the language+territory code for the default locale", () => {
    expect(getLanguageTerritory()).toBe(
      getLanguageTerritory(CONFIG.LANGUAGES.DEFAULT),
    );
  });

  it("returns the language+territory code for the given locale", () => {
    expect(getLanguageTerritory("en")).toMatchInlineSnapshot(`"en_US"`);
  });

  it("throws an error if the given locale is not supported", () => {
    expect(() => getLanguageTerritory("ru")).toThrowErrorMatchingInlineSnapshot(
      `[Error: Locale not supported. Received: ru]`,
    );
  });
});

import type { ThemeRegistration } from "shiki";

export const shikiTheme: ThemeRegistration = {
  bg: "var(--color-shiki-background)",
  fg: "var(--color-shiki-on-background)",
  settings: [
    {
      name: "Bold",
      scope: ["strong", "markup.bold"],
      settings: {
        fontStyle: "bold",
      },
    },
    {
      name: "Italic",
      scope: ["emphasis", "markup.italic"],
      settings: {
        fontStyle: "italic",
      },
    },
    {
      name: "Bold + Italic",
      scope: ["markup.italic markup.bold", "markup.bold markup.italic"],
      settings: {
        fontStyle: "italic bold",
      },
    },
    {
      name: "Attribute",
      scope: "entity.other.attribute-name",
      settings: {
        foreground: "var(--color-shiki-token-attribute)",
      },
    },
    {
      name: "Comment",
      scope: "comment",
      settings: {
        foreground: "var(--color-shiki-token-comment)",
      },
    },
    {
      name: "Constant",
      scope: "constant.language",
      settings: {
        foreground: "var(--color-shiki-token-constant)",
      },
    },
    {
      name: "Constant Other",
      scope: "constant.other",
      settings: {
        foreground: "var(--color-shiki-token-numeric)", // bash options
      },
    },
    {
      name: "Constant Color",
      scope: "constant.other.color",
      settings: {
        foreground: "var(--color-shiki-token-numeric)",
      },
    },
    {
      name: "Constant Color - Punctuation",
      scope: "constant.other.color punctuation.definition",
      settings: {
        foreground: "var(--color-shiki-token-keyword)",
      },
    },
    {
      name: "Function",
      scope: ["entity.name.function"],
      settings: {
        foreground: "var(--color-shiki-token-function)",
      },
    },
    {
      name: "Invalid",
      scope: ["invalid"],
      settings: {
        foreground: "var(--color-shiki-token-invalid)",
      },
    },
    {
      name: "Keyword",
      scope: [
        "entity.other.attribute-name.pseudo-element",
        "keyword",
        "storage.modifier",
        "storage.type",
      ],
      settings: {
        foreground: "var(--color-shiki-token-keyword)",
      },
    },
    {
      name: "Markup - Heading",
      scope: "markup.heading",
      settings: {
        foreground: "var(--color-shiki-token-tag)",
        fontStyle: "bold",
      },
    },
    {
      name: "Markup - Inline Raw",
      scope: "markup.inline.raw",
      settings: {
        foreground: "var(--color-shiki-token-attribute)",
      },
    },
    {
      name: "Markup - Link",
      scope: "markup.underline.link",
      settings: {
        foreground: "var(--color-shiki-token-link)",
      },
    },
    {
      name: "Markup - List Punctuation",
      scope: "markup.list punctuation.definition.list",
      settings: {
        foreground: "var(--color-shiki-token-keyword)",
      },
    },
    {
      name: "Numeric",
      scope: ["constant.numeric"],
      settings: {
        foreground: "var(--color-shiki-token-numeric)",
      },
    },
    {
      name: "Property",
      scope: [
        "meta.object-literal.key",
        "meta.property-name support.type.property-name",
        "support.type.property-name",
        "source.yaml entity.name.tag",
      ],
      settings: {
        foreground: "var(--color-shiki-token-property)",
      },
    },
    {
      name: "Property - Vendored",
      scope: "support.type.vendored.property-name",
      settings: {
        foreground: "var(--color-shiki-token-property-vendored)",
        fontStyle: "italic",
      },
    },
    {
      name: "Regex",
      scope: ["constant.character.escape", "constant.regexp", "string.regexp"],
      settings: {
        foreground: "var(--color-shiki-token-regex)",
      },
    },
    {
      name: "String",
      scope: ["string", "support.constant.font-name"],
      settings: {
        foreground: "var(--color-shiki-token-string)",
      },
    },
    {
      name: "Support",
      scope: [
        "entity.other.attribute-name.pseudo-class",
        "support.function",
        "support.class",
        "source.css support.type.property-name",
      ],
      settings: {
        foreground: "var(--color-shiki-token-support)",
      },
    },
    {
      name: "Support - Constant",
      scope: ["support.constant"],
      settings: {
        foreground: "var(--color-shiki-on-background)",
      },
    },
    {
      name: "Tag",
      scope: ["entity.name.tag"],
      settings: {
        foreground: "var(--color-shiki-token-tag)",
      },
    },
    {
      name: "Type",
      scope: ["entity.name.type", "support.type"],
      settings: {
        foreground: "var(--color-shiki-token-type)",
      },
    },
    {
      name: "Variable",
      scope: ["variable"],
      settings: {
        foreground: "var(--color-shiki-token-variable)",
      },
    },
    {
      name: "Variable - Language",
      scope: ["variable.language"],
      settings: {
        foreground: "var(--color-shiki-token-variable)",
        fontStyle: "bold",
      },
    },
  ],
};

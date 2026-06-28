// @ts-check
import { satteri } from "@astrojs/markdown-satteri";
import mdx from "@astrojs/mdx";
import node from "@astrojs/node";
import sitemap from "@astrojs/sitemap";
import { defineConfig, envField, fontProviders } from "astro/config";
import icon from "astro-icon";
import { astroStories } from "./src/lib/astro/integrations/astro-stories";
import { devOnlyPages } from "./src/lib/astro/integrations/dev-only-pages";
import { pagefind } from "./src/lib/astro/integrations/pagefind";
import { hastHtmlImages } from "./src/lib/satteri/hast/hast-html-images";
import { hastInferRemoteImagesSize } from "./src/lib/satteri/hast/hast-infer-remote-images-size";
import { hastLinkedImages } from "./src/lib/satteri/hast/hast-linked-images";
import { mdastCallouts } from "./src/lib/satteri/mdast/mdast-callouts";
import { mdastCodeBlocks } from "./src/lib/satteri/mdast/mdast-code-blocks";
import { mdastWordsCount } from "./src/lib/satteri/mdast/mdast-words-count";
import { shikiTheme } from "./src/lib/shiki/theme";
import { CONFIG } from "./src/utils/constants";

// https://astro.build/config
export default defineConfig({
  adapter: node({
    mode: "standalone",
  }),
  build: {
    format: "preserve",
  },
  env: {
    schema: {
      CONTACT_EMAIL: envField.string({
        access: "secret",
        context: "server",
        includes: "@",
        min: 5,
      }),
      SMTP_HOST: envField.string({ access: "secret", context: "server" }),
      SMTP_PORT: envField.number({ access: "secret", context: "server" }),
      SMTP_USER: envField.string({ access: "secret", context: "server" }),
      SMTP_PASSWORD: envField.string({ access: "secret", context: "server" }),
    },
  },
  experimental: {
    contentIntellisense: true,
  },
  fonts: [
    {
      cssVariable: "--font-inter",
      display: "swap",
      fallbacks: [
        "Roboto",
        "Helvetica Neue",
        "Arial Nova",
        "Nimbus Sans",
        "Arial",
        "sans-serif",
      ],
      formats: ["woff"],
      name: "Inter",
      provider: fontProviders.bunny(),
      styles: ["italic", "normal", "oblique"],
      subsets: ["latin"],
      unicodeRange: [
        "U+0000-00FF",
        "U+0131",
        "U+0152-0153",
        "U+02BB-02BC",
        "U+02C6",
        "U+02DA",
        "U+02DC",
        "U+0304",
        "U+0308",
        "U+0329",
        "U+2000-206F",
        "U+20AC",
        "U+2122",
        "U+2191",
        "U+2193",
        "U+2212",
        "U+2215",
        "U+FEFF",
        "U+FFFD",
      ],
      weights: ["100 900"],
    },
    {
      cssVariable: "--font-cousine",
      display: "swap",
      fallbacks: [
        "Menlo",
        "Consolas",
        "Monaco",
        "Liberation Mono",
        "Lucida Console",
        "monospace",
      ],
      name: "Cousine",
      provider: fontProviders.fontsource(),
      styles: ["italic", "normal", "oblique"],
      subsets: ["latin"],
      weights: ["400", "700"],
    },
  ],
  i18n: {
    defaultLocale: CONFIG.LANGUAGES.DEFAULT,
    locales: [...CONFIG.LANGUAGES.AVAILABLE],
  },
  image: {
    domains: import.meta.env.DEV ? ["placehold.co"] : [],
    layout: "constrained",
    objectFit: "cover",
    objectPosition: "top",
    responsiveStyles: true,
  },
  integrations: [
    devOnlyPages({ prefix: "_dev_" }),
    astroStories({
      base: "/design-system",
      layout: "./src/components/templates/story-layout/story-layout.astro",
      patterns: ["{components,views}/**/*.stories.mdx", "**/stories/**/*.mdx"],
    }),
    icon({
      iconDir: "src/assets/icons",
    }),
    mdx({ syntaxHighlight: false }),
    pagefind(),
    sitemap({
      i18n: {
        defaultLocale: CONFIG.LANGUAGES.DEFAULT,
        locales: {
          en: "en-US",
          fr: "fr-FR",
        },
      },
    }),
  ],
  markdown: {
    processor: satteri({
      features: { directive: true },
      hastPlugins: [
        hastHtmlImages,
        hastLinkedImages,
        hastInferRemoteImagesSize,
      ],
      mdastPlugins: [mdastCodeBlocks, mdastCallouts, mdastWordsCount],
    }),
    shikiConfig: {
      theme: shikiTheme,
    },
  },
  output: "static",
  site: `https://${CONFIG.HOST}`,
  vite: {
    server: {
      watch: {
        ignored: ["**/coverage/**"],
      },
    },
  },
});

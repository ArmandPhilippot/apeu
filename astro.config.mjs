// @ts-check
import mdx from "@astrojs/mdx";
import node from "@astrojs/node";
import sitemap from "@astrojs/sitemap";
import { defineConfig, fontProviders } from "astro/config";
import icon from "astro-icon";
import remarkDirective from "remark-directive";
import { componentsStories } from "./src/lib/astro/integrations/components-stories";
import { devOnlyPages } from "./src/lib/astro/integrations/dev-only-pages";
import { pagefind } from "./src/lib/astro/integrations/pagefind";
import { rehypeCodeBlocks } from "./src/lib/rehype/rehype-code-blocks";
import { rehypeDisableExplicitJsx } from "./src/lib/rehype/rehype-disable-explicit-jsx";
import { rehypeImages } from "./src/lib/rehype/rehype-images";
import { remarkCallouts } from "./src/lib/remark/remark-callouts";
import { remarkWordsCount } from "./src/lib/remark/remark-words-count";
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
  experimental: {
    contentIntellisense: true,
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
        name: "Inter",
        provider: fontProviders.fontsource(),
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
  },
  i18n: {
    defaultLocale: CONFIG.LANGUAGES.DEFAULT,
    locales: [...CONFIG.LANGUAGES.AVAILABLE],
  },
  image: {
    layout: "constrained",
    objectFit: "cover",
    objectPosition: "top",
    responsiveStyles: true,
  },
  integrations: [
    componentsStories({
      baseSlug: "/design-system/components",
      components: "./src/components",
    }),
    componentsStories({
      baseSlug: "/design-system/views",
      components: "./src/views",
    }),
    devOnlyPages({ prefix: "_dev_" }),
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
    remarkPlugins: [remarkDirective, remarkCallouts, remarkWordsCount],
    rehypePlugins: [rehypeDisableExplicitJsx, rehypeCodeBlocks, rehypeImages],
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

// @ts-check
import mdx from "@astrojs/mdx";
import node from "@astrojs/node";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";
import { defineConfig } from "astro/config";
import { componentsStories } from "./src/lib/astro/integrations/components-stories";
import { devOnlyPages } from "./src/lib/astro/integrations/dev-only-pages";
import { pagefind } from "./src/lib/astro/integrations/pagefind";
import { rehypeCodeBlocks } from "./src/lib/rehype/rehype-code-blocks";
import { rehypeDisableExplicitJsx } from "./src/lib/rehype/rehype-disable-explicit-jsx";
import { rehypeImages } from "./src/lib/rehype/rehype-images";
import { remarkWordsCount } from "./src/lib/remark/remark-words-count";
import { shikiTheme } from "./src/lib/shiki/theme";
import { CONFIG } from "./src/utils/constants";

// https://astro.build/config
export default defineConfig({
  adapter: node({
    mode: "standalone",
  }),
  experimental: {
    contentIntellisense: true,
  },
  i18n: {
    defaultLocale: CONFIG.LANGUAGES.DEFAULT,
    locales: [...CONFIG.LANGUAGES.AVAILABLE],
  },
  integrations: [
    componentsStories({
      baseSlug: "/design-system/components",
      components: "./src/components",
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
        },
      },
    }),
  ],
  markdown: {
    remarkPlugins: [remarkWordsCount],
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

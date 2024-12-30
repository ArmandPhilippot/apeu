# Armand.Philippot.eu

The source code of [my personal website](https://armand.philippot.eu).

## Setup

1. Clone the repository.
2. Install the dependencies.
3. Create an `.env` file and fill it with your own configuration based on `.env.example` placeholders
4. (Recommended) To enable search feature you'll need to perform a first build of the website, so run `pnpm run build`.

## Features

### Dev-only pages

This project supports and uses dev-only pages. Those pages are accessible in your browser in dev mode but they won't be built (so they are not available in preview mode). You can find them thanks to their `_dev_` prefix.

Why `_dev_` ? Because [Astro already uses a single underscore](https://docs.astro.build/en/guides/routing/#excluding-pages) to exclude the pages from being built so we need a different prefix and a double underscore could be confusing.

> [!Note]
> This integration only supports directories or pages with Astro extension (e.g. `_dev_tokens.astro`). You won't be able to build dev-only pages from Markdown files.
> The following patterns are supported:

- a dev-only page anywhere inside the pages directory
- a dev-only folder containing regular pages anywhere inside the pages directory.

The following pattern is not supported because it does not make sense:

- a dev-only page inside a dev-only folder (eg. `src/pages/_dev_design-system/_dev_non-accessible-page.astro` is not accessible in your browser but `src/pages/_dev_design-system/accessible-page.astro`) is accessible.

> [!IMPORTANT]
> The pages are injected right after reading the configuration file. So if you create a new dev-only page (or rename an existing one), the page will not be recognized. You'll need to reload the Astro dev server.
> Also, it seems the Astro Dev Toolbar can't be displayed in injected routes so you do not have access to the Audit app for example.

Then to access the page in your browser, you need to remove the prefix from the slug. For example, the existing `src/pages/_dev_design-system` folder can be accessed in your browser with the following url `http://localhost:4321/design-system`.

### Component stories

Currently, it is not possible to use [Storybook with Astro](https://github.com/storybookjs/storybook/issues/18356). So I added an Astro integration to be able to test the components in isolation. This is not Storybook replacement: you can't play with props, dynamically generate a table of available props, etc.

To create stories for your components, use the following structure:

```text
/src/components
├── button/
│   ├── button.astro
│   └── button.stories.astro
└── link/
    ├── link.astro
    └── link.stories.astro
```

About this structure:

- `button.astro`: your Astro component
- `button.stories.astro`: your stories about the component

The `button.stories.astro` file is a regular Astro page: import the component, use a layout if needed, and use HTML markup to write about the component.

> [!NOTE]
> The VS Code extension will infer the file name as `Button`, so to import your component you'll need to rename the import (e.g. `ButtonComponent`) to avoid conflicts.

Using that structure, you can access your stories in a browser using the following slugs:

- `/design-system/components/button`
- `/design-system/components/link`

If you need to divide your stories in multiple files, you can use a `stories` directory in your component directory. For example, both the following structures are supported:

```text
/src/components
├── button/
│   ├── stories/
│   │   ├── primary-button.stories.astro
│   │   └── secondary-button.stories.astro
│   ├── button.astro
│   └── button.stories.astro
└── link/
    ├── stories/
    │   ├── link.stories.astro
    │   ├── nav-link.stories.astro
    │   └── index.stories.astro
    └── link.astro
```

> [!IMPORTANT]
> If you create a new story file (ie. `.stories.astro`), you'll need to restart the dev server to be able to access it in your browser.

Only `.astro` extension is supported for stories. I'd like to use `.mdx` but Astro integrations can only inject routes for `.astro`, `.js` and `.ts` files.

### i18n

This project is i18n-ready but only available in English right now.

All UI strings are stored as a key/value pair in a JSON file located in `src/translations`. Note that for routes, except for the homepage, the translations should match the names used in `src/pages`.

Then each templates use some methods to translate those messages in the current locale. It also supports pluralization and route localization.

### Mailer

This project uses [Nodemailer](https://nodemailer.com/) to allow sending emails with the contact form (through an API route). Make sure to configure your SMTP options using a `.env` file.

The easiest way to get started is:

1. `cp .env.example .env`
2. Replace the placeholders in `.env` with your own configuration

> [!NOTE]
> If you want to test sending emails from `localhost` using your own mail server, you might need to add some permissions in your firewall.

### Search

The search is powered by [Pagefind](https://pagefind.app/), a fully static search library. It needs to index the contents in advance to be able to work.

There are some caveats in dev mode:

- You need to run `pnpm build` once before executing `pnpm dev` to build the search index and to be able to use the search form.
- If you change the Pagefind config (like adding data attributes to filter the contents), the index will not be automatically rebuilt. You need to perform another build and to execute `pnpm dev` again.
- The indexed images use the built URLs (the ones processed by Astro) so they can't be displayed in dev environment (so for now, I decided to deactivated them).

### Dark and Light themes

You can choose to use a dark theme or light theme while browsing the website. You can also choose to set the theme as `auto`. In this case, the website theme will be updated according to your operating system preferences. This is especially useful when you want to change the theme depending on the time of day.

## Authoring

The content directory located at the root of the project is used to store all the website contents. You can provide a custom relative path using an environment variable named `CONTENT_PATH`.

The available content types are:

- authors
- blog categories
- blog posts
- blogroll
- bookmarks
- guides
- notes
- pages
- projects
- tags

To check the expected fields in the frontmatter, please consult the files in `src/lib/astro/collections/schema`.

Both `.md` and `.mdx` extensions are supported. However, because of technologies limitations, the `.mdx` format is recommended.

This project is designed to avoid imports in your `content` directory. Elements (even HTML tags) are automatically mapped to custom components when you use the `.mdx` extension.

### Automatic meta: Words count / Reading time

The words count will be automatically calculated from your Markdown files and added as metadata. From there, the reading time for each content can be calculated depending on the current language.

### Callouts

When using MDX format, you can use a directive for your callouts (or admonitions, asides) for example:

```mdx
:::warning
The contents of the warning.
:::
```

Both custom titles and attributes are supported:

```mdx
:::idea[My custom tip]{ariaLabel: "An accessible label for my tip"}
The contents of the tip.
:::
```

Here are the supported callouts type: "critical", "discovery", "idea", "info", "success" and "warning".

### Code blocks

When using MDX format, your code blocks will automatically use the `CodeBlock` component. To pass additional props, you can use the following syntax:

````mdx
```js showLineNumbers filePath=./hello-world.js
console.log("Hello, world!");
```
````

See `src/components/molecules/code-block/code-block.astro` for the supported props.

> [!CAUTION] > `<pre><code></code></pre>` syntax is not supported. If fenced code blocks are not enough for you, then you will need to import the component in your file directly.

### Images

When using `.mdx` format:

- you can use local image paths without the need to import them,
- if you don't specify the images dimensions, they will be inferred for you even with remote images.

## Development

Before starting, please follow the instructions in [Setup](#setup).

### Project structure

```text
/
├── content/
│   ├── authors/
│   │   └── armand-philippot.json
│   ├── blogroll/
│   │   ├── blog1.json
│   │   └── blog2.json
│   ├── bookmarks/
│   │   └── a-bookmark.json
│   ├── en/
│   │   ├── blog/
│   │   │   ├── categories/
│   │   │   │   ├── index.md
│   │   │   │   └── category1.md
│   │   │   ├── posts/
│   │   │   │   ├── index.md
│   │   │   │   └── post1.md
│   │   │   └── index.md
│   │   ├── guides/
│   │   │   ├── index.md
│   │   │   └── guide1.md
│   │   ├── notes/
│   │   │   ├── index.md
│   │   │   └── note1.md
│   │   ├── pages/
│   │   │   ├── 404.md
│   │   │   ├── blogroll.md
│   │   │   ├── bookmarks.md
│   │   │   ├── contact.md
│   │   │   ├── feeds.md
│   │   │   ├── home.md
│   │   │   ├── legal-notice.md
│   │   │   └── search.md
│   │   ├── projects/
│   │   │   ├── index.md
│   │   │   └── project1.md
│   │   └── tags/
│   │       ├── index.md
│   │       └── tag1.md
│   └── fr/
│       └── same as en/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── lib/
│   │   └── astro/
│   │       └── integrations/
│   ├── pages/
│   │   ├── _dev_design-system/
│   │   │   ├── components/
│   │   │   ├── tokens/
│   │   │   └── index.astro
│   │   ├── api/
│   │   ├── blog/
│   │   │   ├── categories/
│   │   │   │   └── index.astro
│   │   │   ├── articles/
│   │   │   │   └── index.astro
│   │   │   └── index.astro
│   │   ├── blogroll/
│   │   │   └── index.astro
│   │   ├── en/
│   │   │   ├── blog/
│   │   │   │   ├── categories/
│   │   │   │   │   └── index.astro
│   │   │   │   ├── posts/
│   │   │   │   │   └── index.astro
│   │   │   │   └── index.astro
│   │   │   ├── blogroll/
│   │   │   │   └── index.astro
│   │   │   ├── bookmarks/
│   │   │   │   └── index.astro
│   │   │   ├── guides/
│   │   │   │   └── index.astro
│   │   │   ├── notes/
│   │   │   │   └── index.astro
│   │   │   ├── projects/
│   │   │   │   └── index.astro
│   │   │   ├── tags/
│   │   │   │   └── index.astro
│   │   │   ├── [slug].astro
│   │   │   ├── 404.astro
│   │   │   ├── contact.astro
│   │   │   ├── feeds.astro
│   │   │   ├── index.astro
│   │   │   ├── legal-notice.astro
│   │   │   └── search.astro
│   │   ├── etiquettes/
│   │   │   └── index.astro
│   │   ├── guides/
│   │   │   └── index.astro
│   │   ├── notes/
│   │   │   └── index.astro
│   │   ├── projets/
│   │   │   └── index.astro
│   │   ├── signets/
│   │   │   └── index.astro
│   │   ├── [slug].astro
│   │   ├── 404.astro
│   │   ├── contact.astro
│   │   ├── flux.astro
│   │   ├── index.astro
│   │   ├── mentions-legales.astro
│   │   └── recherche.astro
│   ├── services/
│   │   └── mailer/
│   ├── styles/
│   ├── translations/
│   │   └── en.json
│   ├── types/
│   ├── utils/
│   └── content.config.ts
├── package.json
└── config files
```

In details:

- `content/`: the website contents (pages, posts...),
- `public/`: any static assets, like fonts, can be placed in this directory,
- `src/assets/`: any assets that must be processed by Astro (like images) can be placed in this directory,
- `src/components/`: the project components,
- `src/lib/`: the features based on dependencies (e.g. Astro integration),
- `src/pages/`: the special components used to create pages and API routes,
- `src/services/`: the website services (e.g. mailer),
- `src/styles/`: global styles, variables and helpers should be placed in this directory,
- `src/translations/`: the JSON files used to store all UI strings and routes for one language,
- `src/types/`: the Typescript types shared across the application,
- `src/utils/`: all the utilities (constants, helpers, etc.) to build the project.

> [!IMPORTANT]
> All the `index.md` files in the `content` directory are required. These files are used in `src/pages` to add metadata and optional content to the index pages of your collections. Pages created in `content/pages` can use any filename but some pages are required: `404.md`, `blogroll.md`, `bookmarks.md`, `contact.md`, `feeds.md`, `home.md`, `legal-notice.md` and `search.md`. You can also use the `.mdx` extension.

### Design system

You can access the Design system only in dev mode with the following slug: `/design-system`.

#### Components

The components are located in the `src/components` directory and should be organized using the [Atomic Design Methodology](https://atomicdesign.bradfrost.com/chapter-2/):

```text
/src/components/
├── atoms/
├── molecules/
├── organisms/
└── templates/
```

When creating a new component you should also create stories for it and use the following structure:

```text
/src/components/atoms/
├── button/
│   ├── button.astro
│   ├── button.stories.astro
│   ├── button.test.ts
│   └── index.ts
└── other components
```

The component stories will be collected when your start the dev server and will be available in the design system (accessible under `/design-system` in your browser).

This way you can test them in isolation both visually through stories and with Vitest tests.

#### Tokens

This project use CSS variables to define colors, borders, fonts, shadows and spacings. This ensures design harmonization across the components and pages.

When creating new design elements, you should use them. For example:

```diff
.some-element {
-    padding: 1rem;
-    background: #fff;
-    border: 1px solid #ccc;
-    font-size: 16px;
+    padding: var(--spacing-md);
+    background: var(--color-regular);
+    border: var(--border-size-sm) solid var(--color-border);
+    font-size: var(--font-size-md);
}
```

You can find all available tokens in the design system (accessible under `/design-system` in your browser).

### Add a new language

To add a new language for this website, you need to create a new JSON file in `src/translations` using the locale as filename. Here are the required steps:

1. `cp content/en content/fr` and keep the filenames of the `pages` untranslated,
2. `cp src/translations/en.json src/translations/fr.json`,
3. `nano src/translations/fr.json`, translate all the keys in your language then save the file,
4. `nano src/translations/index.ts`: in that file, import then reexport your new language,
5. Copy the pages in `src/pages` in a new directory matching the locale you're adding (e.g. `src/pages/fr`) and translates the filename so that they match your translations in `src/translations`,
6. The new language is now available!

### Use localized UI strings in templates

If you need to use UI strings or routes in your templates:

1. Make sure the key exist in the translations files or add a new key,
2. Import the `useI18n()` helper,
3. Use one the provided methods to display your UI string or route.

**DO:**

```astro
---
import { useI18n } from "src/utils/helpers/i18n";

const { translate } = useI18n(Astro.currentLocale);
---

<div>{translate("some.key.available.in.translations")}</div>
```

**DON'T:**

```astro
---

---

<div>Some hardcoded string.</div>
```

### Writing templates for collection pages

Instead of using directly the `getCollection` helper from Astro, you should use the `queryCollection` helper declared in this project. This function helps you query a collection with filters, offset and ordering. `queryCollection` will also resolves every references!

**DO:**

```astro
---
import { queryCollection } from "src/lib/astro/collections";

const { entries, total } = await queryCollection("blogPosts", {
  first: 10,
  orderBy: { key: "publishedOn", order: "DESC" },
});
---

// Your template here
```

**DON'T:**

```astro
---
import { getCollection, getEntries, getEntry } from "astro:content";

const rawBlogPosts = await getCollection("blogPosts");
const blogPosts = await Promise.all(
  rawBlogPosts.map(async (blogPost) => {
    const category = blogPost.data.category
      ? await getEntry(blogPost.data.category)
      : null;
    const tags = blogPost.data.tags
      ? await getEntries(blogPost.data.tags)
      : null;

    return {
      ...blogPost,
      data: {
        ...blogPost.data,
        category,
        tags,
      },
    };
  }),
);
const orderedBlogPosts = blogPosts.sort(/* some method to sort posts */);
const firstTenBlogPosts = orderedBlogPosts.slice(0, 10);
---

// Your template here
```

As you can see, `queryCollection` helps reduce a lot of boilerplate code and it can also be used to resolve multiple collections! If you only need to resolve one entry, you can use `queryEntry` instead.

### Workflow

The versioning of this repository is managed with [changesets](https://github.com/changesets/changesets). This helps automate updating package versions, and changelogs.

So if you decide to submit a pull request keep that in mind:

- you have to decide if your changes are worth to be added in the changelog (patch, minor or major update) or not.
- if you think those changes are important enough, then you need to include a changeset in your PR with some details about what changed.

Then, when I think it's time, I'll published a new version of the website based on those changesets.

### CLI

#### Develop with Astro

All commands are run from the root of the project, from a terminal.

| Command                | Action                                       |
| :--------------------- | :------------------------------------------- |
| `pnpm i`               | Installs dependencies                        |
| `pnpm dev`             | Starts local dev server at `localhost:4321`  |
| `pnpm build`           | Build your production site to `./dist/`      |
| `pnpm preview`         | Preview your build locally, before deploying |
| `pnpm astro ...`       | Run Astro CLI commands like `add`            |
| `pnpm astro -- --help` | Get help using the Astro CLI                 |

#### Lint/Fix source code

| Command                | Action                                      |
| :--------------------- | :------------------------------------------ |
| `pnpm lint`            | Run all linters                             |
| `pnpm lint:formatting` | Run Prettier to check files                 |
| `pnpm lint:scripts`    | Lint astro and scripts files using ESlint   |
| `pnpm lint:spelling`   | Lint spelling errors in all files           |
| `pnpm lint:styles`     | Lint astro and styles files using Stylelint |
| `pnpm lint:types`      | Run type-checking with Astro                |
| `pnpm fix`             | Run all fixers                              |
| `pnpm lint:formatting` | Run Prettier to format files                |
| `pnpm fix:scripts`     | Fix astro and scripts files using ESlint    |
| `pnpm fix:styles`      | Fix astro and styles files using Stylelint  |

#### Testing

| Command                   | Action                                    |
| :------------------------ | :---------------------------------------- |
| `pnpm test:e2e`           | Run end-to-end tests using Cypress        |
| `pnpm test:e2e:ui`        | Run end-to-end tests using the Cypress UI |
| `pnpm test:unit`          | Run unit tests using Vitest               |
| `pnpm test:unit:coverage` | Run unit tests using Vitest and coverage  |
| `pnpm test:unit:watch`    | Run unit tests using Vitest and watch     |

#### Github actions and/or maintainer only

| Command           | Action                                |
| :---------------- | :------------------------------------ |
| `pnpm ci:version` | Bump version and generate a changelog |
| `pnpm ci:release` | Create a new release                  |

## License

The source code is licensed under the [MIT license](./LICENSE).

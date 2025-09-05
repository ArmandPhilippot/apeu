# Armand.Philippot.eu

The source code of [my personal website](https://armand.philippot.eu).

## Setup

1. Clone the repository.
2. Install the dependencies.
3. Create an `.env` file and fill it with your own configuration based on `.env.example` placeholders
4. (Recommended) To enable the search feature you'll need to perform a first build with `pnpm run build`.

## Features

### Dev-only pages

This project uses a custom Astro integration to support dev-only pages. Those pages are accessible in your browser in dev mode but they won't be built and are not available in preview mode. You can find them thanks to their `_dev_` prefix.

Why `_dev_`? Because [Astro already uses a single underscore](https://docs.astro.build/en/guides/routing/#excluding-pages) to exclude the pages from being built so we need a different prefix to differentiate them and a double underscore could be confusing.

> [!NOTE]
> This integration only supports directories or pages using the Astro extension (e.g. `_dev_tokens.astro`). You won't be able to build dev-only pages from Markdown files.

The following patterns are supported:

- a dev-only folder containing regular pages anywhere inside the pages directory,
- a dev-only page anywhere inside the pages directory, except in a dev-only folder (eg. `src/pages/_dev_design-system/_dev_non-accessible-page.astro` is not accessible in your browser but `src/pages/_dev_design-system/accessible-page.astro` is).

> [!IMPORTANT]
> The pages are injected right after reading the configuration file. So if you create a new dev-only page (or rename an existing one), the page will not be recognized. You'll need to reload the Astro dev server first.
>
> I'm not sure why but, the Astro Dev Toolbar can't be displayed in some dev pages. This prevents access to its applications like the Audit app for example.

To access a dev-only page in your browser, you need to remove the prefix from the slug. For example, the existing `src/pages/_dev_design-system` folder can be accessed in your browser with the following url `http://localhost:4321/design-system`.

### i18n

This project is i18n-ready and currently supports both English and French.

#### Translations

The translations are stored as a key/value pair in a JSON file per locale and are located in `src/translations`.

When you need to localize UI strings in your components or templates, you can import the `useI18n()` helper. This returns two functions (`translate()` and `translatePlural()`) allowing you to deal with pluralization and interpolations.

```astro
---
import { useI18n } from "../services/i18n";

const {locale, translate, translatePlural } = useI18n(Astro.currentLocale);
console.log(locale); // "en" or "fr", `locale` is a type-safe union
translate("singular.key");
translate("singular.key.with.interpolation", { name: "John" });
translatePlural("plural.key", { count: 42 });
translatePlural("plural.key.with.interpolation", { count: 3, name: "John" });
---
```

#### Routing

Localized routes provide a better UX. This projects supports a custom frontmatter property named `permaslug` allowing you to define the localized slug for the current file. This way, you can use the same filenames for each locale while using localized routes.

Given the following structure:
```
content/
├── en/
│   ├── projects/
│   │   ├── first-project.md // no permaslug
│   │   └── index.md // no permaslug
│   └── other contents
└── fr/
    ├── projects/
    │   ├── first-project.md // using `permaslug: "premier-projet"`
    │   └── index.md // using `permaslug: "projets"`
    └── other contents
```

The computed route for `first-project.md` will be `/projets/premier-projet` when `fr` is the default locale, or `/fr/projets/premier-projet` otherwise.

To use localized routing in your templates and components, you can import the `useRouting()` helper. This returns a single `routeById()` function allowing you to display a route using the content id. For example, using the previous structure and French as default locale:

```astro
---
import { useRouting } from "../services/routing";

const { routeById } = await useRouting("fr");
console.log(routeById("projects")) // { label: "Projets", path: "/projets" }
console.log(routeById("projects/first-project")) // { label: "Premier projet", path: "/projets/premier-projet" }
---
```

You can also override the locale provided to `useRouting` per `routeById` call when you need a route in a different locale:

```astro
---
import { useRouting } from "../services/routing";

const { routeById } = await useRouting("fr");
console.log(routeById("projects", "en")) // { label: "Projects", path: "/en/projects" }
console.log(routeById("projects/first-project", "en")) // { label: "First project", path: "/en/projects/first-project" }
---
```

#### Switching between languages

By default, the language switcher will redirect the user to the selected language homepage even when browsing another page. To redirect to the same page in the selected language, you need to opt in by using the `i18n` property in your Markdown frontmatter. This property takes an object with a supported locale as key and the id of the localized entry as value.

For example, assuming the French version exists, a `content/en/projects/first-project.md` file could define:

```md
---
title: First project
i18n:
  fr: fr/projects/first-project
---

Project description.
```

This allows you to use different file names between the two locales while making the relationship explicit.

### Mailer

This project uses [Nodemailer](https://nodemailer.com/) to send emails through the contact form. Make sure to [configure your SMTP options](#setup) using a `.env` file.

> [!NOTE]
> If you want to test sending emails from `localhost` using your own mail server, you might need to add some permissions in your firewall.

### RSS feeds

Each [supported languages](#i18n) provides a global feed and individual feeds per collections. Individual tags and blog categories also provide their own feeds. This allows the user to choose which contents they want to subscribe to.

### Search

The search is powered by [Pagefind](https://pagefind.app/), a fully static search library. It needs to index the contents in advance to be able to work.

Therefore, there are some caveats in dev mode:

- You need to run `pnpm build` once before executing `pnpm dev` to build the search index and to be able to use the search form.
- If you change the Pagefind config (like adding data attributes to filter the contents), the index will not be automatically rebuilt. You need to perform another build and to execute `pnpm dev` again.
- The indexed images use the built URLs (the ones processed by Astro) so they can't be displayed in dev environment (so at the moment, they are fully deactivated).

> [!NOTE]
> This integration is no longer used, but is kept in the project in case we need it again later.

### Stories

Storybook is [currently not supported with Astro](https://github.com/storybookjs/storybook/issues/18356). This projects uses a custom Astro integration to bring support for testing components and views in isolation. This is not a Storybook replacement: you can't play with props, dynamically generate a table of available props, etc.

Astro integrations can only inject routes for `.astro`, `.js` and `.ts` files. So, stories only supports the `.astro` extension and you can't use an `.mdx` file for them.

To create stories for your components (`src/components`) or views (`src/views`), use the following structure:

```text
/src/components
├── button/
│   ├── button.astro
│   └── button.stories.mdx
└── link/
    ├── link.astro
    └── link.stories.mdx
```

Where:

- `button.astro` is your Astro component
- `button.stories.mdx` is your component's stories

Any `<filename>.stories.mdx` is treated as a story: import the component you want to document and it will be injected as route, based on its path.

When you need more general stories, you can store them in `src/stories`. They will be injected as top-level pages.

The integration supports a base path to inject the stories. Using [dev-only pages](#dev-only-pages) and the previous structure, stories are currently accessible in a browser under `/design-system`. The previous example gives the following slugs:

- `/design-system/components/button`
- `/design-system/components/link`
- `/design-system/tokens`

If you need to divide your stories in multiple files, you can use a `stories` directory inside your component directory. For example, the following structure is supported:

```text
/src/components
└── button/
    ├── stories/
    │   ├── primary-button.stories.mdx
    │   └── secondary-button.stories.mdx
    └── button.astro
```

Only `.mdx` extension is supported for stories. The stories indexes (or listing pages) will be automatically generated.

> [!IMPORTANT]
> Because the stories are injected earlier in the build steps, if you create a new story file (ie. `.stories.astro`), you'll have to restart the dev server to be able to access it in your browser.

### i18n

This project is i18n-ready and it is available in English and in French right now.

All UI strings are stored as a key/value pair in a JSON file located in `src/translations`.

Then each templates use some helpers to translate those messages in the current locale. It also supports pluralization and route localization.

### Themes

You can choose to use a dark theme or light theme while browsing the website. You can also choose to set the theme as `auto`. When using that setting, the website theme will be updated according to your operating system preferences. This is especially useful when you want to change the theme depending on the time of day.

### View transitions

While all browsers do not support view transitions yet, this project uses Astro built-in view transitions to provide a fallback. This feature avoids full-page navigation refresh which seems preferrable to some.

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

To check the expected fields in the frontmatter, please consult the files in `src/lib/astro/schema`.

Both `.md` and `.mdx` extensions are supported. However, because of technologies limitations, the `.mdx` format is recommended to be able to use extra features like callouts and code blocks.

This project is designed to avoid imports in your `content` directory. Elements (including HTML tags) are automatically mapped to custom components when you use the `.mdx` extension.

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

Here are the supported callouts type: `critical`, `discovery`, `idea`, `info`, `success` and `warning`.

### Code blocks

When using MDX format, your code blocks will automatically use the `CodeBlock` component. To pass additional props, you can use the following syntax:

````mdx
```js showLineNumbers filePath=./hello-world.js
console.log("Hello, world!");
```
````

See `src/components/molecules/code-block/code-block.astro` for the supported props.

> [!CAUTION]
> `<pre><code></code></pre>` syntax is not supported. If fenced code blocks are not enough for you, then you will need to import the component in your file directly.

### Images

When using `.mdx` format:

- you can use local image paths without the need to import them,
- if you don't specify the images dimensions, they will be inferred for you even with remote images.

Images can be colocated with your content. You can, for example use `contents/en/guides/assets` to store your English guides images, and then use `[my image](./assets/any-image.jpg)` in `contents/en/guides/your-guide.mdx`.

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
│   │   ├── [...page]/
│   │   │   ├── feed.xml.ts
│   │   │   └── index.astro
│   │   ├── [locale]/
│   │   │   └── 404.astro
│   │   ├── api/
│   │   ├── og/
│   │   ├── 404.astro
│   │   ├── favicon.ico.ts
│   │   ├── manifest.json.ts
│   │   └── robots.txt.ts
│   ├── services/
│   │   └── mailer/
│   ├── stories/
│   │   └── tokens.mdx
│   ├── styles/
│   ├── translations/
│   │   └── en.json
│   ├── types/
│   ├── utils/
│   └── content.config.ts
├── tests
├── package.json
└── config files
```

In details:

- `content/`: the website contents (pages, posts...),
- `public/`: any static assets, like fonts, can be placed in this directory,
- `src/assets/`: any assets that must be processed by Astro (like images) can be placed in this directory,
- `src/components/`: the components,
- `src/lib/`: the features based on dependencies (e.g. Astro integration or Shiki transformers),
- `src/pages/`: the special components used to create pages and API routes,
- `src/services/`: the website services (e.g. mailer),
- `src/stories/`: the generic stories injected as top-level pages under `/design-system`,
- `src/styles/`: global styles, variables and helpers should be placed in this directory,
- `src/translations/`: the JSON files used to store all UI strings and routes for one language,
- `src/types/`: the Typescript types shared across the application,
- `src/utils/`: all the utilities (constants, helpers, etc.) to build the project.
- `tests/`: fixtures, utilities and mocks for testing-purposes.

> [!IMPORTANT]
> The current layout expects some files (`.md` or `.mdx`) to exist in the `content` directory:
> * In `content/[locale]/pages`, the following filenames are expected: `404`, `blogroll`, `bookmarks`, `contact`, `feeds`, `home`, `legal-notice` and `search`.
> * In the other collections located in `content/[locale]` (including nested directories), an `index.md` or `index.mdx` is expected.

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
│   ├── button.stories.mdx
│   └── button.test.ts
└── other components
```

The component stories will be collected when you start the dev server and will be available in the design system.

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

You can find all the available tokens in the design system.

#### Views

The views are located in the `src/views` directory:

```text
/src/views/
├── blog-index-view/
├── collection-listing-view/
├── contact-view/
└── ...
```

When creating a new view you should also create stories for it and use the following structure:

```text
/src/views/
├── view-name/
│   ├── view-name.astro
│   ├── view-name.stories.mdx
│   └── view-name.test.ts
└── other views
```

The view stories will be collected when your start the dev server and will be available in the design system.

This way you can test them in isolation both visually through stories and with Vitest tests.

### Adding a new language

To add a new language for this website, you need to create a new JSON file in `src/translations` using the locale as filename. Here are the required steps:

1. `cp content/en content/es` and keep the filenames of the `pages` untranslated,
2. `cp src/translations/en.json src/translations/es.json`,
3. `nano src/translations/es.json`, translate all the keys in your language then save the file,
4. `nano src/translations/index.ts`: in that file, import then reexport your new language,
5. The new language is now available!

### Using localization in templates

If you need to use UI strings or routes in your templates:

1. Make sure the key exist in the translations files or add a new key,
2. Import the `useI18n()` helper for UI strings or `useRouting()` for routes,
3. Use one the provided methods to display your UI string or route.

**DO:**

```astro
---
import { useRouting } from "src/services/routing";
import { useI18n } from "src/utils/helpers/i18n";

const { locale, translate, translatePlural } = useI18n(Astro.currentLocale);
const { routeById } = await useRouting(locale);
const contactRoute = routeById("contact");
---

<p>{translate("some.key.available.in.translations")}</p>
<a href={contactRoute.path}>
  {contactRoute.label}
</a>
<div>
  {translatePlural("some.key.supporting.pluralization", { count: 42 })}
</div>
```

**DON'T:**

```astro
---

---

<a href="/hardcoded-route">Some hardcoded string.</a>
```

### Writing templates for collection pages

Instead of using directly the `getCollection` helper from Astro, you should use the `queryCollection` helper defined in this project. This function helps you query a collection with filters, offset and ordering. `queryCollection` will also resolves every references!

**DO:**

```astro
---
import { queryCollection } from "src/services/collections";

const { entries, total } = await queryCollection("blog.posts", {
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

const rawBlogPosts = await getCollection("blog.posts");
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

As you can see, `queryCollection` helps reduce a lot of boilerplate code and it can also be used to resolve multiple collections at once by providing an array! If you only need to resolve one entry, you can use `queryEntry` instead.

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

## Acknowledgments

* Thanks to [@MoustaphaDev](https://github.com/MoustaphaDev) for the inspiration for my Dev-only pages feature with [astro-dev-only-routes](https://github.com/MoustaphaDev/astro-dev-only-routes).
* Thanks [@Princesseuh](https://github.com/Princesseuh), [@delucis](https://github.com/delucis) and [@HiDeoo](https://github.com/HiDeoo) for the inspiration to handle RSS feeds.
* Thanks [@Princesseuh](https://github.com/Princesseuh) for the inspiration for my custom glob loader.
* Thanks to the [Starlight](https://github.com/withastro/starlight) team for the inspiration on how to handle custom layout for my stories.

## License

The source code is licensed under the [MIT license](./LICENSE).

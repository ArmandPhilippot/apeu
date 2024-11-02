# Armand.Philippot.eu

The source code of [my personal website](https://armand.philippot.eu).

## Setup

1. Clone the repository.
2. Install the dependencies.

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

### Search

The search is powered by [Pagefind](https://pagefind.app/), a fully static search library. It needs to index the contents in advance to be able to work.

There are some caveats in dev mode:

- You need to run `pnpm build` once before executing `pnpm dev` to build the search index and to be able to use the search form.
- If you change the Pagefind config (like adding data attributes to filter the contents), the index will not be automatically rebuilt. You need to perform another build and to execute `pnpm dev` again.
- The indexed images use the built URLs (the ones processed by Astro) so they can't be displayed in dev environment (so for now, I decided to deactivated them).

## Development

Before starting, please follow the instructions in [Setup](#setup).

### Project structure

```text
/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── content/
│   │   └── config.ts
│   ├── lib/
│   │   └── astro/
│   │       └── integrations/
│   ├── pages/
│   │   ├── _dev_design-system/
│   │   │   ├── components/
│   │   │   ├── tokens/
│   │   │   └── index.astro
│   │   ├── index.astro
│   │   └── search.astro
│   ├── styles/
│   ├── types/
│   └── utils/
├── package.json
└── config files
```

In details:

- `public/`: any static assets, like fonts, can be placed in this directory,
- `src/assets/`: any assets that must be processed by Astro (like images) can be placed in this directory,
- `src/components/`: the project components,
- `src/lib/`: the features based on dependencies (e.g. Astro integration),
- `src/pages/`: the special components used to create pages and API routes,
- `src/styles/`: global styles, variables and helpers should be placed in this directory,
- `src/types/`: the Typescript types shared across the application,
- `src/utils/`: all the utilities (constants, helpers, etc.) to build the project.

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

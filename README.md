# Armand.Philippot.eu

The source code of [my personal website](https://armand.philippot.eu).

## Setup

1. Clone the repository.
2. Install the dependencies.

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
│   │   └── index.astro
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

### Components

The components are located in the `src/components` directory and should be organized using the [Atomic Design Methodology](https://atomicdesign.bradfrost.com/chapter-2/):

```text
/src/components/
├── atoms/
├── molecules/
├── organisms/
└── templates/
```

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

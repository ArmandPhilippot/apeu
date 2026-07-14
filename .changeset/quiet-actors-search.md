---
"apeu": minor
---

Migrates the Pagefind integration to the Node.js API and builds the search index automatically in dev mode.

The search index is now built using [Pagefind's Node.js API](https://pagefind.app/docs/node-api/) instead of spawning the `pagefind` CLI through `npx`. Build output is quieter as a result: a single summary line replaces the previous verbose CLI logs.

In dev mode, if no search index is found, the project is now built once automatically before the dev server starts, instead of only warning that you need to run `pnpm build` manually. This means the first `pnpm dev` run after cloning (or after deleting `dist/`) takes longer, but search works out of the box afterwards.

To use a fresh index in dev mode after making changes, you still need to run `pnpm build` before `pnpm dev`.

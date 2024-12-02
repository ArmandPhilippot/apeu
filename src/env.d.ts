/* eslint-disable @typescript-eslint/triple-slash-reference */
/* eslint-disable @typescript-eslint/consistent-type-definitions */
/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly CONTENT_PATH: string | undefined;
}

interface ImportMeta {
  readonly env: Partial<ImportMetaEnv>;
}

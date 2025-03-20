interface ImportMetaEnv {
  readonly CONTENT_PATH: string | undefined;
}

interface ImportMeta {
  readonly env: Partial<ImportMetaEnv>;
}

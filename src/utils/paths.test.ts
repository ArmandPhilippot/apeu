import { afterAll, describe, expect, it, vi } from "vitest";
import { CONFIG } from "./constants";
import {
  getLocaleFromPath,
  getParentDirPath,
  joinPaths,
  removeExtFromPath,
} from "./paths";

vi.mock("./constants", async (importOriginal) => {
  const mod =
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    await importOriginal<typeof import("./constants")>();
  return {
    ...mod,
    CONFIG: {
      ...mod.CONFIG,
      LANGUAGES: {
        ...mod.CONFIG.LANGUAGES,
        AVAILABLE: ["en", "fr", "es"],
        DEFAULT: "en",
      },
    },
  };
});

vi.mock("./i18n", async (importOriginal) => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const mod = await importOriginal<typeof import("./i18n")>();

  return {
    ...mod,
    isAvailableLanguage: vi
      .fn()
      .mockImplementation((locale: string) =>
        ["en", "es", "fr"].includes(locale),
      ),
  };
});

describe("join-paths", () => {
  it("returns a path from path fragments", () => {
    const fragments = ["/some/nested", "./parent/path", "./to/file"];
    const result = joinPaths(...fragments);

    expect(result).toMatchInlineSnapshot(`"/some/nested/parent/path/to/file"`);
  });
});

describe("get-parent-dir-path", () => {
  it("returns the parent directory path from a UNIX-style path", () => {
    const file = "file";
    const parent = "/some/path/to/a";
    const filePath = `${parent}/${file}`;
    const result = getParentDirPath(filePath);

    expect(result).toBe(parent);
  });

  it("returns the parent directory path from a Windows-style path", () => {
    const file = "file";
    const parent = "C:\\some\\path\\to";
    const filePath = `${parent}\\${file}`;
    const result = getParentDirPath(filePath);

    expect(result).toMatchInlineSnapshot(`"C:/some/path/to"`);
  });
});

describe("remove-ext-from-path", () => {
  it("removes the extension from a file path", () => {
    const ext = ".php";
    const filePath = "/some/path/to/a/file";
    const filePathWithExt = `${filePath}${ext}`;
    const result = removeExtFromPath(filePathWithExt);

    expect(result).toBe(filePath);
  });

  it("returns the file path if no extension was found", () => {
    const filePath = "/some/path/to/a/file";
    const result = removeExtFromPath(filePath);

    expect(result).toBe(filePath);
  });
});

describe("get-locale-from-path", () => {
  afterAll(() => {
    vi.resetAllMocks();
  });

  it("returns the locale from a path starting with the locale", () => {
    const path = "/es/some/file.md";
    const locale = getLocaleFromPath(path);

    expect(locale).toBe("es");
  });

  it("returns the locale from a path containing the locale", () => {
    const path = "/some/nested/es/file.md";
    const locale = getLocaleFromPath(path);

    expect(locale).toBe("es");
  });

  it("returns the default locale if no locale was found", () => {
    const path = "/some/nested/file.md";
    const locale = getLocaleFromPath(path);

    expect(locale).toBe(CONFIG.LANGUAGES.DEFAULT);
  });

  it("returns the default locale if the locale was invalid", () => {
    const path = "/ru/some/nested/file.md";
    const locale = getLocaleFromPath(path);

    expect(locale).toBe(CONFIG.LANGUAGES.DEFAULT);
  });
});

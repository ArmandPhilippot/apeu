import { describe, expect, it } from "vitest";
import { getParentDirPath, joinPaths, removeExtFromPath } from "./paths";

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

import { join, parse } from "node:path";
import slash from "slash";

/**
 * Retrieve a path with forward slashes from a list of paths to join.
 *
 * This is a wrapper around the `join` function from `node:path`. It handles
 * Windows paths as well by converting them to a path with forward slashes.
 *
 * @param {...string[]} paths - The paths to join.
 * @returns {string} The result path.
 */
export const joinPaths = (...paths: string[]): string => slash(join(...paths));

/**
 * Retrieve the parent directory path from a file path converted to a path with
 * forward slashes.
 *
 * @param {string} filePath - The file path.
 * @returns {string} The parent directory path.
 */
export const getParentDirPath = (filePath: string): string =>
  parse(slash(filePath)).dir;

/**
 * Remove the extension of a file path.
 *
 * @param {string} filePath - A file path.
 * @returns {string} The file path without extension.
 */
export const removeExtFromPath = (filePath: string): string => {
  const { dir, name } = parse(slash(filePath));
  return `${dir}/${name}`;
};

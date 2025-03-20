import type { ImageFunction } from "astro:content";

/**
 * Create a mock for the `image()` function used in zod schema.
 *
 * @returns {ImageFunction} The `image()` function mocked.
 */
export function createImageMock(): ImageFunction {
  return (() => {
    return {
      _parse: () => {
        return { success: true };
      },
      parse: () => {
        return {};
      },
      safeParse: () => {
        return { success: true, data: {} };
      },
      optional: () => {
        return {
          _parse: () => {
            return { success: true };
          },
          parse: () => {
            return {};
          },
          safeParse: () => {
            return { success: true, data: {} };
          },
        };
      },
    };
  }) as unknown as ImageFunction;
}

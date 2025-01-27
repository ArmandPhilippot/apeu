import type { ImageFunction } from "astro:content";

export function createImageMock(): ImageFunction {
  return (() => ({
    _parse: () => ({ success: true }),
    parse: () => ({}),
    safeParse: () => ({ success: true, data: {} }),
    optional: () => ({
      _parse: () => ({ success: true }),
      parse: () => ({}),
      safeParse: () => ({ success: true, data: {} }),
    }),
  })) as unknown as ImageFunction;
}

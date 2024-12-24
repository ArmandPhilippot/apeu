import type { OneOf, SharedShape } from "../types/utilities";
import { isKeyExistIn } from "./type-checks";

/**
 * Check if the given key is present in both objects.
 *
 * @param {T1} a - An object.
 * @param {T2} b - Another object.
 * @param {string} key - The key to test.
 * @returns {boolean} True if the key is in both objects.
 */
export const hasCommonKey = <
  T1 extends Record<string, unknown>,
  T2 extends Record<string, unknown>,
>(
  a: T1,
  b: T2,
  key: string,
): key is keyof SharedShape<T1, T2> => key in a && key in b;

type SplitObjectResult<
  T extends object | undefined,
  K extends string | undefined,
> =
  T extends Record<string, unknown>
    ? K extends string
      ? { extracted: OneOf<T>; remaining: Omit<T, K> }
      : { extracted?: never; remaining: T }
    : { extracted?: undefined; remaining?: undefined };

export const splitObject = <
  T extends object | undefined,
  K extends string | undefined,
>(
  obj: T,
  key: K,
): SplitObjectResult<T, K> => {
  if (!obj) return {} as SplitObjectResult<T, K>;
  if (!key || !isKeyExistIn(obj, key))
    return { remaining: obj } as SplitObjectResult<T, K>;

  const { [key]: extractedValue, ...remaining } = obj;

  return {
    extracted: { [key]: extractedValue },
    remaining,
  } as SplitObjectResult<T, K>;
};

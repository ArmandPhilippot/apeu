import type { OneOf } from "../types/utilities";
import { isKeyExistIn } from "./type-checks";

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

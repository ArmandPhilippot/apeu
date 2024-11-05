import type { z } from "astro:schema";
import { isKeyExistIn, isObject, isString } from "../../utils/type-checks";
import type { mailData } from "./schema";

export type MailSuccess = {
  message: string;
};

export type MailError = {
  error: Partial<z.inferFlattenedErrors<typeof mailData>>;
};

export type MailAPIResponse = MailSuccess | MailError;

/**
 * Check if the given data matches the MailError shape.
 *
 * @param {unknown} data - The data to check.
 * @returns {boolean} True if the shape matches a MailError object.
 */
export const isMailError = (data: unknown): data is MailError => {
  if (!isObject(data) || !isKeyExistIn(data, "error")) return false;

  return (
    isObject(data.error) &&
    isKeyExistIn(data.error, "formErrors") &&
    Array.isArray(data.error.formErrors)
  );
};

/**
 * Check if the given data matches the MailSuccess shape.
 *
 * @param {unknown} data - The data to check.
 * @returns {boolean} True if the shape matches a MailSuccess object.
 */
export const isMailSuccess = (data: unknown): data is MailSuccess =>
  isObject(data) && isKeyExistIn(data, "message") && isString(data.message);

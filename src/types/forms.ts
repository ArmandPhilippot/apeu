import type { JSX } from "astro/jsx-runtime";

type FormFieldValidation = Pick<
  JSX.InputHTMLAttributes,
  "max" | "maxlength" | "min" | "minlength" | "pattern"
>;

export type FormField<
  T extends Record<string, unknown> = Record<string, unknown>,
> = {
  errors?: string[] | null | undefined;
  hint?: string | null | undefined;
  id: string;
  isDisabled?: boolean | null | undefined;
  isReadonly?: boolean | null | undefined;
  isRequired?: boolean | null | undefined;
  label: string;
  name: keyof T;
  placeholder?: string | null | undefined;
  type: JSX.HTMLInputTypeAttribute | "textarea";
  validation?: FormFieldValidation | null | undefined;
  value: string;
};

import { describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { zodErrorMap } from "./error-map";

const mockTranslate = (key: string, params?: Record<string, string>) => {
  const translations: Record<string, string> = {
    "zod.validation.constraint.at.least": "at least",
    "zod.validation.constraint.more.than": "more than",
    "zod.validation.constraint.over": "over",
    "zod.validation.constraint.at.most": "at most",
    "zod.validation.constraint.less.than": "less than",
    "zod.validation.constraint.under": "under",
    "zod.validation.constraint.greater.than.or.equal":
      "greater than or equal to",
    "zod.validation.constraint.greater.than": "greater than",
    "zod.validation.constraint.less.than.or.equal": "less than or equal to",
    "zod.validation.constraint.smaller.than.or.equal":
      "smaller than or equal to",
    "zod.validation.constraint.smaller.than": "smaller than",
    "zod.validation.constraint.exactly": "exactly",
    "zod.validation.constraint.exactly.equal": "exactly equal",
    "zod.validation.required": "This field is required",
    "zod.validation.invalid.type": `Expected ${params?.expected}, received ${params?.received}`,
    "zod.validation.invalid.literal": `Invalid literal: expected ${params?.expected}`,
    "zod.validation.object.unrecognized.keys": `Unrecognized keys: ${params?.keys}`,
    "zod.validation.invalid.enum": `Expected ${params?.expected}, received ${params?.received}`,
    "zod.validation.number.not.multiple.of": `Not a multiple of ${params?.number}`,
    "zod.validation.number.not.finite": "Number must be finite",
    "zod.validation.number.must.be": `Number must be ${params?.constraint} ${params?.value}`,
    "zod.validation.string.must.contain": `String must be ${params?.constraint} ${params?.quantity} characters`,
    "zod.validation.array.must.contain": `Array must contain ${params?.constraint} ${params?.quantity} items`,
    "zod.validation.date.must.be": `Date must be ${params?.constraint} ${params?.value}`,
  };

  return translations[key] || "Invalid input";
};

vi.mock("../../utils/i18n", () => ({
  useI18n: () => ({
    translate: mockTranslate,
  }),
}));

const testErrorMapping = (schema: z.ZodType, input: unknown) => {
  const result = schema.safeParse(input);

  expect(result.success).toBeFalsy();
  if (!result.success) {
    const issue = result.error.issues[0];
    if (issue) {
      const errorMap = zodErrorMap("en");

      const ctx: z.ErrorMapCtx = {
        defaultError: "Default error",
        data: input,
      };

      const mappedError = errorMap(issue, ctx);
      return mappedError.message;
    }
  }
  return null;
};

describe("zodErrorMap", () => {
  describe("General Validation", () => {
    it("handles unrecognized keys in strict objects", () => {
      const schema = z.object({ name: z.string() }).strict();
      const message = testErrorMapping(schema, { name: "John", extra: "key" });

      expect(message).toContain("Unrecognized keys");
    });

    it("handles deeply nested object validation errors", () => {
      const schema = z.object({
        user: z.object({
          profile: z.object({
            age: z.number().min(18),
          }),
        }),
      });
      const message = testErrorMapping(schema, {
        user: { profile: { age: 16 } },
      });

      expect(message).toBe("Number must be greater than or equal to 18");
    });
  });

  describe("String Constraints", () => {
    it("uses default error for unmapped constraints", () => {
      const schema = z.string().regex(/abc/);
      const message = testErrorMapping(schema, "xyz");

      expect(message).toBe("Invalid input");
    });

    it("handles min constraint with specific message", () => {
      const schema = z.string().min(5);
      const message = testErrorMapping(schema, "abc");

      expect(message).toBe("String must be at least 5 characters");
    });
  });

  describe("Numeric Constraints", () => {
    const numericSchema = z.number();

    it("handles min constraint", () => {
      const schema = numericSchema.min(10);
      const message = testErrorMapping(schema, 9);

      expect(message).toContain("greater than or equal to 10");
    });

    it("handles max constraint", () => {
      const schema = numericSchema.max(5);
      const message = testErrorMapping(schema, 6);

      expect(message).toContain("less than or equal to 5");
    });

    it("handles finite constraint", () => {
      const schema = numericSchema.finite();
      const message = testErrorMapping(schema, Infinity);

      expect(message).toContain("finite");
    });
  });

  describe("Array Constraints", () => {
    it("handles minimum length validation", () => {
      const schema = z.array(z.string()).min(3);
      const message = testErrorMapping(schema, ["one"]);

      expect(message).toContain("Array must contain at least 3 items");
    });
  });

  describe("Enum and Literal Constraints", () => {
    it("handles specific enum validation", () => {
      const schema = z.enum(["RED", "GREEN", "BLUE"]);
      const message = testErrorMapping(schema, "YELLOW");

      expect(message).toContain("Expected 'RED' | 'GREEN' | 'BLUE'");
    });

    it("handles literal value validation", () => {
      const schema = z.literal("exact-value");
      const message = testErrorMapping(schema, "different-value");

      expect(message).toContain("exact-value");
    });
  });

  describe("Advanced Schemas", () => {
    it("handles union type validation", () => {
      const schema = z.union([z.string().min(3), z.number().positive()]);
      const message = testErrorMapping(schema, -5);

      expect(message).toBeTruthy();
    });

    it("handles intersection type errors", () => {
      const schema = z.intersection(
        z.object({ a: z.string() }),
        z.object({ a: z.number() }),
      );
      const message = testErrorMapping(schema, { a: 42 });

      expect(message).toBeTruthy();
    });

    it("handles multiple field errors", () => {
      const schema = z.object({
        name: z.string().min(5),
        age: z.number().positive(),
      });

      const message = testErrorMapping(schema, { name: "abc", age: -10 });

      expect(message).toBeTruthy();
    });
  });
});

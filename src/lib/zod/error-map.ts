import {
  util,
  ZodIssueCode,
  ZodParsedType,
  type ZodErrorMap,
  type ZodInvalidStringIssue,
  type ZodInvalidTypeIssue,
  type ZodTooBigIssue,
  type ZodTooSmallIssue,
} from "zod";
import { useI18n, type TranslateSingularKeys } from "../../utils/i18n";

const atLeastOrMoreThan = (
  isInclusive: boolean,
  translate: TranslateSingularKeys
) =>
  translate(
    isInclusive
      ? "zod.validation.constraint.at.least"
      : "zod.validation.constraint.more.than"
  );

const atLeastOrOver = (
  isInclusive: boolean,
  translate: TranslateSingularKeys
) =>
  translate(
    isInclusive
      ? "zod.validation.constraint.at.least"
      : "zod.validation.constraint.over"
  );

const atMostOrLessThan = (
  isInclusive: boolean,
  translate: TranslateSingularKeys
) =>
  translate(
    isInclusive
      ? "zod.validation.constraint.at.most"
      : "zod.validation.constraint.less.than"
  );

const atMostOrUnder = (
  isInclusive: boolean,
  translate: TranslateSingularKeys
) =>
  translate(
    isInclusive
      ? "zod.validation.constraint.at.most"
      : "zod.validation.constraint.under"
  );

const greaterThanOrEqual = (
  isInclusive: boolean,
  translate: TranslateSingularKeys
) =>
  translate(
    isInclusive
      ? "zod.validation.constraint.greater.than.or.equal"
      : "zod.validation.constraint.greater.than"
  );

const lessThanOrEqual = (
  isInclusive: boolean,
  translate: TranslateSingularKeys
) =>
  translate(
    isInclusive
      ? "zod.validation.constraint.less.than.or.equal"
      : "zod.validation.constraint.less.than"
  );

const smallerThanOrEqual = (
  isInclusive: boolean,
  translate: TranslateSingularKeys
) =>
  translate(
    isInclusive
      ? "zod.validation.constraint.smaller.than.or.equal"
      : "zod.validation.constraint.smaller.than"
  );

const getInvalidTypeMessage = (
  issue: ZodInvalidTypeIssue,
  translate: TranslateSingularKeys
) => {
  if (issue.received === ZodParsedType.undefined) {
    return translate("zod.validation.required");
  }

  return translate("zod.validation.invalid.type", {
    expected: issue.expected,
    received: issue.received,
  });
};

const getInvalidStringMessage = (
  issue: ZodInvalidStringIssue,
  translate: TranslateSingularKeys
) => {
  if (issue.validation === "regex") return translate("zod.validation.invalid");

  if (typeof issue.validation === "object") {
    if ("includes" in issue.validation) {
      return typeof issue.validation.position === "number"
        ? translate("zod.validation.string.include.at.position.invalid", {
            includes: issue.validation.includes,
            position: `${issue.validation.position}`,
          })
        : translate("zod.validation.string.include.invalid", {
            includes: issue.validation.includes,
          });
    }

    if ("startsWith" in issue.validation) {
      return translate("zod.validation.string.start.invalid", {
        start: issue.validation.startsWith,
      });
    }

    if ("endsWith" in issue.validation) {
      return translate("zod.validation.string.end.invalid", {
        end: issue.validation.endsWith,
      });
    }

    util.assertNever(issue.validation);
  }

  return translate("zod.validation.string.type.invalid", {
    type: issue.validation,
  });
};

const getTooSmallMessage = (
  issue: ZodTooSmallIssue,
  translate: TranslateSingularKeys
) => {
  switch (issue.type) {
    case "array":
      return translate("zod.validation.array.must.contain", {
        constraint:
          issue.exact === true
            ? translate("zod.validation.constraint.exactly")
            : atLeastOrMoreThan(issue.inclusive, translate),
        quantity: `${issue.minimum}`,
      });
    case "date":
      return translate("zod.validation.date.must.be", {
        constraint:
          issue.exact === true
            ? translate("zod.validation.constraint.exactly.equal")
            : greaterThanOrEqual(issue.inclusive, translate),
        value: new Date(Number(issue.minimum)).toLocaleDateString(),
      });
    case "number":
      return translate("zod.validation.number.must.be", {
        constraint:
          issue.exact === true
            ? translate("zod.validation.constraint.exactly.equal")
            : greaterThanOrEqual(issue.inclusive, translate),
        value: `${issue.minimum}`,
      });
    case "string":
      return translate("zod.validation.string.must.contain", {
        constraint:
          issue.exact === true
            ? translate("zod.validation.constraint.exactly")
            : atLeastOrOver(issue.inclusive, translate),
        quantity: `${issue.minimum}`,
      });
    default:
      return translate("zod.validation.invalid.input");
  }
};

const getTooBigMessage = (
  issue: ZodTooBigIssue,
  translate: TranslateSingularKeys
) => {
  switch (issue.type) {
    case "array":
      return translate("zod.validation.array.must.contain", {
        constraint:
          issue.exact === true
            ? translate("zod.validation.constraint.exactly")
            : atMostOrLessThan(issue.inclusive, translate),
        quantity: `${issue.maximum}`,
      });
    case "bigint":
      return translate("zod.validation.bigint.must.be", {
        constraint:
          issue.exact === true
            ? translate("zod.validation.constraint.exactly")
            : lessThanOrEqual(issue.inclusive, translate),
        value: `${issue.maximum}`,
      });
    case "date":
      return translate("zod.validation.date.must.be", {
        constraint:
          issue.exact === true
            ? translate("zod.validation.constraint.exactly")
            : smallerThanOrEqual(issue.inclusive, translate),
        value: new Date(Number(issue.maximum)).toLocaleDateString(),
      });
    case "number":
      return translate("zod.validation.number.must.be", {
        constraint:
          issue.exact === true
            ? translate("zod.validation.constraint.exactly")
            : lessThanOrEqual(issue.inclusive, translate),
        value: `${issue.maximum}`,
      });
    case "string":
      return translate("zod.validation.string.must.contain", {
        constraint:
          issue.exact === true
            ? translate("zod.validation.constraint.exactly")
            : atMostOrUnder(issue.inclusive, translate),
        quantity: `${issue.maximum}`,
      });
    default:
      return translate("zod.validation.invalid.input");
  }
};

/* eslint-disable complexity -- I should probably refactor this some day... */
/**
 * Custom error map to translate zod messages.
 *
 * @param {string} currentLocale - A supported locale (fallback to the default locale if not supported).
 * @returns {ZodErrorMap} The custom Zod error map.
 */
export const zodErrorMap =
  (currentLocale: string): ZodErrorMap =>
  (issue, ctx) => {
    const { translate } = useI18n(currentLocale);
    let message = ctx.defaultError;

    switch (issue.code) {
      case ZodIssueCode.invalid_type:
        message = getInvalidTypeMessage(issue, translate);
        break;
      case ZodIssueCode.invalid_literal:
        message = translate("zod.validation.invalid.literal", {
          expected: JSON.stringify(issue.expected, util.jsonStringifyReplacer),
        });
        break;
      case ZodIssueCode.unrecognized_keys:
        message = translate("zod.validation.object.unrecognized.keys", {
          keys: util.joinValues(issue.keys, ", "),
        });
        break;
      case ZodIssueCode.invalid_union:
        message = translate("zod.validation.invalid.input");
        break;
      case ZodIssueCode.invalid_union_discriminator:
        message = translate("zod.validation.invalid.discriminator", {
          expected: util.joinValues(issue.options),
        });
        break;
      case ZodIssueCode.invalid_enum_value:
        message = translate("zod.validation.invalid.enum", {
          expected: util.joinValues(issue.options),
          received: `${issue.received}`,
        });
        break;
      case ZodIssueCode.invalid_arguments:
        message = translate("zod.validation.function.arguments.invalid");
        break;
      case ZodIssueCode.invalid_return_type:
        message = translate("zod.validation.function.return.type.invalid");
        break;
      case ZodIssueCode.invalid_date:
        message = translate("zod.validation.date.invalid");
        break;
      case ZodIssueCode.invalid_string:
        message = getInvalidStringMessage(issue, translate);
        break;
      case ZodIssueCode.too_small:
        message = getTooSmallMessage(issue, translate);
        break;
      case ZodIssueCode.too_big:
        message = getTooBigMessage(issue, translate);
        break;
      case ZodIssueCode.custom:
        message = translate("zod.validation.invalid.input");
        break;
      case ZodIssueCode.invalid_intersection_types:
        message = translate("zod.validation.invalid.intersection.types");
        break;
      case ZodIssueCode.not_multiple_of:
        message = translate("zod.validation.number.not.multiple.of", {
          number: `${issue.multipleOf}`,
        });
        break;
      case ZodIssueCode.not_finite:
        message = translate("zod.validation.number.not.finite");
        break;
      default:
        util.assertNever(issue);
    }

    return { message };
  };
/* eslint-enable complexity */

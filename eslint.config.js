import arphi from "@arphi/eslint-config";
import e18e from "@e18e/eslint-plugin";

export default arphi(
  {
    astro: true,
    jsdoc: true,
    tests: true,
    typescript: true,
    overrides: {
      javascript: {
        "one-var": "off",
      },
    },
  },
  {
    name: "apeu-custom",
    plugins: { e18e },
    rules: {
      "e18e/no-indexof-equality": "off",
      "e18e/prefer-array-from-map": "error",
      "e18e/prefer-array-at": "error",
      "e18e/prefer-array-fill": "error",
      "e18e/prefer-array-to-reversed": "error",
      "e18e/prefer-array-to-sorted": "error",
      "e18e/prefer-array-to-spliced": "error",
      "e18e/prefer-date-now": "error",
      "e18e/prefer-exponentiation-operator": "error",
      "e18e/prefer-includes": "error",
      "e18e/prefer-object-has-own": "error",
      "e18e/prefer-nullish-coalescing": "error",
      "e18e/prefer-regex-test": "error",
      "e18e/prefer-spread-syntax": "error",
      "e18e/prefer-timer-args": "error",
      "e18e/prefer-url-canparse": "error",
    },
  }
);

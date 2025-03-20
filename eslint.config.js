import arphi from "@arphi/eslint-config";

export default arphi({
  astro: true,
  jsdoc: true,
  tests: true,
  typescript: true,
  overrides: {
    unicorn: {
      // It seems there is an issue with this rule when passing options...
      "unicorn/number-literal-case": "error",
    },
  },
});

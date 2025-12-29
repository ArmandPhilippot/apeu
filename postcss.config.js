import postcssGlobalData from "@csstools/postcss-global-data";
import autoprefixer from "autoprefixer";
import postcssPresetEnv from "postcss-preset-env";

/** @type {import('postcss-load-config').Config} */
const postCssConfig = {
  plugins: [
    postcssGlobalData({
      files: ["src/styles/postcss/media-queries.css"],
    }),
    postcssPresetEnv(),
    autoprefixer(),
  ],
};

export default postCssConfig;

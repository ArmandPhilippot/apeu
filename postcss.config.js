import postcssCascadeLayers from "@csstools/postcss-cascade-layers";
import postcssGlobalData from "@csstools/postcss-global-data";
import autoprefixer from "autoprefixer";
import postcssPresetEnv from "postcss-preset-env";

/** @type {import('postcss-load-config').Config} */
const postCssConfig = {
  plugins: [
    /* Disabling onRevertLayerKeyword doesn't seem to do anything... */
    postcssCascadeLayers({ onRevertLayerKeyword: false }),
    postcssGlobalData({
      files: ["src/styles/postcss/media-queries.css"],
    }),
    postcssPresetEnv({
      features: { "cascade-layers": { onRevertLayerKeyword: false } },
    }),
    autoprefixer(),
  ],
};

export default postCssConfig;

import { defineHastPlugin } from "satteri";

export const hastInferRemoteImagesSize = defineHastPlugin({
  name: "hast-infer-remote-images-size",
  element: {
    filter: ["img"],
    visit: (node, ctx) => {
      const { src } = node.properties;
      if (typeof src !== "string" || !src.startsWith("http")) return;

      ctx.replaceNode(node, {
        ...node,
        properties: {
          ...node.properties,
          inferSize: true,
        },
      });
    },
  },
});

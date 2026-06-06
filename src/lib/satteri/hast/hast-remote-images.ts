import { defineHastPlugin } from "satteri";

export const hastRemoteImages = defineHastPlugin({
  name: "hast-remote-images",
  element: {
    filter: ["img"],
    visit: (node, ctx) => {
      const { src, width, height } = node.properties;
      const isRemoteImage = typeof src === "string" && /^https?:\/\//.test(src);

      if (!isRemoteImage) return;

      const hasDimensions =
        typeof width === "number" && typeof height === "number";

      if (!hasDimensions) {
        ctx.replaceNode(node, {
          ...node,
          properties: {
            ...node.properties,
            inferSize: true,
          },
        });
      }
    },
  },
});

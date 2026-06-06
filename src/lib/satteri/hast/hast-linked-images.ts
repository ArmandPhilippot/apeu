import { defineHastPlugin } from "satteri";

export const hastLinkedImages = defineHastPlugin({
  name: "hast-linked-images",
  element: {
    filter: ["a"],
    visit: (node, ctx) => {
      for (const child of node.children) {
        const isImgWithSameSrc =
          child.type === "element" &&
          child.tagName === "img" &&
          child.properties.src === node.properties.href;

        if (isImgWithSameSrc) {
          ctx.replaceNode(node, {
            ...child,
            properties: {
              ...child.properties,
              "data-clickable": true,
            },
          });
        }
      }
    },
  },
});

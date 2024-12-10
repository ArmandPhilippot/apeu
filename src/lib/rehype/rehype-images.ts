import type {
  Doctype,
  ElementContent,
  Element as HastElement,
  Properties,
  Root,
} from "hast";
import isRelativeUrl from "is-relative-url";
import type {
  MdxJsxAttribute,
  MdxJsxExpressionAttribute,
  MdxJsxFlowElementHast,
} from "mdast-util-mdx-jsx";
import type { MdxjsEsmHast } from "mdast-util-mdxjs-esm";
import type { Plugin as UnifiedPlugin } from "unified";
import { visitParents } from "unist-util-visit-parents";
import { isString } from "../../utils/type-checks";

const isImgElement = (
  node: Root | Doctype | MdxjsEsmHast | ElementContent,
): node is HastElement => node.type === "element" && node.tagName === "img";

const isMdxImg = (
  node: Root | Doctype | MdxjsEsmHast | ElementContent,
): node is MdxJsxFlowElementHast =>
  node.type === "mdxJsxFlowElement" && node.name === "img";

const isMdxOrElementImg = (
  node: Root | Doctype | MdxjsEsmHast | ElementContent,
): node is HastElement | MdxJsxFlowElementHast =>
  isImgElement(node) || isMdxImg(node);

const convertNodeToImgEl = (
  node: HastElement | MdxJsxFlowElementHast,
): HastElement => {
  if (node.type === "element") return node;

  return {
    children: [],
    position: node.position,
    properties: Object.fromEntries(
      node.attributes
        .map((attr) => {
          if (attr.type !== "mdxJsxAttribute") return undefined;
          return [attr.name, attr.value];
        })
        .filter((attr) => !!attr),
    ),
    tagName: "img",
    type: "element",
  };
};

const isLinkElement = (
  node: Root | Doctype | MdxjsEsmHast | ElementContent,
): node is HastElement | MdxJsxFlowElementHast =>
  (node.type === "mdxJsxFlowElement" && node.name === "a") ||
  (node.type === "element" && node.tagName === "a");

const isHrefAttr = (
  attr: MdxJsxAttribute | MdxJsxExpressionAttribute,
): attr is MdxJsxAttribute =>
  attr.type === "mdxJsxAttribute" && attr.name === "href";

const getLinkTarget = (link: HastElement | MdxJsxFlowElementHast) => {
  const target =
    link.type === "element"
      ? link.properties.href
      : link.attributes.find(isHrefAttr)?.value;

  return isString(target) ? target : undefined;
};

const isRelativeSrc = (src: string) =>
  isRelativeUrl(src) && !src.startsWith("/");

/**
 * Check if the image needs an `inferSize` prop.
 *
 * All images should have a `width` and `height`. Local images are already
 * handled so we don't need to set those props manually. However, remote images
 * are ignored. So we need to check if those attributes are set or if
 * `inferSize` is defined, if not we should add `inferSize` in this plugin.
 *
 * @param {Properties} props - The image properties.
 * @returns {boolean} True if `inferSize` should be added.
 */
const isInferSizeRequired = (props: Properties): boolean => {
  if (!isString(props.src) || isRelativeSrc(props.src)) return false;
  const hasWidth = !!props.width;
  const hasHeight = !!props.height;
  const hasInferSize = !!props.inferSize;

  return (!hasWidth || !hasHeight) && !hasInferSize;
};

/**
 * Rehype plugin to process images.
 *
 * This plugin is responsible of multiple tasks to avoid walk through the tree multiple times just for images:
 * * converts all images to Hast element so the image does not need to be
 * imported in the MDX file: Astro will do that.
 * * handles images wrapped in a link targeting the image source (the links are
 * removed and a `data-clickable` attribute is added so the link should be
 * added in a custom component).
 * * adds `inferSize` to remote images if `width` and/or `height` are not
 * defined.
 */
export const rehypeImages: UnifiedPlugin<[], Root> = () => (tree, file) => {
  if (file.extname !== ".mdx") return;
  visitParents(tree, (node, ancestors) => {
    if (!isMdxOrElementImg(node)) return;

    const imgParent = ancestors[ancestors.length - 1];

    if (!imgParent?.children) return;

    /* Astro does not process MDX images because it expects them to be
     * imported. So we need to convert them back to a regular img element to
     * avoid duplicating Astro logic to import images. */
    const img = convertNodeToImgEl(node);
    const hasParentLink = isLinkElement(imgParent);
    const linkTarget = hasParentLink ? getLinkTarget(imgParent) : undefined;

    /* When the image is only used with MDX/HTML tags, Astro does not collect
     * its path so we need to add it manually. */
    if (
      isString(img.properties.src) &&
      isRelativeSrc(img.properties.src) &&
      !file.data.astro?.imagePaths?.includes(img.properties.src)
    )
      file.data.astro?.imagePaths?.push(img.properties.src);

    if (
      hasParentLink &&
      isString(img.properties.src) &&
      isRelativeSrc(img.properties.src) &&
      img.properties.src === linkTarget
    ) {
      const linkParent = ancestors[ancestors.length - 2];
      const linkIdx = linkParent?.children.indexOf(imgParent);

      if (!linkParent || typeof linkIdx === "undefined") return;

      linkParent.children[linkIdx] = {
        ...img,
        properties: {
          ...img.properties,
          "data-clickable": "true",
        },
      };
    } else {
      const imgIdx = imgParent.children.indexOf(node);
      imgParent.children[imgIdx] = {
        ...img,
        properties: {
          ...img.properties,
          ...(isInferSizeRequired(img.properties) && { inferSize: true }),
        },
      };
    }
  });
};

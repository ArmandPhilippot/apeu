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
import type {
  Transformer as UnifiedTransformer,
  Plugin as UnifiedPlugin,
} from "unified";
import { visitParents } from "unist-util-visit-parents";
import type { VFile } from "vfile";
import { isString } from "../../utils/type-checks";

const isImgElement = (
  node: Root | Doctype | MdxjsEsmHast | ElementContent
): node is HastElement => node.type === "element" && node.tagName === "img";

const isMdxImg = (
  node: Root | Doctype | MdxjsEsmHast | ElementContent
): node is MdxJsxFlowElementHast =>
  node.type === "mdxJsxFlowElement" && node.name === "img";

const isMdxOrElementImg = (
  node: Root | Doctype | MdxjsEsmHast | ElementContent
): node is HastElement | MdxJsxFlowElementHast =>
  isImgElement(node) || isMdxImg(node);

const isLinkElement = (
  node: Root | Doctype | MdxjsEsmHast | ElementContent
): node is HastElement | MdxJsxFlowElementHast =>
  (node.type === "mdxJsxFlowElement" && node.name === "a") ||
  (node.type === "element" && node.tagName === "a");

const isHrefAttr = (
  attr: MdxJsxAttribute | MdxJsxExpressionAttribute
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

const handleMdxImgConversion = (node: MdxJsxFlowElementHast): HastElement => {
  return {
    children: [],
    position: node.position,
    properties: Object.fromEntries(
      node.attributes
        .map((attr) => {
          if (attr.type !== "mdxJsxAttribute") return undefined;
          return [attr.name, attr.value];
        })
        .filter((attr) => attr !== undefined)
    ),
    tagName: "img",
    type: "element",
  };
};

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
const shouldAddInferSize = (props: Properties): boolean => {
  if (!isString(props.src) || isRelativeSrc(props.src)) return false;
  const hasWidth = props.width !== undefined && props.width !== null;
  const hasHeight = props.height !== undefined && props.height !== null;
  const hasInferSize = props.inferSize === true;

  return (!hasWidth || !hasHeight) && !hasInferSize;
};

const processImageNode = (img: HastElement, file: VFile) => {
  if (
    isString(img.properties.src) &&
    isRelativeSrc(img.properties.src) &&
    Array.isArray(file.data.astro?.imagePaths) &&
    !file.data.astro.imagePaths.includes(img.properties.src)
  ) {
    file.data.astro.imagePaths.push(img.properties.src);
  }

  if (shouldAddInferSize(img.properties)) {
    /* eslint-disable-next-line no-param-reassign -- We need to update the image properties here. */
    img.properties.inferSize = true;
  }
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
 *
 * @returns {UnifiedTransformer<Root>} A transformer function that modifies the AST in place.
 */
export const rehypeImages: UnifiedPlugin<[], Root> =
  (): UnifiedTransformer<Root> => (tree, file) => {
    if (file.extname !== ".mdx") return;

    visitParents(tree, (node, ancestors) => {
      if (!isMdxOrElementImg(node)) return;

      const imgParent = ancestors.at(-1);
      if (imgParent?.children === undefined) return;

      // Convert MDX images to Hast images
      const img = node.type === "element" ? node : handleMdxImgConversion(node);

      const hasParentLink = isLinkElement(imgParent);
      const linkTarget = hasParentLink ? getLinkTarget(imgParent) : undefined;

      processImageNode(img, file);

      if (
        hasParentLink &&
        isString(img.properties.src) &&
        isRelativeSrc(img.properties.src) &&
        img.properties.src === linkTarget
      ) {
        /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Get the grandparent. */
        const linkParent = ancestors.at(-2);
        const linkIdx = linkParent?.children.indexOf(imgParent);

        if (linkParent !== undefined && linkIdx !== undefined) {
          linkParent.children[linkIdx] = {
            ...img,
            properties: { ...img.properties, "data-clickable": "true" },
          };
        }
      } else {
        const imgIdx = imgParent.children.indexOf(node);
        imgParent.children[imgIdx] = img;
      }
    });
  };

import Blockquote from "../atoms/blockquote/blockquote.astro";
import Callout from "../atoms/callout/callout.astro";
import Img from "../atoms/img/img.astro";
import ListItem from "../atoms/list/list-item.astro";
import List from "../atoms/list/list.astro";
import Figure from "./figure.astro";
import Ol from "./ol.astro";
import Placeholder from "./placeholder.astro";

export const components = {
  blockquote: Blockquote,
  callout: Callout,
  div: Placeholder,
  figure: Figure,
  img: Img,
  li: ListItem,
  ol: Ol,
  ul: List,
};

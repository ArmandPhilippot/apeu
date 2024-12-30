import Blockquote from "../atoms/blockquote/blockquote.astro";
import Callout from "../atoms/callout/callout.astro";
import Figcaption from "../atoms/figure/figcaption.astro";
import Img from "../atoms/img/img.astro";
import ListItem from "../atoms/list/list-item.astro";
import List from "../atoms/list/list.astro";
import Figure from "./figure.astro";
import H2 from "./h2.astro";
import H3 from "./h3.astro";
import H4 from "./h4.astro";
import H5 from "./h5.astro";
import H6 from "./h6.astro";
import Link from "./link.astro";
import Ol from "./ol.astro";
import Placeholder from "./placeholder.astro";

export const components = {
  a: Link,
  blockquote: Blockquote,
  callout: Callout,
  div: Placeholder,
  figcaption: Figcaption,
  figure: Figure,
  h2: H2,
  h3: H3,
  h4: H4,
  h5: H5,
  h6: H6,
  img: Img,
  li: ListItem,
  ol: Ol,
  ul: List,
};

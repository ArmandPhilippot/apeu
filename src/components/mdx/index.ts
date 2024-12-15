import Address from "../atoms/address/address.astro";
import Blockquote from "../atoms/blockquote/blockquote.astro";
import Callout from "../atoms/callout/callout.astro";
import Cite from "../atoms/cite/cite.astro";
import Code from "../atoms/code/code.astro";
import Figcaption from "../atoms/figure/figcaption.astro";
import Figure from "../atoms/figure/figure.astro";
import Img from "../atoms/img/img.astro";
import Keystroke from "../atoms/keystroke/keystroke.astro";
import Link from "../atoms/link/link.astro";
import ListItem from "../atoms/list/list-item.astro";
import List from "../atoms/list/list.astro";
import Mark from "../atoms/mark/mark.astro";
import Quote from "../atoms/quote/quote.astro";
import Samp from "../atoms/samp/samp.astro";
import H2 from "./from-generics/h2.astro";
import H3 from "./from-generics/h3.astro";
import H4 from "./from-generics/h4.astro";
import H5 from "./from-generics/h5.astro";
import H6 from "./from-generics/h6.astro";
import Ol from "./from-generics/ol.astro";

export const components = {
  a: Link,
  address: Address,
  blockquote: Blockquote,
  callout: Callout,
  cite: Cite,
  code: Code,
  figcaption: Figcaption,
  figure: Figure,
  h2: H2,
  h3: H3,
  h4: H4,
  h5: H5,
  h6: H6,
  img: Img,
  kbd: Keystroke,
  li: ListItem,
  mark: Mark,
  ol: Ol,
  q: Quote,
  samp: Samp,
  ul: List,
};

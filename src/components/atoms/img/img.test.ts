import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { beforeEach, describe, expect, it } from "vitest";
import favicon from "../../../assets/favicon.png";
import Img from "./img.astro";

type LocalTestContext = {
  container: AstroContainer;
};

const getAstroImagePrefix = (src: string) =>
  `/_image?href=${encodeURIComponent(src)}`;

describe("Img", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
  });

  it<LocalTestContext>("renders an image", async ({ container }) => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(3);

    const alt = "voluptas repellendus nobis";
    const src = "https://placehold.co/600x400";
    const optimizedSrc = getAstroImagePrefix(src);
    const result = await container.renderToString(Img, {
      props: { alt, height: 480, src, width: 640 },
    });

    expect(result).toContain("<img");
    expect(result).toContain(`alt="${alt}"`);
    expect(result).toContain(`src="${optimizedSrc}`);
  });

  it<LocalTestContext>("wraps a remote image with a link to the original source", async ({
    container,
  }) => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(5);

    const alt = "voluptas repellendus nobis";
    const src = "https://placehold.co/600x400";
    const optimizedSrc = getAstroImagePrefix(src);
    const result = await container.renderToString(Img, {
      props: { "data-clickable": "true", alt, height: 480, src, width: 640 },
    });

    expect(result).toContain("<a");
    expect(result).toContain(`href="${src}"`);
    expect(result).toContain("<img");
    expect(result).toContain(`alt="${alt}"`);
    expect(result).toContain(`src="${optimizedSrc}`);
  });

  it<LocalTestContext>("wraps a local image with a link to the original, unoptimized source", async ({
    container,
  }) => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(2);

    const alt = "voluptas repellendus nobis";
    const result = await container.renderToString(Img, {
      props: { "data-clickable": "true", alt, src: favicon },
    });
    const expectedHref = favicon.src.replaceAll("&", "&amp;");

    expect(result).toContain("<a");
    expect(result).toContain(`href="${expectedHref}"`);
  });
});

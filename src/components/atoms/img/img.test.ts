import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { beforeEach, describe, expect, it } from "vitest";
import Img from "./img.astro";

type LocalTestContext = {
  container: AstroContainer;
};

describe("Img", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
  });

  it<LocalTestContext>("renders an image", async ({ container }) => {
    const alt = "voluptas repellendus nobis";
    const src = "https://picsum.photos/640/480";
    const result = await container.renderToString(Img, {
      props: { alt, height: 480, src, width: 640 },
    });

    expect.assertions(3);

    expect(result).toContain("<img");
    expect(result).toContain(`alt="${alt}"`);
    expect(result).toContain(`src="${src}"`);
  });

  it<LocalTestContext>("can wrap an image with a link", async ({
    container,
  }) => {
    const alt = "voluptas repellendus nobis";
    const src = "https://picsum.photos/640/480";
    const result = await container.renderToString(Img, {
      props: { "data-clickable": "true", alt, height: 480, src, width: 640 },
    });

    expect.assertions(5);

    expect(result).toContain("<a");
    expect(result).toContain(`href="${src}"`);
    expect(result).toContain("<img");
    expect(result).toContain(`alt="${alt}"`);
    expect(result).toContain(`src="${src}"`);
  });
});

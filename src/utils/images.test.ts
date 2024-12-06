import { describe, expect, it } from "vitest";
import type { Img } from "../types/data";
import { getImgSrc } from "./images";

describe("get-img-src", () => {
  it("can return the src from an image path", async () => {
    const img = {
      alt: "",
      height: 480,
      src: "https://picsum.photos/640/480",
      width: 640,
    } satisfies Img;
    const src = await getImgSrc(img);

    expect.assertions(1);

    expect(src).toBe(img.src);
  });

  it("can return the src from an imported image", async () => {
    const img = {
      alt: "",
      src: {
        format: "jpg",
        height: 480,
        src: "https://picsum.photos/640/480",
        width: 640,
      },
    } satisfies Img;
    const src = await getImgSrc(img);

    expect.assertions(1);

    expect(src).toBe(img.src.src);
  });

  it("can return the src from the promise of an imported image", async () => {
    const src = "https://picsum.photos/640/480";
    const img = {
      alt: "",
      src: new Promise((resolve) => {
        resolve({
          default: {
            format: "jpg",
            height: 480,
            src,
            width: 640,
          },
        });
      }),
    } satisfies Img;
    const result = await getImgSrc(img);

    expect.assertions(1);

    expect(result).toBe(src);
  });
});

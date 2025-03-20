import { describe, expect, it, vi } from "vitest";
import { getWebsiteUrl } from "./url";

vi.mock("./constants", async (importOriginal) => {
  const mod = await importOriginal<typeof import("./constants")>();
  return {
    ...mod,
    CONFIG: {
      ...mod.CONFIG,
      HOST: "website.test",
      PROTOCOL: "https://",
    },
  };
});

describe("get-website-url", () => {
  it("can return the website url from the config", () => {
    const result = getWebsiteUrl();

    expect(result).toBe("https://website.test");
  });
});

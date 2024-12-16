import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { beforeEach, describe, expect, it } from "vitest";
import Table from "./table.astro";

type LocalTestContext = {
  container: AstroContainer;
};

describe("Table", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
  });

  it<LocalTestContext>("should render a table", async ({ container }) => {
    const body = "id quibusdam eius";
    const result = await container.renderToString(Table, {
      slots: { default: body },
    });

    expect.assertions(2);

    expect(result).toContain("</table>");
    expect(result).toContain(body);
  });
});

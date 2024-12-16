import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { ComponentProps } from "astro/types";
import { beforeEach, describe, expect, it } from "vitest";
import Grid from "./grid.astro";

type LocalTestContext = {
  container: AstroContainer;
};

describe("Grid Component", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
  });

  describe("Rendering", () => {
    it<LocalTestContext>("should render its children", async ({
      container,
    }) => {
      const body = "dolor voluptatem tenetur";
      const result = await container.renderToString(Grid, {
        slots: { default: body },
      });

      expect(result).toContain(body);
    });

    it<LocalTestContext>("should render with default div tag", async ({
      container,
    }) => {
      const result = await container.renderToString(Grid, {
        slots: { default: "test" },
      });

      expect(result).toMatch(/<div/);
    });

    it<LocalTestContext>("should support polymorphic rendering with different tags", async ({
      container,
    }) => {
      const props: ComponentProps<typeof Grid> = { as: "section" };
      const result = await container.renderToString(Grid, {
        props,
        slots: { default: "test" },
      });

      expect(result).toMatch(/<section/);
    });
  });

  describe("CSS Variables and Styling", () => {
    it<LocalTestContext>("should generate correct CSS variables for gap", async ({
      container,
    }) => {
      const props: ComponentProps<typeof Grid> = { gap: "md" };
      const result = await container.renderToString(Grid, {
        props,
        slots: { default: "test" },
      });

      expect(result).toMatch(/--gap: var\(--spacing-md\) var\(--spacing-md\)/);
    });

    it<LocalTestContext>("should generate correct CSS variables for row and column gaps", async ({
      container,
    }) => {
      const props: ComponentProps<typeof Grid> = {
        gap: { row: "sm", col: "lg" },
      };
      const result = await container.renderToString(Grid, {
        props,
        slots: { default: "test" },
      });

      expect(result).toMatch(/--gap: var\(--spacing-sm\) var\(--spacing-lg\)/);
    });

    it<LocalTestContext>("should apply alignment and justify props as CSS variables", async ({
      container,
    }) => {
      const props: ComponentProps<typeof Grid> = {
        alignContent: "center",
        alignItems: "start",
        justifyContent: "space-between",
        justifyItems: "end",
      };
      const result = await container.renderToString(Grid, {
        props,
        slots: { default: "test" },
      });

      expect(result).toMatch(/--align-content: center/);
      expect(result).toMatch(/--align-items: start/);
      expect(result).toMatch(/--justify-content: space-between/);
      expect(result).toMatch(/--justify-items: end/);
    });
  });

  describe("Invalid Property Combinations", () => {
    it<LocalTestContext>("should throw error when cols and templateCols are used together", async ({
      container,
    }) => {
      const body = "dolor voluptatem tenetur";
      const props: ComponentProps<typeof Grid> = {
        cols: 3,
        templateCols: "1fr auto",
      };

      await expect(async () =>
        container.renderToString(Grid, {
          props,
          slots: { default: body },
        }),
      ).rejects.toThrowErrorMatchingInlineSnapshot(
        `[Error: Invalid properties: \`cols\` and \`templateCols\` cannot be used together. Use \`templateCols\` for explicit column definitions, or \`cols\` for responsive defaults.]`,
      );
    });

    it<LocalTestContext>("should throw error when rows and templateRows are used together", async ({
      container,
    }) => {
      const body = "dolor voluptatem tenetur";
      const props: ComponentProps<typeof Grid> = {
        rows: 3,
        templateRows: "1fr auto",
      };

      await expect(async () =>
        container.renderToString(Grid, {
          props,
          slots: { default: body },
        }),
      ).rejects.toThrowErrorMatchingInlineSnapshot(
        `[Error: Invalid properties: \`rows\` and \`templateRows\` cannot be used together. Use \`templateRows\` for explicit row definitions, or \`rows\` for responsive defaults.]`,
      );
    });

    it<LocalTestContext>("should throw error when templateCols is used with sizeMinCols", async ({
      container,
    }) => {
      const body = "dolor voluptatem tenetur";
      const props: ComponentProps<typeof Grid> = {
        sizeMinCols: "200px",
        templateCols: "1fr auto",
      };

      await expect(async () =>
        container.renderToString(Grid, {
          props,
          slots: { default: body },
        }),
      ).rejects.toThrowErrorMatchingInlineSnapshot(
        `[Error: Invalid properties: \`templateCols\` cannot be used together with \`sizeMinCols\` or \`sizeMaxCols\`. Use \`templateCols\` for explicit column definitions, or \`sizeMinCols\` and \`sizeMaxCols\` for responsive defaults.]`,
      );
    });

    it<LocalTestContext>("should throw error when templateCols is used with sizeMaxCols", async ({
      container,
    }) => {
      const body = "dolor voluptatem tenetur";
      const props: ComponentProps<typeof Grid> = {
        sizeMaxCols: "200px",
        templateCols: "1fr auto",
      };

      await expect(async () =>
        container.renderToString(Grid, {
          props,
          slots: { default: body },
        }),
      ).rejects.toThrowErrorMatchingInlineSnapshot(
        `[Error: Invalid properties: \`templateCols\` cannot be used together with \`sizeMinCols\` or \`sizeMaxCols\`. Use \`templateCols\` for explicit column definitions, or \`sizeMinCols\` and \`sizeMaxCols\` for responsive defaults.]`,
      );
    });
  });

  describe("Grid Configuration", () => {
    it<LocalTestContext>("should support 'auto-fill' for cols", async ({
      container,
    }) => {
      const props: ComponentProps<typeof Grid> = { cols: "auto-fill" };
      const result = await container.renderToString(Grid, {
        props,
        slots: { default: "test" },
      });

      expect(result).toContain("auto-fill");
    });

    it<LocalTestContext>("should support 'auto-fit' for cols", async ({
      container,
    }) => {
      const props: ComponentProps<typeof Grid> = { cols: "auto-fit" };
      const result = await container.renderToString(Grid, {
        props,
        slots: { default: "test" },
      });

      expect(result).toContain("auto-fit");
    });

    it<LocalTestContext>("should support custom min and max column sizes", async ({
      container,
    }) => {
      const props: ComponentProps<typeof Grid> = {
        sizeMinCols: "200px",
        sizeMaxCols: "1fr",
      };
      const result = await container.renderToString(Grid, {
        props,
        slots: { default: "test" },
      });

      expect(result).toMatch(/--size-min-cols: 200px/);
      expect(result).toMatch(/--size-max-cols: 1fr/);
    });
  });

  describe("Attribute Passthrough", () => {
    it<LocalTestContext>("should pass through additional attributes", async ({
      container,
    }) => {
      const props: ComponentProps<typeof Grid> = {
        "data-testid": "grid-test",
        id: "my-grid",
      };
      const result = await container.renderToString(Grid, {
        props,
        slots: { default: "test" },
      });

      expect(result).toMatch(/data-testid="grid-test"/);
      expect(result).toMatch(/id="my-grid"/);
    });
  });
});

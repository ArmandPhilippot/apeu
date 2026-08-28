import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { ComponentProps } from "astro/types";
import { beforeEach, describe, expect, it } from "vitest";
import Grid from "./grid.astro";

const DIV_TAG_REGEX = /<div/;
const SECTION_TAG_REGEX = /<section/;
const GAP_MD_REGEX = /--gap: var\(--spacing-md\)/;
const GAP_ROW_COL_REGEX = /--gap: var\(--spacing-sm\) var\(--spacing-lg\)/;
const ALIGN_CONTENT_CENTER_REGEX = /--align-content: center/;
const ALIGN_ITEMS_START_REGEX = /--align-items: start/;
const JUSTIFY_CONTENT_SPACE_BETWEEN_REGEX = /--justify-content: space-between/;
const JUSTIFY_ITEMS_END_REGEX = /--justify-items: end/;
const SIZE_MIN_COLS_200PX_REGEX = /--size-min-cols: 200px/;
const SIZE_MAX_COLS_1FR_REGEX = /--size-max-cols: 1fr/;
const DATA_TESTID_GRID_TEST_REGEX = /data-testid="grid-test"/;
const ID_MY_GRID_REGEX = /id="my-grid"/;

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
      expect.assertions(1);

      const body = "dolor voluptatem tenetur";
      const result = await container.renderToString(Grid, {
        slots: { default: body },
      });

      expect(result).toContain(body);
    });

    it<LocalTestContext>("should render with default div tag", async ({
      container,
    }) => {
      expect.assertions(1);

      const result = await container.renderToString(Grid, {
        slots: { default: "test" },
      });

      expect(result).toMatch(DIV_TAG_REGEX);
    });

    it<LocalTestContext>("should support polymorphic rendering with different tags", async ({
      container,
    }) => {
      expect.assertions(1);

      const props: ComponentProps<typeof Grid> = { as: "section" };
      const result = await container.renderToString(Grid, {
        props,
        slots: { default: "test" },
      });

      expect(result).toMatch(SECTION_TAG_REGEX);
    });
  });

  describe("CSS Variables and Styling", () => {
    it<LocalTestContext>("should generate correct CSS variables for gap", async ({
      container,
    }) => {
      expect.assertions(1);

      const props: ComponentProps<typeof Grid> = { gap: "md" };
      const result = await container.renderToString(Grid, {
        props,
        slots: { default: "test" },
      });

      expect(result).toMatch(GAP_MD_REGEX);
    });

    it<LocalTestContext>("should generate correct CSS variables for row and column gaps", async ({
      container,
    }) => {
      expect.assertions(1);

      const props: ComponentProps<typeof Grid> = {
        gap: { row: "sm", col: "lg" },
      };
      const result = await container.renderToString(Grid, {
        props,
        slots: { default: "test" },
      });

      expect(result).toMatch(GAP_ROW_COL_REGEX);
    });

    it<LocalTestContext>("should apply alignment and justify props as CSS variables", async ({
      container,
    }) => {
      /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
      expect.assertions(4);

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

      expect(result).toMatch(ALIGN_CONTENT_CENTER_REGEX);
      expect(result).toMatch(ALIGN_ITEMS_START_REGEX);
      expect(result).toMatch(JUSTIFY_CONTENT_SPACE_BETWEEN_REGEX);
      expect(result).toMatch(JUSTIFY_ITEMS_END_REGEX);
    });
  });

  describe("Invalid Property Combinations", () => {
    it<LocalTestContext>("should throw error when cols and templateCols are used together", async ({
      container,
    }) => {
      expect.assertions(1);

      const body = "dolor voluptatem tenetur";
      const props: ComponentProps<typeof Grid> = {
        cols: 3,
        templateCols: "1fr auto",
      };

      await expect(async () =>
        container.renderToString(Grid, {
          props,
          slots: { default: body },
        })
      ).rejects.toThrowErrorMatchingInlineSnapshot(
        `[InvalidPropsError: \`cols\` and \`templateCols\` cannot be used together. Use \`templateCols\` for explicit column definitions, or \`cols\` for responsive defaults.]`
      );
    });

    it<LocalTestContext>("should throw error when rows and templateRows are used together", async ({
      container,
    }) => {
      expect.assertions(1);

      const body = "dolor voluptatem tenetur";
      const props: ComponentProps<typeof Grid> = {
        rows: 3,
        templateRows: "1fr auto",
      };

      await expect(async () =>
        container.renderToString(Grid, {
          props,
          slots: { default: body },
        })
      ).rejects.toThrowErrorMatchingInlineSnapshot(
        `[InvalidPropsError: \`rows\` and \`templateRows\` cannot be used together. Use \`templateRows\` for explicit row definitions, or \`rows\` for responsive defaults.]`
      );
    });

    it<LocalTestContext>("should throw error when templateCols is used with sizeMinCols", async ({
      container,
    }) => {
      expect.assertions(1);

      const body = "dolor voluptatem tenetur";
      const props: ComponentProps<typeof Grid> = {
        sizeMinCols: "200px",
        templateCols: "1fr auto",
      };

      await expect(async () =>
        container.renderToString(Grid, {
          props,
          slots: { default: body },
        })
      ).rejects.toThrowErrorMatchingInlineSnapshot(
        `[InvalidPropsError: \`templateCols\` cannot be used together with \`sizeMinCols\` or \`sizeMaxCols\`. Use \`templateCols\` for explicit column definitions, or \`sizeMinCols\` and \`sizeMaxCols\` for responsive defaults.]`
      );
    });

    it<LocalTestContext>("should throw error when templateCols is used with sizeMaxCols", async ({
      container,
    }) => {
      expect.assertions(1);

      const body = "dolor voluptatem tenetur";
      const props: ComponentProps<typeof Grid> = {
        sizeMaxCols: "200px",
        templateCols: "1fr auto",
      };

      await expect(async () =>
        container.renderToString(Grid, {
          props,
          slots: { default: body },
        })
      ).rejects.toThrowErrorMatchingInlineSnapshot(
        `[InvalidPropsError: \`templateCols\` cannot be used together with \`sizeMinCols\` or \`sizeMaxCols\`. Use \`templateCols\` for explicit column definitions, or \`sizeMinCols\` and \`sizeMaxCols\` for responsive defaults.]`
      );
    });
  });

  describe("Grid Configuration", () => {
    it<LocalTestContext>("should support 'auto-fill' for cols", async ({
      container,
    }) => {
      expect.assertions(1);

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
      expect.assertions(1);

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
      /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
      expect.assertions(2);

      const props: ComponentProps<typeof Grid> = {
        sizeMinCols: "200px",
        sizeMaxCols: "1fr",
      };
      const result = await container.renderToString(Grid, {
        props,
        slots: { default: "test" },
      });

      expect(result).toMatch(SIZE_MIN_COLS_200PX_REGEX);
      expect(result).toMatch(SIZE_MAX_COLS_1FR_REGEX);
    });
  });

  describe("Attribute Passthrough", () => {
    it<LocalTestContext>("should pass through additional attributes", async ({
      container,
    }) => {
      /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
      expect.assertions(2);

      const props: ComponentProps<typeof Grid> = {
        "data-testid": "grid-test",
        id: "my-grid",
      };
      const result = await container.renderToString(Grid, {
        props,
        slots: { default: "test" },
      });

      expect(result).toMatch(DATA_TESTID_GRID_TEST_REGEX);
      expect(result).toMatch(ID_MY_GRID_REGEX);
    });
  });
});

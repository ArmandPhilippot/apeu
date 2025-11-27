import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { ComponentProps } from "astro/types";
import { beforeEach, describe, expect, it } from "vitest";
import LabelledField from "./labelled-field.astro";

type LocalTestContext = {
  container: AstroContainer;
};

describe("LabelledField", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
  });

  it<LocalTestContext>("renders the label and field slots", async ({
    container,
  }) => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(2);

    const props = {} satisfies ComponentProps<typeof LabelledField>;
    const label = "nostrum magnam voluptas";
    const field = "pariatur omnis adipisci";
    const result = await container.renderToString(LabelledField, {
      props,
      slots: { field, label },
    });

    expect(result).toContain(label);
    expect(result).toContain(field);
  });

  it<LocalTestContext>("can render a hint slot", async ({ container }) => {
    expect.assertions(1);

    const props = {} satisfies ComponentProps<typeof LabelledField>;
    const label = "nostrum magnam voluptas";
    const field = "pariatur omnis adipisci";
    const hint = "distinctio veniam commodi";
    const result = await container.renderToString(LabelledField, {
      props,
      slots: { field, hint, label },
    });

    expect(result).toContain(hint);
  });

  it<LocalTestContext>("can render an errors slot", async ({ container }) => {
    expect.assertions(1);

    const props = {} satisfies ComponentProps<typeof LabelledField>;
    const label = "nostrum magnam voluptas";
    const field = "pariatur omnis adipisci";
    const errors = "distinctio veniam commodi";
    const result = await container.renderToString(LabelledField, {
      props,
      slots: { errors, field, label },
    });

    expect(result).toContain(errors);
  });

  it<LocalTestContext>("throws an error if the label is missing", async ({
    container,
  }) => {
    expect.assertions(1);

    const field = "pariatur omnis adipisci";
    const props = {} satisfies ComponentProps<typeof LabelledField>;

    await expect(async () =>
      container.renderToString(LabelledField, {
        props,
        slots: { field },
      })
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `[MissingSlotError: A label slot is required.]`
    );
  });

  it<LocalTestContext>("throws an error if the field is missing", async ({
    container,
  }) => {
    expect.assertions(1);

    const label = "nostrum magnam voluptas";
    const props = {} satisfies ComponentProps<typeof LabelledField>;

    await expect(async () =>
      container.renderToString(LabelledField, {
        props,
        slots: { label },
      })
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `[MissingSlotError: A field slot is required.]`
    );
  });
});

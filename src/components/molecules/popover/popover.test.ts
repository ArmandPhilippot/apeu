import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { ComponentProps } from "astro/types";
import { beforeEach, describe, expect, it } from "vitest";
import Popover from "./popover.astro";

type LocalTestContext = {
  container: AstroContainer;
};

describe("Popover", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
  });

  it<LocalTestContext>("renders a label, the modal and a controller", async ({
    container,
  }) => {
    const props = {
      controllerId: "quasi",
      modalId: "tempora",
    } satisfies ComponentProps<typeof Popover>;
    const label = "pariatur dolorem ipsum";
    const modal = "eius alias doloribus";
    const result = await container.renderToString(Popover, {
      props,
      slots: { label, modal },
    });

    expect.assertions(5);

    expect(result).toContain(`type="checkbox"`);
    expect(result).toContain(props.controllerId);
    expect(result).toContain(props.modalId);
    expect(result).toContain(label);
    expect(result).toContain(modal);
  });

  it<LocalTestContext>("can open a modal to the bottom", async ({
    container,
  }) => {
    const props = {
      controllerId: "quasi",
      modalId: "tempora",
      openTo: "bottom",
    } satisfies ComponentProps<typeof Popover>;
    const label = "pariatur dolorem ipsum";
    const modal = "eius alias doloribus";
    const result = await container.renderToString(Popover, {
      props,
      slots: { label, modal },
    });

    expect.assertions(1);

    expect(result).toContain('data-open-to="bottom"');
  });

  it<LocalTestContext>("can open a modal to the left", async ({
    container,
  }) => {
    const props = {
      controllerId: "quasi",
      modalId: "tempora",
      openTo: "left",
    } satisfies ComponentProps<typeof Popover>;
    const label = "pariatur dolorem ipsum";
    const modal = "eius alias doloribus";
    const result = await container.renderToString(Popover, {
      props,
      slots: { label, modal },
    });

    expect.assertions(1);

    expect(result).toContain('data-open-to="left"');
  });

  it<LocalTestContext>("can open a modal to the right", async ({
    container,
  }) => {
    const props = {
      controllerId: "quasi",
      modalId: "tempora",
      openTo: "right",
    } satisfies ComponentProps<typeof Popover>;
    const label = "pariatur dolorem ipsum";
    const modal = "eius alias doloribus";
    const result = await container.renderToString(Popover, {
      props,
      slots: { label, modal },
    });

    expect.assertions(1);

    expect(result).toContain('data-open-to="right"');
  });

  it<LocalTestContext>("can open a modal to the top", async ({ container }) => {
    const props = {
      controllerId: "quasi",
      modalId: "tempora",
      openTo: "top",
    } satisfies ComponentProps<typeof Popover>;
    const label = "pariatur dolorem ipsum";
    const modal = "eius alias doloribus";
    const result = await container.renderToString(Popover, {
      props,
      slots: { label, modal },
    });

    expect.assertions(1);

    expect(result).toContain('data-open-to="top"');
  });

  it<LocalTestContext>("throws an error when the label slot is missing", async ({
    container,
  }) => {
    const props = {
      controllerId: "quasi",
      modalId: "tempora",
    } satisfies ComponentProps<typeof Popover>;
    const modal = "eius alias doloribus";

    expect.assertions(1);

    await expect(async () =>
      container.renderToString(Popover, {
        props,
        slots: { modal },
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `[Error: A label slot is required.]`,
    );
  });

  it<LocalTestContext>("throws an error when the modal slot is missing", async ({
    container,
  }) => {
    const props = {
      controllerId: "quasi",
      modalId: "tempora",
    } satisfies ComponentProps<typeof Popover>;
    const label = "pariatur dolorem ipsum";

    expect.assertions(1);

    await expect(async () =>
      container.renderToString(Popover, {
        props,
        slots: { label },
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `[Error: A modal slot is required.]`,
    );
  });
});

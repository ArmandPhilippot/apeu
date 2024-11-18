import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { ComponentProps } from "astro/types";
import { beforeEach, describe, expect, it } from "vitest";
import Time from "./time.astro";

type LocalTestContext = {
  container: AstroContainer;
};

describe("Time", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
  });

  it<LocalTestContext>("renders a date wrapped in a time element", async ({
    container,
  }) => {
    const date = new Date();
    const props = { date } satisfies ComponentProps<typeof Time>;
    const result = await container.renderToString(Time, { props });

    expect.assertions(2);

    expect(result).toContain(`datetime="${date.toISOString()}"`);
    expect(result).toContain(`${date.getFullYear()}</time>`);
  });

  it<LocalTestContext>("can renders a date and a time wrapped in a time element", async ({
    container,
  }) => {
    const date = new Date();
    const props = { date, showTime: true } satisfies ComponentProps<
      typeof Time
    >;
    const result = await container.renderToString(Time, { props });

    expect.assertions(1);

    expect(result).toContain(
      new Intl.DateTimeFormat(undefined, {
        hour: "numeric",
        minute: "numeric",
      }).format(date),
    );
  });

  it<LocalTestContext>("can renders a date with weekday", async ({
    container,
  }) => {
    const date = new Date();
    const props = { date, showWeekDay: true } satisfies ComponentProps<
      typeof Time
    >;
    const result = await container.renderToString(Time, { props });

    expect.assertions(1);

    expect(result).toContain(
      new Intl.DateTimeFormat(undefined, { weekday: "long" }).format(date),
    );
  });

  it<LocalTestContext>("can renders a date without the day", async ({
    container,
  }) => {
    const date = new Date();
    const props = { date, hideDay: true } satisfies ComponentProps<typeof Time>;
    const result = await container.renderToString(Time, { props });

    expect.assertions(1);

    // It's fragile but the returned date should use the format `day month year`
    expect(result).not.toContain(
      `>${new Intl.DateTimeFormat(undefined, { day: "numeric" }).format(date)}`,
    );
  });

  it<LocalTestContext>("can renders a date without the month", async ({
    container,
  }) => {
    const date = new Date();
    const props = { date, hideMonth: true } satisfies ComponentProps<
      typeof Time
    >;
    const result = await container.renderToString(Time, { props });

    expect.assertions(1);

    expect(result).not.toContain(
      new Intl.DateTimeFormat(undefined, { month: "long" }).format(date),
    );
  });

  it<LocalTestContext>("can renders a date without the year", async ({
    container,
  }) => {
    const date = new Date();
    const props = { date, hideYear: true } satisfies ComponentProps<
      typeof Time
    >;
    const result = await container.renderToString(Time, { props });

    expect.assertions(1);

    expect(result).not.toContain(`${date.getFullYear()}</time>`);
  });
});

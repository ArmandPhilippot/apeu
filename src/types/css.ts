import type { Spacing } from "./tokens";

type Alignment =
  | "baseline"
  | "center"
  | "end"
  | "first baseline"
  | "last baseline"
  | "left"
  | "normal"
  | "right"
  | "start"
  | "space-around"
  | "space-between"
  | "space-evenly"
  | "stretch";

export type AlignContent = Alignment;

export type AlignItems = Alignment;

type DecompoundGap = {
  row?: Spacing | null | undefined;
  col?: Spacing | null | undefined;
};
export type Gap = DecompoundGap | Spacing;

export type JustifyContent = Exclude<
  Alignment,
  "first baseline" | "last baseline"
>;

export type JustifyItems = Alignment;

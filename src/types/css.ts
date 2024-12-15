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

export type JustifyContent = Exclude<
  Alignment,
  "first baseline" | "last baseline"
>;

export type JustifyItems = Alignment;

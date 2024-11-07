export type HeadingNode = {
  children?: HeadingNode[] | null | undefined;
  label: string;
  slug: string;
};

export type HTTPStatus = {
  CODE: number;
  TEXT: string;
};

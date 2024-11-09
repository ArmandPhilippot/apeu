import { CONFIG } from "../../../utils/constants";

const getLocalesPattern = () => {
  if (CONFIG.LANGUAGES.AVAILABLE.length > 1)
    return `(${CONFIG.LANGUAGES.AVAILABLE.join("|")})`;

  return CONFIG.LANGUAGES.DEFAULT;
};

export const getLocalizedPattern = (pattern: string) => {
  const locales = getLocalesPattern();

  return `${locales}${pattern}`;
};

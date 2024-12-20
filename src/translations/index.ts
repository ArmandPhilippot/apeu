import en from "./en.json";
import fr from "./fr.json";

export const translations = { en, fr };

export type AvailableTranslations = keyof typeof translations;

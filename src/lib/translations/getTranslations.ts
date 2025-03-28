import { translations, Language, TranslationKeys } from "./translations";

export const getTranslation = (lang: Language): Record<TranslationKeys, string> => {
  return translations[lang] || translations["en"];
};
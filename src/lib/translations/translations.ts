// Define the translations for supported languages
export const translations = {
  en: {
    validationName: "Name must be at least 2 characters",
    validationEmail: "Invalid email format",
    validationMessage: "Message must be at least 10 characters",
    validationSubjectForm: "New message from contact form",
  },
  pt: {
    validationName: "O nome deve ter pelo menos 2 caracteres",
    validationEmail: "Formato de e-mail inválido",
    validationMessage: "A mensagem deve ter pelo menos 10 caracteres",
    validationSubjectForm: "Nova mensagem do formulário de contato",
  },
} as const; // Define the translations for supported languages

// Define the translations for supported languages
export type Language = keyof typeof translations; // "en" | "pt"

// 🔹 Define a type for the keys of the translation object
export type TranslationKeys = keyof (typeof translations)["en"]; // "validationName" | "validationEmail" | "validationMessage"

// 🔹 Define a type that represents the structure of translations for all supported languages
export type TranslationsType = Record<Language, Record<TranslationKeys, string>>;

// 🔹 Function to retrieve translations for a specific language
export const getTranslation = (lang: Language): Record<TranslationKeys, string> => {
  return translations[lang];
};
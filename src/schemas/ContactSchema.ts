import { z } from "zod";
import { getTranslation } from "../lib/translations/translations";
import { Language } from "@/lib/translations/translations";

export const ContactSchema = (lang: Language) => {
  // Garantir que lang seja válido
  const validLang = (lang === 'pt' || lang === 'en') ? lang : 'en';
  const translations = getTranslation(validLang);

  // Se não conseguiu obter traduções, usar mensagens padrão
  if (!translations) {
    return z.object({
      name: z.string().min(2, { message: "Name must be at least 2 characters" }),
      email: z.string().email({ message: "Invalid email format" }),
      message: z.string().min(10, { message: "Message must be at least 10 characters" }),
      lang: z.string().optional(),
    });
  }

  // Usar traduções com fallback
  return z.object({
    name: z.string().min(2, { 
      message: translations.validationName || "Name must be at least 2 characters" 
    }),
    email: z.string().email({ 
      message: translations.validationEmail || "Invalid email format" 
    }),
    message: z.string().min(10, { 
      message: translations.validationMessage || "Message must be at least 10 characters" 
    }),
    lang: z.string().optional(),
  });
};

export type ContactFormData = z.infer<ReturnType<typeof ContactSchema>>;

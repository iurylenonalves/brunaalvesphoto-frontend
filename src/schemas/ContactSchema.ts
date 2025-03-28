import { z } from "zod";
import { getTranslation } from "../lib/translations/translations";
import { Language } from "@/lib/translations/translations";

export const ContactSchema = (lang: Language) => {
  const translations = getTranslation(lang);

  return z.object({
    name: z.string().min(2, { message: translations.validationName }),
    email: z.string().email({ message: translations.validationEmail }),
    message: z.string().min(10, { message: translations.validationMessage }),
    lang: z.string().optional(),
  });
};

export type ContactFormData = z.infer<ReturnType<typeof ContactSchema>>;

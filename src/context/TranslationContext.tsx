'use client'

import React, { createContext, useContext, useState, useEffect } from "react";
import en from "../app/locales/en.json";
import pt from "../app/locales/pt.json";

// Set the type for the translations, based on the JSON file format.
type Translations = typeof en;


interface TranslationContextType {
  translations: Translations;
  locale: string;
  setLocale: (locale: string) => void;
}

// Set the type for the component's children
interface TranslationProviderProps {
  children: React.ReactNode;
}

// Create the TranslationContext with an initial undefined value
const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

// Add the type to the props component
export const TranslationProvider: React.FC<TranslationProviderProps> = ({ children }) => {
  const [locale, setLocaleState] = useState<string>("en");
  const [translations, setTranslations] = useState<Translations>(en)
  const [isHydrated, setIsHydrated] = useState(false);
  
  // useEffect to sync the locale and translations with the localStorage
  useEffect(() => {
    const savedLocale = localStorage.getItem("locale") || "en";
    console.log("Saved locale:", savedLocale);
    setLocaleState(savedLocale);
    setTranslations(savedLocale === "pt" ? pt : en);
    setIsHydrated(true);
  }, []);

  // Function to set the locale and translations
  const setLocale = (newLocale: string) => {
    setLocaleState(newLocale);
    setTranslations(newLocale === "pt" ? pt : en);
    if (typeof window !== "undefined") {
      localStorage.setItem("locale", newLocale);
    }
  };

  // Prevent rendering until the client-side hydration is complete
  if (!isHydrated) {
    return null;
  }

  // Return the provider with the translations and locale
  return (
    <TranslationContext.Provider value={{ translations, locale, setLocale }}>
      {children}
    </TranslationContext.Provider>
  );
};

// Hook to use the translations
export const useTranslations = (): TranslationContextType => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error("useTranslations must be used within a TranslationProvider");
  }
  return context;
};
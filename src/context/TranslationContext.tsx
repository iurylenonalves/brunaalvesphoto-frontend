'use client'

import React, { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
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
  initialLocale: string;
}

// Create the TranslationContext with an initial undefined value
const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

// Add the type to the props component
export const TranslationProvider: React.FC<TranslationProviderProps> = ({ children, initialLocale }) => {
  const [locale, setLocaleState] = useState<string>(initialLocale);
  const [translations, setTranslations] = useState<Translations>(initialLocale === "pt" ? pt : en);
  const pathname = usePathname();
  //const [isHydrated, setIsHydrated] = useState(false);

  // useEffect to set the initial locale based on the pathname
  useEffect(() => {
    // Extrair locale do pathname: /en/about -> en, /pt/contact -> pt, /about -> detect from initialLocale
    const pathSegments = pathname.split('/').filter(Boolean);
    const potentialLocale = pathSegments[0];
    
    // Only set locale if it's a valid locale
    if (potentialLocale === "pt" || potentialLocale === "en") {
      setLocale(potentialLocale);
    } else {
      // For invalid routes like /about/, /admin/, use the initialLocale or default to 'en'
      const fallbackLocale = (initialLocale === "pt" || initialLocale === "en") ? initialLocale : "en";
      setLocale(fallbackLocale);
    }
  }, [pathname, initialLocale]);
  
  // useEffect to sync the locale and translations with the localStorage
  useEffect(() => {
    const savedLocale = localStorage.getItem("locale");
    if (savedLocale && savedLocale !== locale) {
      setLocaleState(savedLocale);
      setTranslations(savedLocale === "pt" ? pt : en);
    }
  }, [locale]);

  // Function to set the locale and translations
  const setLocale = (newLocale: string) => {
    setLocaleState(newLocale);
    setTranslations(newLocale === "pt" ? pt : en);
    localStorage.setItem("locale", newLocale);
  };

  // Prevent rendering until the client-side hydration is complete
  // if (!isHydrated) {
  //   return null;
  // }

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
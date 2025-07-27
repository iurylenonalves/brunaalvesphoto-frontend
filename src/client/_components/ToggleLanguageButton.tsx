'use client'

import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useTranslations } from "@/context/TranslationContext";
import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "../../styles/toggleLanguageButton.module.css";

interface ToggleLanguageButtonProps {
  slug?: string;
  relatedSlug?: string;
}

const ToggleLanguageButton = ({ slug, relatedSlug }: ToggleLanguageButtonProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { locale, setLocale } = useTranslations();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Preload images to improve performance
    if (typeof window !== 'undefined') {
      const preloadImages = () => {
        const enImg = document.createElement('img');
        enImg.src = '/images/en.svg';
        
        const ptImg = document.createElement('img');
        ptImg.src = '/images/pt.svg';
      };
      
      preloadImages();
    }

    // Check if the device is mobile based on window width
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    }

    checkIfMobile()
    window.addEventListener('resize', checkIfMobile)

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('resize', checkIfMobile)
    }
  }, [])

  // Toggle the language between English and Portuguese
  const toggleLanguage = () => {
    const newLocale = locale === "en" ? "pt" : "en";
    setLocale(newLocale);

    // Se estiver em página de post e houver relatedSlug
    if ((pathname.startsWith("/blog/") || pathname.startsWith("/pt/blog/")) && relatedSlug) {
      // Redireciona para o post relacionado no outro idioma
      const targetPath = newLocale === "pt"
        ? `/pt/blog/${relatedSlug}`
        : `/blog/${relatedSlug}`;
      window.location.href = targetPath;
      return;
    }

    // If on blog page, redirect to the correct locale
    if (pathname.startsWith("/pt/blog")) {
      window.location.href = "/blog";
      return;
    } else if (pathname.startsWith("/blog")) {
      window.location.href = "/pt/blog";
      return;
    }

    // For home and static pages:
    if (pathname === "/" || pathname === "/pt") {
      router.push(newLocale === "en" ? "/" : "/pt/");
      return;
    }

    // Fallback: smooth navigation
    router.push(newLocale === "en" ? "/" : "/pt/");
  };
  
  // Determine which flag to show based on the current locale
  const flagToShow = locale === "en" ? "pt" : "en";
  const flagAlt = locale === "en" ? "Brazilian Flag" : "English Flag";

  return (
    <div className={styles.flagContainer}>
      <button 
        onClick={toggleLanguage} 
        aria-label={`Switch language to ${flagAlt}`}
        className={styles.toggleButton}
      >
        <Image 
          className={styles.flagIcon}
          src={`/images/${flagToShow}.svg`} 
          alt={flagAlt} 
          width={isMobile ? 36 : 64} 
          height={isMobile ? 26 : 48}               
        />     
      </button>
    </div>
  );
};

export default ToggleLanguageButton;
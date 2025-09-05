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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Preload images to improve performance
    const preloadImages = () => {
      const enImg = document.createElement('img');
      enImg.src = '/images/en.svg';
      
      const ptImg = document.createElement('img');
      ptImg.src = '/images/pt.svg';
    };
    
    preloadImages();

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

    console.log('ToggleLanguage Debug:', {
      pathname,
      slug,
      relatedSlug,
      newLocale,
      currentLocale: locale,
      isSlugPage: pathname.includes("/blog/") && slug,
      isBlogListPage: pathname.includes("/blog") && !slug,
      blogPostWithRelated: (pathname.includes("/blog/") && slug) && relatedSlug,
      blogPostWithoutRelated: pathname.includes("/blog/") && slug && !relatedSlug
    });

    // Se estiver em página de post e houver relatedSlug
    if ((pathname.includes("/blog/") && slug) && relatedSlug) {
      console.log('Using relatedSlug navigation');
      // Redireciona para o post relacionado no outro idioma
      const targetPath = newLocale === "pt"
        ? `/pt/blog/${relatedSlug}`
        : `/en/blog/${relatedSlug}`;
      console.log('Redirecting to:', targetPath);
      router.push(targetPath);
      return;
    }

    // Se estiver na página de blog (lista de posts)
    if (pathname.includes("/blog") && !slug) {
      console.log('Using blog list navigation');
      const targetPath = newLocale === "pt" ? "/pt/blog" : "/en/blog";
      console.log('Redirecting to:', targetPath);
      router.push(targetPath);
      return;
    }

    // Se estiver em uma página de post individual sem relatedSlug
    if (pathname.includes("/blog/") && slug && !relatedSlug) {
      console.log('Using individual post navigation without relatedSlug');
      // Mantém na mesma página, apenas muda o locale do contexto
      // A página deve ser recarregada para buscar conteúdo no novo idioma
      const currentPath = pathname.replace(/^\/(en|pt)\//, `/${newLocale}/`);
      console.log('Redirecting to:', currentPath);
      router.push(currentPath);
      return;
    }

    // Para páginas estáticas e home
    if (pathname === "/" || pathname === "/en" || pathname === "/en/") {
      router.push(newLocale === "pt" ? "/pt" : "/en");
      return;
    }
    
    if (pathname === "/pt" || pathname === "/pt/") {
      router.push(newLocale === "en" ? "/en" : "/pt");
      return;
    }

    // Para outras páginas estáticas (about, portfolio, contact)
    const pathWithoutLocale = pathname.replace(/^\/(en|pt)\//, '/');
    const targetPath = `/${newLocale}${pathWithoutLocale}`;
    console.log('Static page navigation to:', targetPath);
    router.push(targetPath);
  };
  
  // Determine which flag to show based on the current locale
  const flagToShow = locale === "en" ? "pt" : "en";
  const flagAlt = locale === "en" ? "Brazilian Flag" : "English Flag";

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className={styles.flagContainer}>
        <button 
          className={styles.toggleButton}
          aria-label="Switch language"
        >
          <div style={{ width: 64, height: 48 }} />
        </button>
      </div>
    );
  }

  return (
    <div className={styles.flagContainer}>
      <button 
        onClick={toggleLanguage} 
        aria-label={`Switch language to ${flagAlt}`}
        className={styles.toggleButton}
        suppressHydrationWarning={true}
      >
        <Image
          className={styles.flagIcon}
          src={`/images/${flagToShow}.svg`} 
          alt={flagAlt} 
          width={isMobile ? 38 : 64}
          height={isMobile ? 27 : 48}
        />
      </button>
    </div>
  );
};

export default ToggleLanguageButton;
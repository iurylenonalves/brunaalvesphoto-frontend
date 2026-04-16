'use client';

import styles from '../../styles/header.module.css';

import { useCallback, useState } from 'react';
//import Image from 'next/image';
import Link from 'next/link';
import { Menu, X, Instagram, MessageCircle } from 'lucide-react';
import { useTranslations } from '@/context/TranslationContext';
import { trackEvent } from '@/lib/gtag';

import ToggleLanguageButton from './ToggleLanguageButton';
import MobileMenu from './MobileMenu';

import { usePathname } from "next/navigation";

interface HeaderProps {
  postSlug?: string;
  relatedSlug?: string;
}

const Header = ({ postSlug, relatedSlug }: HeaderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { translations, locale } = useTranslations();

  const pathname = usePathname();
  // É página home se for / ou /en ou /pt (com ou sem barra final)
  const isHome = pathname === "/" || pathname === "/en" || pathname === "/pt" || pathname === "/en/" || pathname === "/pt/";
  // Garantir que locale seja válido
  const currentLocale = locale === 'pt' ? 'pt' : 'en';

  const toggleMenu = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Logo */}
        <Link href={currentLocale === "pt" ? "/pt" : "/en"} className={styles.logoImg}>
          <picture>
            {/* O navegador escolherá esta source se a media query for verdadeira (tema escuro) */}
            <source
              media="(prefers-color-scheme: dark)"
              srcSet="/images/brunaalvesphoto-logo-white.svg"
            />
            {/* Esta é a imagem padrão (fallback) para tema claro ou se <source> falhar */}
            <img
              src="/images/brunaalvesphoto-logo-black.svg"
              alt="Logo Bruna Alves Photography"
              width={150}
              height={97}
              className={styles.logoImage}
            />
          </picture>
        </Link>

        {/* Menu for large screens */}
        <nav className={styles.nav}>
        <Link
            href={isHome ? "#about" : `/${currentLocale}/about`}
            className={styles.navLink}
            scroll={isHome}
          >
            {translations.about}
          </Link>
          <Link
            href={isHome ? "#portfolio" : `/${currentLocale}/portfolio`}
            className={styles.navLink}
            scroll={isHome}
          >
            {translations.portfolio}
          </Link>
          <Link
            href={`/${currentLocale}/blog`}
            className={styles.navLink}
          >
            Blog
          </Link>
          <Link
            href={isHome ? "#contact" : `/${currentLocale}/contact`}
            className={styles.navLink}
            scroll={isHome}
          >
            {translations.contact}
          </Link>
        </nav>

        {/* Buttons - WhatsApp, Instagram and Language */}
        <div className={styles.buttonGroup}>
          <a
            href={`https://wa.me/447542554870?text=${encodeURIComponent(translations.whatsappMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent('contact_whatsapp', { source: 'header' })}
            className={`${styles.button} ${styles.whatsapp}`}
            aria-label='WhatsApp'
          >
            <MessageCircle size={20} />
            {/* WhatsApp */}
          </a>

          <a
            href="https://www.instagram.com/brunaalvesphoto/"
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.button} ${styles.instagram}`}
            aria-label='Instagram'
          >
            <Instagram size={20} />
            {/* Instagram */}
          </a>

          <ToggleLanguageButton slug={postSlug} relatedSlug={relatedSlug} />
        </div>

        {/* Mobile Controls */}
        <div className={styles.mobileControls}>
          <div className={styles.mobileLanguage}>
            <ToggleLanguageButton slug={postSlug} relatedSlug={relatedSlug} />
          </div>{/* 
           O comentário aqui "come" o espaço/quebra de linha entre os dois elementos,
           fazendo com que eles fiquem encostados.
          */}<button
            className={styles.menuButton} 
            onClick={toggleMenu}
            aria-label={isOpen ? translations.closeMenu : translations.openMenu}
          >
            {isOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>
      </div>

      {/* Dropdown Menu Mobile */}
      {isOpen && (
        <MobileMenu translations={translations} setIsOpen={setIsOpen} locale={currentLocale} />
      )}
    </header>
  );
};

export default Header;
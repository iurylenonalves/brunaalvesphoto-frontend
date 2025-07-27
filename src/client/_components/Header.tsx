'use client';

import styles from '../../styles/header.module.css';

import { useCallback, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, X, Instagram, MessageCircle } from 'lucide-react';
import { useTranslations } from '@/context/TranslationContext';

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
  const isHome = ["/", "/pt", "/pt/"].includes(pathname);

  const toggleMenu = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Logo */}
        <Link href={locale === "pt" ? "/pt" : "/"} className={styles.logoImg}>
        <Image 
          src="/images/bruna-logo-white.svg" 
          alt="Logo" 
          width={150} 
          height={75} 
          priority={true}
        />
        <Image
          src="/images/bruna-logo-black.svg"
          alt="Logo Dark"
          width={150}
          height={75}
          priority={true}
          className={styles.logoImgDark}
        />
        </Link>

        {/* Menu for large screens */}
        <nav className={styles.nav}>
        <Link
            href={isHome ? "#about" : locale === "pt" ? "/pt/about" : "/about"}
            className={styles.navLink}
            scroll={isHome}
          >
            {translations.about}
          </Link>
          <Link
            href={isHome ? "#portfolio" : locale === "pt" ? "/pt/portfolio" : "/portfolio"}
            className={styles.navLink}
            scroll={isHome}
          >
            {translations.portfolio}
          </Link>
          <Link
            href={locale === "pt" ? "/pt/blog" : "/blog"}
            className={styles.navLink}
          >
            Blog
          </Link>
          <Link
            href={isHome ? "#contact" : locale === "pt" ? "/pt/contact" : "/contact"}
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
          {/* Language Toggle for Mobile */}
          <div className={styles.mobileLanguage}>
            <ToggleLanguageButton />
          </div>
          
          {/* Menu Button Mobile */}
          <button 
            className={styles.menuButton} 
            onClick={toggleMenu}
            aria-label={isOpen ? translations.closeMenu : translations.openMenu}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Dropdown Menu Mobile */}
      {isOpen && (
        <MobileMenu translations={translations} setIsOpen={setIsOpen} />
      )}
    </header>
  );
};

export default Header;
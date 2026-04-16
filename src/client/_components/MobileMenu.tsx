'use client';

import styles from '../../styles/header.module.css';
import Link from 'next/link';
import { Instagram, MessageCircle } from 'lucide-react';
import { usePathname } from "next/navigation";
import { trackEvent } from '@/lib/gtag';

interface MobileMenuProps {
  translations: {
    about: string;
    portfolio: string;
    contact: string;
    whatsappMessage: string;
  };
  setIsOpen: (isOpen: boolean) => void;
  locale?: string;
}

const MobileMenu = ({ translations, setIsOpen, locale = "en" }: MobileMenuProps) => {
  const pathname = usePathname();
  const isHome = pathname === "/" || pathname === "/en" || pathname === "/pt" || pathname === "/en/" || pathname === "/pt/";
  // Garantir que locale seja válido
  const currentLocale = locale === 'pt' ? 'pt' : 'en';

  return (
    <nav className={styles.mobileMenu}>
      <Link
        href={isHome ? "#about" : `/${currentLocale}/about`}
        onClick={() => setIsOpen(false)}
        scroll={isHome}
      >
        {translations.about}
      </Link>
      <Link
        href={isHome ? "#portfolio" : `/${currentLocale}/portfolio`}
        onClick={() => setIsOpen(false)}
        scroll={isHome}
      >
        {translations.portfolio}
      </Link>
      <Link
        href={`/${currentLocale}/blog`}
        onClick={() => setIsOpen(false)}
        className={styles.navLink}
      >
        Blog
      </Link>
      <Link
        href={isHome ? "#contact" : `/${currentLocale}/contact`}
        onClick={() => setIsOpen(false)}
        scroll={isHome}
      >
        {translations.contact}
      </Link>

    {/* Menu Button Mobile */}
    <a
      href={`https://wa.me/447542554870?text=${encodeURIComponent(translations.whatsappMessage)}`}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackEvent('contact_whatsapp', { source: 'mobile_menu' })}
      className={`${styles.button} ${styles.whatsapp}`}
      aria-label="WhatsApp"
    >
      <MessageCircle size={20} />
      WhatsApp
    </a>

    <a
      href="https://www.instagram.com/brunaalvesphoto/"
      target="_blank"
      rel="noopener noreferrer"
      className={`${styles.button} ${styles.instagram}`}
      aria-label="Instagram"
    >
      <Instagram size={20} />
      Instagram
    </a>
  </nav>
 );
}
export default MobileMenu;
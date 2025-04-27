'use client';

import styles from '../../styles/header.module.css';
import Link from 'next/link';
import { Instagram, MessageCircle } from 'lucide-react';
import { usePathname } from "next/navigation";

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

const MobileMenu = ({ translations, setIsOpen, locale= "en" }: MobileMenuProps) => {
  const pathname = usePathname();
  const isHome = ["/", "/pt", "/pt/"].includes(pathname);

  return (
    <nav className={styles.mobileMenu}>
      <Link
        href={isHome ? "#about" : locale === "pt" ? "/pt/about" : "/about"}
        onClick={() => setIsOpen(false)}
        scroll={isHome}
      >
        {translations.about}
      </Link>
      <Link
        href={isHome ? "#portfolio" : locale === "pt" ? "/pt/portfolio" : "/portfolio"}
        onClick={() => setIsOpen(false)}
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
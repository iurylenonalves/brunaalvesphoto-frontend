'use client';

import styles from '../../styles/header.module.css';
import Link from 'next/link';
import { Instagram, MessageCircle } from 'lucide-react';

interface MobileMenuProps {
  translations: {
    about: string;
    portfolio: string;
    contact: string;
    whatsappMessage: string;
  };
  setIsOpen: (isOpen: boolean) => void;
}

const MobileMenu = ({ translations, setIsOpen }: MobileMenuProps) => (
  <nav className={styles.mobileMenu}>
    <Link href="#about" onClick={() => setIsOpen(false)}>{translations.about}</Link>
    <Link href="#portfolio" onClick={() => setIsOpen(false)}>{translations.portfolio}</Link>
    <Link href="#contact" onClick={() => setIsOpen(false)}>{translations.contact}</Link>

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

export default MobileMenu;
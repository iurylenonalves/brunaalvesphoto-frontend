"use client";

import footerStyles from "../../styles/footer.module.css";
import { useState } from "react";
import Link from "next/link";
import PrivacyPolicyModal from "./PrivacyPolicyModal";
import { useTranslations } from "@/context/TranslationContext";
import { usePathname } from "next/navigation";

const Footer = () => {
  const { translations, locale } = useTranslations();
  const [isModalOpen, setModalOpen] = useState(false);
  const pathname = usePathname();
  // Corrigir detecção da página home para incluir /en e /en/
  const isHome = ["/", "/en", "/en/", "/pt", "/pt/"].includes(pathname);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <footer className={footerStyles.footer}>
      <div className={footerStyles.container}>       
        <div className={footerStyles.links}>
        <Link
            href={isHome ? "#about" : locale === "pt" ? "/pt/about" : "/en/about"}
            className={footerStyles.link}
            scroll={isHome}
          >
            {translations.footerAbout}
          </Link>
          <Link
            href={`/${locale}/blog`}
            className={footerStyles.link}
          >
            Blog
          </Link>
          <Link
            href={isHome ? "#contact" : locale === "pt" ? "/pt/contact" : "/en/contact"}
            className={footerStyles.link}
            scroll={isHome}
          >
            {translations.footerContact}
          </Link>
          <button onClick={handleOpenModal} className={footerStyles.link}>
            {translations.footerPrivacyPolicy}
          </button>
          <a
            href="https://www.instagram.com/brunaalvesphoto/"
            target="_blank"
            rel="noopener noreferrer"
            className={footerStyles.link}
          >
            Instagram
          </a>
        </div>
        <p className={footerStyles.text}>&copy; {translations.footerRights}</p>
      </div>

      {isModalOpen && <PrivacyPolicyModal onClose={handleCloseModal} />}
    </footer>
  );
};

export default Footer;
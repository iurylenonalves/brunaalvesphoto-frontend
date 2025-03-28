"use client";

import footerStyles from "../../styles/footer.module.css";

import { useState } from "react";
import Link from "next/link";

import PrivacyPolicyModal from "./PrivacyPolicyModal";

import { useTranslations } from "@/context/TranslationContext";


const Footer = () => {
  const { translations } = useTranslations();
  const [isModalOpen, setModalOpen] = useState(false);

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
          <Link href="#about" className={footerStyles.link}>
            {translations.footerAbout}
          </Link>
          <Link href="#contact" className={footerStyles.link}>
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
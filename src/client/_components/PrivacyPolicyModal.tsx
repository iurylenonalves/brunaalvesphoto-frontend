'use client';

import privicyPolicyModalStyles from "../../styles/privacypolicymodal.module.css"; // Estilos específicos para este modal
import { useTranslations } from "@/context/TranslationContext";


interface PrivacyPolicyModalProps {
  onClose: () => void;
}

const PrivacyPolicyModal = ({ onClose }: PrivacyPolicyModalProps) => {
  const { translations } = useTranslations()
  
  return (
    <div className={privicyPolicyModalStyles.modal}>
      <section className={privicyPolicyModalStyles.content}>
      <h1>{translations.privacyPolicyTitle}</h1>
        <h2>{translations.section1Title}</h2>
        <p>
          {translations.section1Content1}<strong>Bruna Alves</strong>
          {translations.section1Content2}
          <strong>{translations.section1Content3}</strong>
          {translations.section1Content4}
          <strong>{translations.section1Content5}</strong>
          {translations.section1Content6}
        </p>
        
        <h2>{translations.section2Title}</h2>
        <p>{translations.section2Content}</p>
        <ul>
          <li>{translations.section2List1}</li>
        </ul>

        <h2>{translations.section3Title}</h2>
        <p>{translations.section3Content}</p>
        <ul>
          <li>{translations.section3List1}</li>
          <li>{translations.section3List2}</li>
          <li>{translations.section3List3}</li>
          <li>{translations.section3List4}</li>
        </ul>

        <h2>{translations.section4Title}</h2>
        <p>{translations.section4Content}</p>

        <h2>{translations.section5Title}</h2>
        <p>{translations.section5Content}</p>

        <h2>{translations.section6Title}</h2>
        <p>{translations.section6Content}</p>
        <ul>
          <li>{translations.section6List1}</li>
          <li>{translations.section6List2}</li>
          <li>{translations.section6List3}</li>
          <li>{translations.section6List4}</li>
        </ul>
        <p>{translations.section6Contact} <strong>brunaphoto.sfa@gmail.com</strong></p>

        <h2>{translations.section7Title}</h2>
        <p>{translations.section7Content}</p>

        <h2>{translations.section8Title}</h2>
        <p>{translations.section8Content}</p>

        <h2>{translations.section9Title}</h2>
        <p>📧<strong> E-mail:</strong> brunaphoto.sfa@gmail.com</p>

        <div className={privicyPolicyModalStyles.buttonContainer}>
          <button className={privicyPolicyModalStyles.closeButton} onClick={onClose}>{translations.privacyPolicyCloseButton}</button>
        </div>          
      </section>
    </div>
  );
};

export default PrivacyPolicyModal;
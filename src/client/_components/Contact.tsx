'use client';

import Image from 'next/image';
import ContactForm from './ContactForm';
import { MessageCircle } from 'lucide-react';
import { useTranslations } from '@/context/TranslationContext';
import { useContactForm } from '@/hooks/useContactForm';


const Contact = () => {
  const { translations, locale } = useTranslations();
  const { formData, errors, status, handleChange, handleSubmit } = useContactForm(locale, translations);

  return (
      <section className="py-16 px-6 bg-gray-50 scrool-mt-16" id="contact">
        <div className="max-w-6xl mx-auto text-center space-y-8">
          <h2 className="text-4xl font-bold text-gray-900">{translations.contactTitle}</h2>
          <div className="flex flex-col md:flex-row items-center justify-center space-y-6 md:space-y-0 md:space-x-12">
            <div className="w-full md:w-1/2">
              <Image
                src="/images/contact-image-large.webp"
                alt={translations.contactTitle}
                className="rounded-lg shadow-lg object-contain w-full"
                width={600}
                height={400}
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
                loading='lazy'
              />
            </div>
            <div className="w-full md:w-1/2 text-left">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center md:text-center">
                {translations.contactSubtitle}
              </h2>              
              <p className="text-lg text-gray-700 mb-4 text-justify">
                {translations.contactText1}
              </p>
              <p className="text-lg text-gray-700 mb-4 text-justify">
                📩 {translations.contactText2}
              </p>
              {/* <p className="text-lg text-gray-700 mb-4 text-justify">
                📸 {translations.contactText3}
              </p> */}
              <div className="mt-8 text-center">
                <a
                  href={`https://wa.me/447542554870?text=${encodeURIComponent(translations.whatsappMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 text-white bg-green-700 text-lg font-semibold rounded-md shadow-md hover:bg-green-800 transition"
                  aria-label={translations.whatsappButton}
                >
                  <MessageCircle size={20} />
                  {translations.whatsappButton}
                </a>

                <ContactForm
                formData={formData}
                handleSubmit={handleSubmit}
                status={status}
                handleChange={handleChange}
                errors={errors}
              />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
};

export default Contact;
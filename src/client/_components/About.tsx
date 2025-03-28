'use client'

import Image from "next/image";
import { MessageCircle } from "lucide-react";
import { useTranslations } from "@/context/TranslationContext";

const About = () => {
  const { translations } = useTranslations()

  return (
    <section className="py-16 px-6 bg-gray-50 scroll-mt-16" id="about">
      <div className="max-w-6xl mx-auto text-center space-y-8">
        <h2 className="text-4xl font-bold text-gray-900">{translations.aboutTitle}</h2>
        <div className="flex flex-col md:flex-row items-center justify-center space-y-6 md:space-y-0 md:space-x-12">
          <div className="w-full md:w-1/2">
            <Image
              src="/images/about-image-large.webp"
              alt="Fotógrafa"
              className="rounded-lg shadow-lg object-cover w-full h-96"
              width={600}
              height={400}
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
              loading="lazy"
            />
          </div>
          <div className="w-full md:w-1/2 text-left">
            <p className="text-lg text-gray-700 leading-relaxed text-justify">
              {translations.aboutText1}
            </p>
            <p className="text-lg text-gray-700 mt-4 leading-relaxed text-justify">
              {translations.aboutText2}
            </p>
            <div className="mt-8 text-center">
                <a
                  href={`https://wa.me/447542554870?text=${encodeURIComponent(translations.whatsappMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 text-white bg-green-700 text-lg font-semibold rounded-md shadow-md hover:bg-green-800 transition"
                >
                  <MessageCircle size={20} />
                  {translations.whatsappButton}
                </a>
              </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
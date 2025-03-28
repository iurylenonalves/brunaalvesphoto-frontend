'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from '@/context/TranslationContext';

const Hero = () => {
  const { translations } = useTranslations()

  return (
    <section className={` relative w-screen h-screen bg-cover bg-center bg-no-repeat `}>
      <Image
          src="/images/hero-image-large.webp"
          alt="Hero background image"
          fill={true}
          style={{ objectFit: "cover" }}
          quality={100}
          priority={true}
        />
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10 flex items-center justify-center h-full text-center text-white px-6">
        <div className="space-y-4" data-aos="fade-up">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight sm:leading-snug md:leading-normal lg:leading-relaxed">
            {translations.heroTitle}
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl">
            {translations.heroSubtitle}
          </p>
          <Link 
            href={`https://wa.me/447542554870?text=${encodeURIComponent(translations.whatsappMessage)}`} 
            className="inline-block mt-6 px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark opacity-60 transition"
            target='_blank'
            rel='noopener noreferrer'
          >
            {translations.contactButton}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
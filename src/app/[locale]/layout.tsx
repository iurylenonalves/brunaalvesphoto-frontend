import { TranslationProvider } from "@/context/TranslationContext";
import type { Metadata } from "next";
import { notFound } from 'next/navigation';

const locales = ['en', 'pt'];

// This function tells Next.js that you only support 'en' and 'pt'
export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// Generates metadata dynamically based on the language
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = "https://brunaalvesphoto.com";

  if (locale === 'pt') {
    return {
      title: "Fotógrafa Brasileira em Londres",
      description: "Quer transformar seus momentos em registros inesquecíveis? Seja para sua viagem, sua marca ou um retrato especial, estou aqui para capturar sua essência em cada clique.",
      alternates: {
        canonical: `${baseUrl}/pt/`,
        languages: {
          "pt": `${baseUrl}/pt/`,
          "en": `${baseUrl}/`,
        },
      },
      openGraph: {
        title: "Fotógrafa Brasileira em Londres",
        description: "Quer transformar seus momentos em registros inesquecíveis? Seja para sua viagem, sua marca ou um retrato especial, estou aqui para capturar sua essência em cada clique.",
        type: "website",
        locale: "pt_BR",
        url: `${baseUrl}/pt/`,
        siteName: "Fotógrafa Brasileira em Londres",
        images: [
          { 
            url: `${baseUrl}/images/hero-image-large.webp`,
            width: 1200,
            height: 630,
            alt: "Fotógrafa Brasileira em Londres",
            type: "image/webp"
          },
          { 
            url: `${baseUrl}/images/about-image-large.webp`,
            width: 1200,
            height: 630,
            alt: "Bruna Alves - Fotógrafa Profissional em Londres",
            type: "image/webp"
          }
        ],
      },
    };
  }

  // Default for 'en'
  return {
    title: "Brazilian Photographer in London",
    description: "Want to turn your moments into unforgettable memories? Whether for your trip, your brand, or a special portrait, I'm here to capture your essence in every click.",
    alternates: {
      canonical: `${baseUrl}/`,
      languages: {
        "en": `${baseUrl}/`,
        "pt": `${baseUrl}/pt/`,
      },
    },
    openGraph: {
      title: "Brazilian Photographer in London",
      description: "Want to turn your moments into unforgettable memories? Whether for your trip, your brand, or a special portrait, I'm here to capture your essence in every click.",
      type: "website",
      locale: "en_GB",
      url: `${baseUrl}/`,
      siteName: "Brazilian Photographer in London",
      images: [
        { 
          url: `${baseUrl}/images/hero-image-large.webp`,
          width: 1200,
          height: 630,
          alt: "Brazilian Photographer in London",
          type: "image/webp"
        },
        { 
          url: `${baseUrl}/images/about-image-large.webp`,
          width: 1200,
          height: 630,
          alt: "Bruna Alves - Professional Photographer in London",
          type: "image/webp"
        }
      ],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
   if (!locales.includes(locale)) {
    notFound();
  }
  return (
    // Provides the translation context for all child pages
    <TranslationProvider initialLocale={locale}>
      {children}
    </TranslationProvider>
  );
}
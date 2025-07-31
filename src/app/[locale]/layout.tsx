import { TranslationProvider } from "@/context/TranslationContext";
import type { Metadata } from "next";

// Esta função diz ao Next.js que você só suporta 'en' e 'pt'
export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'pt' }];
}

// Gera os metadados dinamicamente com base no idioma
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

  // Padrão para 'en'
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


// Este é o layout que envolve as páginas de cada idioma
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    // Fornece o contexto de tradução para todas as páginas filhas
    <TranslationProvider initialLocale={locale}>
      {children}
    </TranslationProvider>
  );
}
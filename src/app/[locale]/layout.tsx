import { TranslationProvider } from "@/context/TranslationContext";
import type { Metadata } from "next";

// Esta função diz ao Next.js que você só suporta 'en' e 'pt'
export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'pt' }];
}

// Gera os metadados dinamicamente com base no idioma
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = new URL("https://www.brunaalvesphoto.com");

  if (locale === 'pt') {
    return {
      title: "Fotógrafa Brasileira em Londres",
      description: "Quer transformar seus momentos em registros inesquecíveis? Seja para sua viagem, sua marca ou um retrato especial, estou aqui para capturar sua essência em cada clique.",
      metadataBase: baseUrl,
      alternates: {
        canonical: "/pt",
        languages: {
          "pt-BR": "/pt",
          "en-GB": "/",
          "x-default": "/",
        },
      },
      openGraph: {
        title: "Fotógrafa Brasileira em Londres",
        description: "Quer transformar seus momentos em registros inesquecíveis?...",
        type: "website",
        locale: "pt_BR",
        url: "/pt",
        siteName: "Fotógrafa Brasileira em Londres",
        images: [
          { 
            url: "/images/hero-image-large.webp",
            width: 1200,
            height: 630,
            alt: "Fotógrafa Brasileira em Londres"
          }
        ],
      },
    };
  }

  // Padrão para 'en'
  return {
    title: "Brazilian Photographer in London",
    description: "Want to turn your moments into unforgettable memories? Whether for your trip, your brand, or a special portrait, I'm here to capture your essence in every click.",
    metadataBase: baseUrl,
    alternates: {
      canonical: "/",
      languages: {
        "en-GB": "/",
        "pt-BR": "/pt",
        "x-default": "/",
      },
    },
    openGraph: {
      title: "Brazilian Photographer in London",
      description: "Want to turn your moments into unforgettable memories?...",
      type: "website",
      locale: "en_GB",
      url: "/",
      siteName: "Brazilian Photographer in London",
      images: [
        { 
          url: "/images/hero-image-large.webp",
          width: 1200,
          height: 630,
          alt: "Brazilian Photographer in London"
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
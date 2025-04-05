import { Metadata } from "next";

// Metadados estáticos para rotas em português
export const metadata: Metadata = {
  title: "Fotógrafa Brasileira em Londres",
  description:
    "Quer transformar seus momentos em registros inesquecíveis? Seja para sua viagem, sua marca ou um retrato especial, estou aqui para capturar sua essência em cada clique.",
  metadataBase: new URL("https://www.brunaalvesphoto.com"),
  alternates: {
    canonical: "/pt",
    languages: {
      "pt": "/pt",
      "en": "/",
    },
  },  // Removido o /pt do metadataBase
  openGraph: {
    title: "Fotógrafa Brasileira em Londres",
    description:
      "Quer transformar seus momentos em registros inesquecíveis? Seja para sua viagem, sua marca ou um retrato especial, estou aqui para capturar sua essência em cada clique.",
    type: "website",
    locale: "pt_BR",
    url: "https://www.brunaalvesphoto.com/pt",  // Mantém esta URL para indicar a versão PT
    siteName: "Fotógrafa Brasileira em Londres",
    images: [
      { 
        url: "https://www.brunaalvesphoto.com/images/hero-image-large.webp",  // URL absoluta
        width: 1200,
        height: 630,
        alt: "Fotógrafa Brasileira em Londres"
      }
    ],
  },
};

export default function PtLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
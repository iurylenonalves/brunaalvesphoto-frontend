import { Metadata } from "next";


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
  },
  openGraph: {
    title: "Fotógrafa Brasileira em Londres",
    description:
      "Quer transformar seus momentos em registros inesquecíveis? Seja para sua viagem, sua marca ou um retrato especial, estou aqui para capturar sua essência em cada clique.",
    type: "website",
    locale: "pt_BR",
    url: "https://www.brunaalvesphoto.com/pt", 
    siteName: "Fotógrafa Brasileira em Londres",
    images: [
      { 
        url: "https://www.brunaalvesphoto.com/images/hero-image-large.webp",
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
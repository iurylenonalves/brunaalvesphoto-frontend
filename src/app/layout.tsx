import { Questrial, Raleway } from "next/font/google";
import "./globals.css";
import type { Metadata } from "next";
import { AosInit } from "@/client/_components/aos-init";



const questrial = Questrial({
  weight: ["400"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-questrial",
});

const raleway = Raleway({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-raleway",
});

// Metadados estáticos para rotas em inglês
const metadataEn: Metadata = {
  title: "Brazilian Photographer in London",
  description:
    "Want to turn your moments into unforgettable memories? Whether for your trip, your brand, or a special portrait, I'm here to capture your essence in every click.",
  metadataBase: new URL("https://www.brunaalvesphoto.com"),
  openGraph: {
    title: "Brazilian Photographer in London",
    description:
      "Want to turn your moments into unforgettable memories? Whether for your trip, your brand, or a special portrait, I'm here to capture your essence in every click.",
    type: "website",
    locale: "en_GB",
    url: "https://www.brunaalvesphoto.com",
    siteName: "Brazilian Photographer in London",
    images: [{ url: "/images/hero-image-large.webp" }],
  },
};

// Metadados estáticos para rotas em português
const metadataPt: Metadata = {
  title: "Fotógrafa Brasileira em Londres",
  description:
    "Quer transformar seus momentos em registros inesquecíveis? Seja para sua viagem, sua marca ou um retrato especial, estou aqui para capturar sua essência em cada clique.",
  metadataBase: new URL("https://www.brunaalvesphoto.com/pt"),
  openGraph: {
    title: "Fotógrafa Brasileira em Londres",
    description:
      "Quer transformar seus momentos em registros inesquecíveis? Seja para sua viagem, sua marca ou um retrato especial, estou aqui para capturar sua essência em cada clique.",
    type: "website",
    locale: "pt_BR",
    url: "https://www.brunaalvesphoto.com/pt",
    siteName: "Fotógrafa Brasileira em Londres",
    images: [{ url: "/images/hero-image-large.webp" }],
  },
};

// Exporta os metadados com base na rota
export const metadata: Metadata = {
  title: "Default Title", // Será sobrescrito dinamicamente
  description: "Default Description", // Será sobrescrito dinamicamente
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = typeof window !== "undefined" ? window.location.pathname : "/";

  const isEnglish = pathname === "/" || pathname.startsWith("/en");
  
  return (
    <html lang={isEnglish ? "en" : "pt"}>
      <head>
      <title>{String(isEnglish ? metadataEn.title : metadataPt.title)}</title>
      <meta name="description" content={String(isEnglish ? metadataEn.description : metadataPt.description)} />
        <link rel="alternate" href="https://www.brunaalvesphoto.com/" hrefLang="en" />
        <link rel="alternate" href="https://www.brunaalvesphoto.com/pt/" hrefLang="pt" />
        <link rel="alternate" href="https://www.brunaalvesphoto.com/" hrefLang="x-default" />
      </head>
      <body className={`${questrial.variable} ${raleway.variable} antialiased`}
      >
        {children}
        <AosInit/>        
      </body>
    </html>
  );
}

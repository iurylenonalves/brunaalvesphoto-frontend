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

// Metadados estáticos para inglês (padrão)
export const metadata: Metadata = {
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Script para detecção de idioma
  const scriptContent = `
    (function() {
      const pathname = window.location.pathname;
      const isPt = pathname.startsWith('/pt');
      
      // Define o atributo lang no elemento html
      document.documentElement.lang = isPt ? 'pt' : 'en';
      
      // Atualiza os metadados dinamicamente se estiver na versão PT
      if (isPt) {
        document.title = "Fotógrafa Brasileira em Londres";
        
        // Verifica se os elementos existem antes de tentar modificá-los
        const descriptionTag = document.querySelector('meta[name="description"]');
        if (descriptionTag) {
          descriptionTag.setAttribute('content', "Quer transformar seus momentos em registros inesquecíveis? Seja para sua viagem, sua marca ou um retrato especial, estou aqui para capturar sua essência em cada clique.");
        }
        
        const ogTitleTag = document.querySelector('meta[property="og:title"]');
        if (ogTitleTag) {
          ogTitleTag.setAttribute('content', "Fotógrafa Brasileira em Londres");
        }
        
        const ogDescTag = document.querySelector('meta[property="og:description"]');
        if (ogDescTag) {
          ogDescTag.setAttribute('content', "Quer transformar seus momentos em registros inesquecíveis? Seja para sua viagem, sua marca ou um retrato especial, estou aqui para capturar sua essência em cada clique.");
        }
        
        const ogUrlTag = document.querySelector('meta[property="og:url"]');
        if (ogUrlTag) {
          ogUrlTag.setAttribute('content', "https://www.brunaalvesphoto.com/pt");
        }
        
        const ogLocaleTag = document.querySelector('meta[property="og:locale"]');
        if (ogLocaleTag) {
          ogLocaleTag.setAttribute('content', "pt_BR");
        }
        
        const ogSiteNameTag = document.querySelector('meta[property="og:site_name"]');
        if (ogSiteNameTag) {
          ogSiteNameTag.setAttribute('content', "Fotógrafa Brasileira em Londres");
        }
      }
    })();
  `;

  return (
    <html>
      <head>
        {/* Metadados serão injetados pelo Next.js usando o objeto metadata exportado */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="alternate" href="https://www.brunaalvesphoto.com/" hrefLang="en" />
        <link rel="alternate" href="https://www.brunaalvesphoto.com/pt/" hrefLang="pt" />
        <link rel="alternate" href="https://www.brunaalvesphoto.com/" hrefLang="x-default" />
        
        {/* Script para detecção de idioma no cliente */}
        <script dangerouslySetInnerHTML={{ __html: scriptContent }} />
      </head>
      <body className={`${questrial.variable} ${raleway.variable} antialiased`}>
        {children}
        <AosInit />
      </body>
    </html>
  );
}
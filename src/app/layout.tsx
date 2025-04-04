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

export const metadata: Metadata = {
  title: "Fotógrafa Brasileira em Londres",
  description: "Quer transformar seus momentos em registros inesquecíveis? Seja para sua viagem, sua marca ou um retrato especial, estou aqui para capturar sua essência em cada clique.",
  metadataBase: new URL("https://www.brunaalvesphoto.com"),
  openGraph: {
    title: "Fotógrafa Brasileira em Londres",
    description: "Quer transformar seus momentos em registros inesquecíveis? Seja para sua viagem, sua marca ou um retrato especial, estou aqui para capturar sua essência em cada clique.",
    type: "website",
    locale: "en_GB",
    url: "https://www.brunaalvesphoto.com",
    siteName: "Fotógrafa Brasileira em Londres",
    images: [{ url: "/images/hero-image-large.webp" }],
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html lang="en">
      <head>
      <link rel="alternate" href="https://www.brunaalvesphoto.com/" hrefLang="en" />
        <link rel="alternate" href="https://www.brunaalvesphoto.com/pt/" hrefLang="pt" />
        <link rel="alternate" href="https://www.brunaalvesphoto.com/" hrefLang="x-default" />
      </head>
      <body
        className={`${questrial.variable} ${raleway.variable} antialiased`}
      >
          {children}
        <AosInit/>        
      </body>
    </html>
  );
}

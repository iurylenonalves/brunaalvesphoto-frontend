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
    images: [
      { 
        url: "https://www.brunaalvesphoto.com/images/hero-image-large.webp",  // URL absoluta
        width: 1200,
        height: 630,
        alt: "Brazilian Photographer in London"
      }
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>        
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="alternate" href="https://www.brunaalvesphoto.com/" hrefLang="en" />
        <link rel="alternate" href="https://www.brunaalvesphoto.com/pt/" hrefLang="pt" />
        <link rel="alternate" href="https://www.brunaalvesphoto.com/" hrefLang="x-default" />
        <link rel="canonical" href="https://www.brunaalvesphoto.com/" />        
      </head>
      <body className={`${questrial.variable} ${raleway.variable} antialiased`}>
        {children}
        <AosInit />
      </body>
    </html>
  );
}
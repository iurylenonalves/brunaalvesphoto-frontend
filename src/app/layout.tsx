import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Questrial, Raleway } from "next/font/google";
import "./globals.css";
import type { Metadata } from "next";
import { AosInit } from "@/client/_components/aos-init";
import { AuthProvider } from "@/client/_components/AuthContext";
import StructuredData from "@/client/_components/StructuredData";


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
  description: "Want to turn your moments into unforgettable memories? Whether for your trip, your brand, or a special portrait, I'm here to capture your essence in every click.",
  keywords: ['London photographer', 'tourism photography', 'corporate photography', 'studio photography', 'Bruna Alves', 'professional photographer'],
  authors: [{ name: 'Bruna Alves' }],
  creator: 'Bruna Alves',
  publisher: 'Bruna Alves Photography',
  metadataBase: new URL("https://brunaalvesphoto.com"),
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  alternates: {
    canonical: 'https://brunaalvesphoto.com',
    languages: {
      'en': 'https://brunaalvesphoto.com',
      'pt': 'https://brunaalvesphoto.com/pt',
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "Brazilian Photographer in London",
    description: "Want to turn your moments into unforgettable memories? Whether for your trip, your brand, or a special portrait, I'm here to capture your essence in every click.",
    type: "website",
    locale: "en_GB",
    url: "https://brunaalvesphoto.com",
    siteName: "Brazilian Photographer in London",
    images: [
      { 
        url: "/images/hero-image-large.webp",
        width: 1200,
        height: 630,
        alt: "Brazilian Photographer in London",
        type: "image/webp"
      },
      { 
        url: "/images/about-image-large.webp",
        width: 1200,
        height: 630,
        alt: "Bruna Alves - Professional Photographer in London",
        type: "image/webp"
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Brazilian Photographer in London",
    description: "Want to turn your moments into unforgettable memories? Whether for your trip, your brand, or a special portrait, I'm here to capture your essence in every click.",
    images: ['/images/hero-image-large.webp'],
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
      </head>
      <body className={`${questrial.variable} ${raleway.variable} antialiased`}>
        <StructuredData />
        <AuthProvider>
          {children}
        </AuthProvider>
        <AosInit />
        <Analytics />
        <SpeedInsights /> 
      </body>
    </html>
  );
}
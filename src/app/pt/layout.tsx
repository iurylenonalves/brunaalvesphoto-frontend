import { Metadata } from "next";

// Metadados estáticos para rotas em português
export const metadata: Metadata = {
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

export default function PtLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
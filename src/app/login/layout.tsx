import { TranslationProvider } from "@/context/TranslationContext";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - Brazilian Photographer in London",
  description: "Admin login for Bruna Alves Photography",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TranslationProvider initialLocale="en">
      {children}
    </TranslationProvider>
  );
}

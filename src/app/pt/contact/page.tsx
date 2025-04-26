import Contact from "@/client/_components/Contact";
import Header from "@/client/_components/Header";
import Footer from "@/client/_components/Footer";
import { TranslationProvider } from "@/context/TranslationContext";

export default function ContactPagePT() {
  return (
    <TranslationProvider initialLocale="pt">
      <main
        style={{
          paddingTop: "100px",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#f9fafb",
        }}
      >
        <Header />
        <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Contact />
        </div>
        <Footer />
      </main>
    </TranslationProvider>
  );
}
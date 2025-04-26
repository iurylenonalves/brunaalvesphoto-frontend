import About from "@/client/_components/About";
import Header from "@/client/_components/Header";
import Footer from "@/client/_components/Footer";
import { TranslationProvider } from "@/context/TranslationContext";

export default function AboutPage() {
  return (
    <TranslationProvider initialLocale="en">
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
          <About />
        </div>
        <Footer />
      </main>
    </TranslationProvider>
  );
}
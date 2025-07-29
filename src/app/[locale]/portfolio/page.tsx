import Portfolio from "@/client/_components/Portfolio";
import Header from "@/client/_components/Header";
import Footer from "@/client/_components/Footer";
//import { TranslationProvider } from "@/context/TranslationContext";

export default function PortfolioPage() {
  return (
    //<TranslationProvider initialLocale="en">
      <main
        style={{
          paddingTop: "100px",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Header />
        <div style={{ flex: 1 }}>
          <Portfolio />
        </div>
         <Footer />
      </main>
    //</TranslationProvider>
  );
}
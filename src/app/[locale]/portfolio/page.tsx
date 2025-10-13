import Portfolio from "@/client/_components/Portfolio";
import Header from "@/client/_components/Header";
import Footer from "@/client/_components/Footer";

export default async function PortfolioPage(
  { params }: { params: Promise<{ locale: string }> }
) {
  const { locale: _locale } = await params;

  return (
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
          <Portfolio isStandalonePage={true} />
        </div>
         <Footer />
      </main>
  );
}
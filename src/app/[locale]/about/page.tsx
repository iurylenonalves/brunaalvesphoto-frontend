import About from "@/client/_components/About";
import Header from "@/client/_components/Header";
import Footer from "@/client/_components/Footer";

export default async function AboutPage(
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
          backgroundColor: "#f9fafb",
        }}
      >
        <Header />
        <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
          <About isStandalonePage={true} />
        </div>
        <Footer />
      </main>
  );
}
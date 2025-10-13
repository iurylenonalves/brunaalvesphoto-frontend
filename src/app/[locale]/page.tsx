import About from "@/client/_components/About";
import Contact from "@/client/_components/Contact";
import Footer from "@/client/_components/Footer";
import Header from "@/client/_components/Header";
import Hero from "@/client/_components/Hero";
import Portfolio from "@/client/_components/Portfolio";

export default async function Home(
  { params }: { params: Promise<{ locale: string }> }
) {
  const { locale } = await params;
  console.log('>>> HOME PAGE ([locale]/page.tsx) RENDERED FOR LOCALE:', locale);
  return (
    <main>
      <Header />
      <Hero />
      <About />
      <Portfolio />
      <Contact />
      <Footer />
    </main>
  );
}
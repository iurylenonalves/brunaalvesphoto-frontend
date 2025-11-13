import dynamic from 'next/dynamic';
import About from "@/client/_components/About";
import Footer from "@/client/_components/Footer";
import Header from "@/client/_components/Header";
import Hero from "@/client/_components/Hero";

const Portfolio = dynamic(() => import('@/client/_components/Portfolio'));
const Contact = dynamic(() => import('@/client/_components/Contact'));

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
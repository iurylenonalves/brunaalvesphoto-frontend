import dynamic from 'next/dynamic';
import Header from "@/client/_components/Header";
import Hero from "@/client/_components/Hero";

const About = dynamic(() => import('@/client/_components/About'), {
  loading: () => <div className="min-h-screen" />
});
const Portfolio = dynamic(() => import('@/client/_components/Portfolio'), {
  loading: () => <div className="min-h-screen" />
});
const Contact = dynamic(() => import('@/client/_components/Contact'), {
  loading: () => <div className="min-h-screen" />
});
const Footer = dynamic(() => import('@/client/_components/Footer'));

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
import About from "@/client/_components/About";
import Contact from "@/client/_components/Contact";
import Footer from "@/client/_components/Footer";
import Header from "@/client/_components/Header";
import Hero from "@/client/_components/Hero";
import Portfolio from "@/client/_components/Portfolio";

export default function Home() {
  return (
    <main>
      <Header/>
      <Hero/>
      <About/>
      <Portfolio/>
      <Contact/>
      <Footer/>
    </main>
  );
}

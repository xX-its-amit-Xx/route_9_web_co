import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { WhoIWorkWith } from "@/components/WhoIWorkWith";
import { QualityPillars } from "@/components/QualityPillars";
import { Pricing } from "@/components/Pricing";
import { MaintenanceFAQ } from "@/components/MaintenanceFAQ";
import { Portfolio } from "@/components/Portfolio";
import { Process } from "@/components/Process";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <WhoIWorkWith />
        <QualityPillars />
        <Pricing />
        <MaintenanceFAQ />
        <Portfolio />
        <Process />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { WhoIWorkWith } from "@/components/WhoIWorkWith";
import { QualityPillars } from "@/components/QualityPillars";
import { Pricing } from "@/components/Pricing";
import { MaintenanceFAQ } from "@/components/MaintenanceFAQ";
import { Portfolio } from "@/components/Portfolio";
import { Testimonials } from "@/components/Testimonials";
import { Process } from "@/components/Process";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { FloatingCTA } from "@/components/FloatingCTA";
import { CustomCursor } from "@/components/CustomCursor";
import { IntroSplash } from "@/components/IntroSplash";
import { SocialProofTicker } from "@/components/SocialProofTicker";
import { TornPageDivider } from "@/components/TornPageDivider";
import { AIChatWidget } from "@/components/AIChatWidget";
import { CursorSparks } from "@/components/CursorSparks";
import { SectionProgress } from "@/components/SectionProgress";
import { FooterStreetscape } from "@/components/FooterStreetscape";
import { SceneCarousel } from "@/components/SceneCarousel";

export default function Home() {
  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <IntroSplash />
      <CustomCursor />
      <CursorSparks />
      <SectionProgress />
      <Nav />
      <main id="main-content">
        <Hero />
        <TornPageDivider />
        <SocialProofTicker />
        <WhoIWorkWith />
        <SceneCarousel />
        <QualityPillars />
        <Pricing />
        <MaintenanceFAQ />
        <Portfolio />
        <Testimonials />
        <Process />
        <About />
        <Contact />
        <FooterStreetscape />
      </main>
      <Footer />
      <FloatingCTA />
      <AIChatWidget />
    </>
  );
}

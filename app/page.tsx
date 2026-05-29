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
import { Route9Scene } from "@/components/Route9Scene";
import { NeonSign } from "@/components/NeonSign";
import { LakeScene } from "@/components/LakeScene";
import { StorefrontParade } from "@/components/StorefrontParade";
import { HighwayMileageSign } from "@/components/HighwayMileageSign";
import { FilmStripBand } from "@/components/FilmStripBand";
import { ShrewsburyClockTower } from "@/components/ShrewsburyClockTower";
import { TornPageDivider } from "@/components/TornPageDivider";
import { AIChatWidget } from "@/components/AIChatWidget";
import { CursorSparks } from "@/components/CursorSparks";
import { SectionProgress } from "@/components/SectionProgress";
import { CorkBoard } from "@/components/CorkBoard";
import { ShrewsburyGazette } from "@/components/ShrewsburyGazette";
import { PostageStamps } from "@/components/PostageStamps";
import { MotelSign } from "@/components/MotelSign";
import { RetroTV } from "@/components/RetroTV";

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
        <StorefrontParade />
        <QualityPillars />
        <HighwayMileageSign />
        <Pricing />
        <NeonSign />
        <RetroTV />
        <MaintenanceFAQ />
        <PostageStamps />
        <FilmStripBand />
        <Portfolio />
        <LakeScene />
        <Testimonials />
        <ShrewsburyGazette />
        <Process />
        <Route9Scene />
        <ShrewsburyClockTower />
        <About />
        <CorkBoard />
        <MotelSign />
        <Contact />
      </main>
      <Footer />
      <FloatingCTA />
      <AIChatWidget />
    </>
  );
}

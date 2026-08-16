import AnnouncementBar from "@/components/AnnouncementBar";
import TerminalHUD from "@/components/TerminalHUD";
import Nav from "@/components/Nav";
import { DitherBand } from "@/components/Dither";
import Hero from "@/components/sections/Hero";
import LiveDemo from "@/components/sections/LiveDemo";
import Problem from "@/components/sections/Problem";
import Introducing from "@/components/sections/Introducing";
import Systems from "@/components/sections/Systems";
import Curriculum from "@/components/sections/Curriculum";
import Exam from "@/components/sections/Exam";
import RoiMaths from "@/components/sections/RoiMaths";
import FitCheck from "@/components/sections/FitCheck";
import Pricing from "@/components/sections/Pricing";
import Faqs from "@/components/sections/Faqs";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <AnnouncementBar />
      <TerminalHUD />
      <Nav />
      <main>
        <Hero />
        <DitherBand seed="hero-office" direction="edges" />
        <LiveDemo />
        <Problem />
        <DitherBand seed="into-aiceo" direction="down" />
        <Introducing />
        <Systems />
        <Curriculum />
        <Exam />
        <RoiMaths />
        <FitCheck />
        <DitherBand seed="into-pricing" direction="edges" rows={7} />
        <Pricing />
        <Faqs />
      </main>
      <Footer />
    </>
  );
}

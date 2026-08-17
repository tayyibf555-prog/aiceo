import AnnouncementBar from "@/components/AnnouncementBar";
import TerminalHUD from "@/components/TerminalHUD";
import Nav from "@/components/Nav";
import Hero from "@/components/sections/Hero";
import Problem from "@/components/sections/Problem";
import LiveDemo from "@/components/sections/LiveDemo";
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
        <Problem />
        <LiveDemo />
        <Introducing />
        <Systems />
        <Curriculum />
        <Exam />
        <RoiMaths />
        <FitCheck />
        <Pricing />
        <Faqs />
      </main>
      <Footer />
    </>
  );
}

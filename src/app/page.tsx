import AnnouncementBar from "@/components/AnnouncementBar";
import TerminalHUD from "@/components/TerminalHUD";
import Nav from "@/components/Nav";
import Hero from "@/components/sections/Hero";
import Problem from "@/components/sections/Problem";
import LiveDemo from "@/components/sections/LiveDemo";
import Introducing from "@/components/sections/Introducing";
import Mechanism from "@/components/sections/Mechanism";
import Curriculum from "@/components/sections/Curriculum";
import WhatYouGet from "@/components/sections/WhatYouGet";
import RoiMaths from "@/components/sections/RoiMaths";
import FitCheck from "@/components/sections/FitCheck";
import Founders from "@/components/sections/Founders";
import Pricing from "@/components/sections/Pricing";
import Faqs from "@/components/sections/Faqs";
import Closer from "@/components/sections/Closer";
import Footer from "@/components/sections/Footer";

/* Tools (the screenshot belt) is built but unrendered until real
   screens land — re-import and slot it after WhatYouGet then. */
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
        <Mechanism />
        <Curriculum />
        <WhatYouGet />
        <RoiMaths />
        <FitCheck />
        <Founders />
        <Pricing />
        <Faqs />
        <Closer />
      </main>
      <Footer />
    </>
  );
}

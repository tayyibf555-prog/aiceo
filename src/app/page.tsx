/* Phase 1 scratch assembly — replaced by the real 14 sections in Phase 2. */
import AnnouncementBar from "@/components/AnnouncementBar";
import TerminalHUD from "@/components/TerminalHUD";
import Nav from "@/components/Nav";
import Section from "@/components/Section";
import Kicker from "@/components/Kicker";
import Button from "@/components/Button";
import Highlight from "@/components/Highlight";
import Reveal from "@/components/Reveal";
import LogoHalftone from "@/components/LogoHalftone";
import DemoPanel from "@/components/DemoPanel";
import { DitherBand } from "@/components/Dither";

export default function Home() {
  return (
    <>
      <AnnouncementBar />
      <TerminalHUD />
      <Nav />
      <main>
        <Section id="hero" grid className="py-20 md:py-28">
          <div className="grid items-center gap-14 md:grid-cols-[1.15fr_1fr]">
            <div>
              <Kicker glyph="●">FREE BRAIN OPEN · COHORT 1: 10 SEATS</Kicker>
              <h1 className="display-1 mt-6">
                Run your business
                <br />
                <span className="text-accent">like an AI CEO.</span>
              </h1>
              <p className="mt-6 max-w-[56ch] text-lg leading-[1.55] text-ink-body">
                Over 8 live sessions we build systems you{" "}
                <Highlight>own outright</Highlight>: a second brain, a deputy
                that answers for you, speed to lead, reactivation, and a{" "}
                <Highlight variant="dotted">7am brief</Highlight>.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Button href="#pricing">Get the free brain</Button>
                <Button href="#office" variant="secondary" arrow="↓">
                  See the office
                </Button>
              </div>
            </div>
            <LogoHalftone />
          </div>
        </Section>

        <DitherBand seed="hero-office" direction="edges" />

        <Section id="office" className="py-20">
          <Kicker>INSIDE THE OFFICE · LIVE</Kicker>
          <h2 className="display-2 mt-4 max-w-[24ch]">
            A live map of everything your business knows.
          </h2>
          <div className="mt-10">
            <DemoPanel
              title="● THE OFFICE · SECOND BRAIN · LIVE"
              caption="This is a real one, running. You get yours free, on day one."
            >
              <div className="flex h-full items-center justify-center font-mono text-xs text-neutral-500">
                [ demo embeds here in phase 3 ]
              </div>
            </DemoPanel>
          </div>
        </Section>

        <Section id="problem" className="py-24">
          <Reveal>
            <h2 className="display-2 max-w-[26ch]">
              Scroll test: this section swaps the HUD to 02_problem.
            </h2>
            <p className="mt-6 max-w-[60ch] text-lg leading-[1.55] text-ink-body">
              Dummy manifesto copy to give the page scroll height. The real
              problem section lands in Phase 2.
            </p>
          </Reveal>
          <div className="h-[60vh]" />
        </Section>

        <DitherBand seed="problem-pricing" direction="down" />

        <Section id="pricing" grid className="py-24">
          <Reveal>
            <h2 className="display-2">Pricing swaps it to 09_pricing.</h2>
            <p className="mt-6 max-w-[60ch] text-lg leading-[1.55] text-ink-body">
              More dummy height below to finish the scroll runway.
            </p>
          </Reveal>
          <div className="h-[70vh]" />
        </Section>
      </main>
    </>
  );
}

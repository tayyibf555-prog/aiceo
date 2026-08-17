import Section from "@/components/Section";
import Reveal from "@/components/Reveal";
import { closer } from "@/content/site";

/*
  The peak-end beat: a full-accent band after the FAQs so the page
  closes on the offer, not the copyright line.
*/
export default function Closer() {
  return (
    <Section id="close" className="bg-accent py-20 md:py-24">
      <Reveal>
        <div className="text-center">
          <p className="font-mono text-[11px] tracking-[0.2em] text-white/80">
            {closer.line}
          </p>
          <h2 className="display-2 mt-4 text-white">{closer.h2}</h2>
          <p className="mx-auto mt-4 max-w-[52ch] text-lg leading-[1.55] text-white/90">
            {closer.body}
          </p>
          <a
            href={closer.href}
            className="mt-8 inline-block rounded-lg bg-bg-dark px-8 py-4 font-bold text-white transition-colors hover:bg-black"
          >
            {closer.cta}
            <span className="ml-2">→</span>
          </a>
        </div>
      </Reveal>
    </Section>
  );
}

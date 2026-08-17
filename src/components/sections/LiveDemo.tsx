import Section from "@/components/Section";
import Kicker from "@/components/Kicker";
import Reveal from "@/components/Reveal";
import DemoPanel from "@/components/DemoPanel";
import OfficeDemo from "@/components/OfficeDemo";
import { office } from "@/content/site";

export default function LiveDemo() {
  return (
    <Section id="office" className="py-16 md:py-24">
      <Kicker>{office.kicker}</Kicker>
      <h2 className="display-2 mt-4 max-w-[24ch]">{office.h2}</h2>
      <Reveal className="mt-10">
        <DemoPanel title={office.panelTitle} caption={office.caption}>
          <OfficeDemo />
        </DemoPanel>
        <p className="mt-3 font-mono text-[10px] leading-relaxed tracking-[0.12em] text-ink-muted">
          <span aria-hidden className="text-accent">
            ›
          </span>{" "}
          NINE REGIONS: {office.legend}
        </p>
      </Reveal>
    </Section>
  );
}

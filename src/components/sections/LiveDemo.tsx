import Section from "@/components/Section";
import Kicker from "@/components/Kicker";
import Reveal from "@/components/Reveal";
import OfficeScene from "@/components/OfficeScene";
import { office } from "@/content/site";

export default function LiveDemo() {
  return (
    <Section id="office" className="py-16 md:py-24">
      <Kicker>{office.kicker}</Kicker>
      <h2 className="display-2 mt-4 max-w-[24ch]">{office.h2}</h2>
      <Reveal className="mt-10">
        <OfficeScene />
      </Reveal>
    </Section>
  );
}

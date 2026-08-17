import Section from "@/components/Section";
import Kicker from "@/components/Kicker";
import Reveal from "@/components/Reveal";
import { introducing } from "@/content/site";

export default function Introducing() {
  return (
    <Section id="introducing" className="py-20 md:py-28">
      <div className="max-w-[70ch]">
        <Kicker>{introducing.kicker}</Kicker>
        <h2 className="display-2 mt-4">{introducing.h2}</h2>
        <div className="mt-7 space-y-5">
          {introducing.body.map((p) => (
            <Reveal key={p.slice(0, 24)}>
              <p className="text-lg leading-[1.55] text-ink-body">{p}</p>
            </Reveal>
          ))}
          <Reveal delay={80}>
            <p className="text-lg font-bold leading-[1.55] text-ink">
              {introducing.boldLine}
            </p>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}

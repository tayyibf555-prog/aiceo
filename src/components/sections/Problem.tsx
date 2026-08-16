import Section from "@/components/Section";
import Kicker from "@/components/Kicker";
import Reveal from "@/components/Reveal";
import { problem } from "@/content/site";

export default function Problem() {
  return (
    <Section id="problem" className="bg-bg-subtle py-20 md:py-28">
      <div className="max-w-[68ch]">
        <Kicker>{problem.kicker}</Kicker>
        <h2 className="display-2 mt-4">{problem.h2}</h2>
        <div className="mt-8 space-y-6">
          {problem.paragraphs.map((p, i) => (
            <Reveal key={i} delay={i * 60}>
              <p className="text-lg leading-[1.55] text-ink-body">{p}</p>
            </Reveal>
          ))}
          <Reveal delay={260}>
            <p className="border-l-2 border-accent pl-5 text-xl font-medium leading-[1.5] text-ink">
              {problem.turn}
            </p>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}

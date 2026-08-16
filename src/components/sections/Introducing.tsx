import Section from "@/components/Section";
import Reveal from "@/components/Reveal";
import { introducing } from "@/content/site";

export default function Introducing() {
  return (
    <Section id="introducing" className="py-20 md:py-28">
      <h2 className="display-2 max-w-[20ch]">{introducing.h2}</h2>
      <p className="mt-7 max-w-[68ch] text-lg leading-[1.55] text-ink-body">
        {introducing.body}
      </p>
      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {introducing.vignettes.map((v, i) => (
          <Reveal key={v.label} delay={i * 90}>
            <div className="h-full border border-line bg-bg p-6">
              <p className="font-mono text-[11px] tracking-[0.18em] text-accent">
                {v.label}
              </p>
              <p className="mt-4 text-[15px] leading-relaxed text-ink-body">
                {v.text}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

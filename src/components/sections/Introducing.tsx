import Section from "@/components/Section";
import Kicker from "@/components/Kicker";
import Reveal from "@/components/Reveal";
import Button from "@/components/Button";
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

        <Reveal delay={120}>
          <h3 className="mt-14 text-2xl font-bold tracking-tight">
            {introducing.timelineTitle}
          </h3>
        </Reveal>

        <div className="relative mt-8 border-l border-line pl-8">
          {introducing.timeline.map((entry, i) => (
            <Reveal key={entry.label} delay={i * 90} className="relative pb-9 last:pb-0">
              <span
                aria-hidden
                className={`absolute -left-8 top-1 h-[9px] w-[9px] -translate-x-1/2 rounded-full border-2 ${
                  entry.accent
                    ? "border-accent bg-accent"
                    : "border-line-strong bg-bg"
                }`}
              />
              <p
                className={`font-mono text-[11px] tracking-[0.18em] ${
                  entry.accent ? "text-accent" : "text-ink-muted"
                }`}
              >
                {entry.label}
              </p>
              <p className="mt-2 max-w-[60ch] text-[16px] leading-relaxed text-ink-body">
                {entry.text}
              </p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={160}>
          <div className="mt-11">
            <Button href={introducing.cta.href}>{introducing.cta.label}</Button>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

import Section from "@/components/Section";
import Kicker from "@/components/Kicker";
import Reveal from "@/components/Reveal";
import { fit } from "@/content/site";

export default function FitCheck() {
  return (
    <Section id="fit" className="py-20 md:py-28">
      <Kicker>{fit.kicker}</Kicker>
      <h2 className="display-2 mt-4 max-w-[24ch]">{fit.h2}</h2>
      <div className="mt-12 grid gap-5 md:grid-cols-2">
        <Reveal>
          <div className="h-full border border-accent bg-bg p-7">
            <p className="font-mono text-[11px] tracking-[0.18em] text-accent">
              {fit.forYou.title}
            </p>
            <ul className="mt-5 space-y-3.5">
              {fit.forYou.items.map((item) => (
                <li key={item} className="flex gap-3 text-[15px] leading-relaxed text-ink">
                  <span className="font-mono text-accent">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
        <Reveal delay={100}>
          <div className="h-full border border-line bg-bg-subtle p-7">
            <p className="font-mono text-[11px] tracking-[0.18em] text-ink-muted">
              {fit.notYou.title}
            </p>
            <ul className="mt-5 space-y-3.5">
              {fit.notYou.items.map((item) => (
                <li key={item} className="flex gap-3 text-[15px] leading-relaxed text-ink-body">
                  <span className="font-mono text-ink-muted">✕</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

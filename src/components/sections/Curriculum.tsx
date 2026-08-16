import Section from "@/components/Section";
import Kicker from "@/components/Kicker";
import Reveal from "@/components/Reveal";
import { curriculum } from "@/content/site";

export default function Curriculum() {
  return (
    <Section id="curriculum" className="py-20 md:py-28">
      <Kicker>{curriculum.kicker}</Kicker>
      <h2 className="display-2 mt-4 max-w-[26ch]">{curriculum.h2}</h2>
      <Reveal className="mt-12">
        <div className="border-t border-line">
          {curriculum.rows.map((row) => (
            <div
              key={row.code}
              className="grid grid-cols-[52px_1fr] items-baseline gap-x-4 gap-y-1 border-b border-line py-5 md:grid-cols-[64px_120px_200px_1fr] md:gap-x-8"
            >
              <span className="font-mono text-[13px] text-accent">
                {row.code}
              </span>
              <span className="order-3 col-start-2 font-mono text-[11px] tracking-[0.15em] text-ink-muted md:order-none md:col-start-auto">
                {row.week}
              </span>
              <span className="text-lg font-bold tracking-tight">
                {row.name}
              </span>
              <span className="col-start-2 text-[15px] leading-relaxed text-ink-body md:col-start-auto">
                {row.outcome}
              </span>
            </div>
          ))}
        </div>
        <p className="mt-6 font-mono text-[12px] tracking-[0.08em] text-ink-muted">
          <span className="text-accent">›</span> {curriculum.strapline}
        </p>
      </Reveal>
    </Section>
  );
}

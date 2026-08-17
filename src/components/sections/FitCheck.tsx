import Section from "@/components/Section";
import Kicker from "@/components/Kicker";
import Reveal from "@/components/Reveal";
import { fit } from "@/content/site";

export default function FitCheck() {
  return (
    <Section id="fit" className="py-20 md:py-28">
      <Kicker>{fit.kicker}</Kicker>
      <h2 className="display-2 mt-4">{fit.h2}</h2>

      <div className="mt-12 space-y-4">
        {fit.rows.map((row, i) => (
          <Reveal key={row.n} delay={i * 70}>
            <div className="group flex items-center gap-6 border border-line bg-bg px-6 py-6 transition-colors hover:border-accent md:px-8">
              <span className="font-mono text-[12px] text-ink-muted transition-colors group-hover:text-accent">
                {row.n}
              </span>
              <div className="min-w-0">
                <h3 className="text-lg font-bold tracking-tight">{row.title}</h3>
                <p className="mt-0.5 text-[15px] text-ink-body">{row.sub}</p>
              </div>
              <span
                aria-hidden
                className="ml-auto hidden shrink-0 font-mono text-[11px] tracking-[0.2em] text-line-strong transition-colors group-hover:text-accent sm:block"
              >
                ▪▪▪
              </span>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={200}>
        <p className="mt-8 flex flex-wrap items-center gap-3 font-mono text-[15px] tracking-[0.06em]">
          <span className="text-[12px] tracking-[0.18em] text-ink-muted">
            {fit.notForLabel}
          </span>
          <span className="text-ink-body line-through decoration-accent decoration-1">
            {fit.notFor}
          </span>
          <span aria-hidden className="text-accent">
            ✕
          </span>
        </p>
      </Reveal>
    </Section>
  );
}

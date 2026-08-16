import Section from "@/components/Section";
import Kicker from "@/components/Kicker";
import Reveal from "@/components/Reveal";
import Counter from "@/components/Counter";
import { roi } from "@/content/site";

export default function RoiMaths() {
  return (
    <Section id="roi" className="bg-bg-subtle py-20 md:py-28">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <Kicker>{roi.kicker}</Kicker>
          <h2 className="display-2 mt-4 max-w-[20ch]">{roi.h2}</h2>
          <p className="mt-6 max-w-[58ch] text-lg leading-[1.55] text-ink-body">
            {roi.body}
          </p>
        </div>
        <Reveal>
          <div className="border border-line bg-bg p-8 md:p-10">
            <p className="display-1 text-accent" style={{ fontSize: "clamp(56px,7vw,88px)" }}>
              <Counter target={roi.counter.target} prefix={roi.counter.prefix} />
            </p>
            <p className="mt-2 font-mono text-[12px] tracking-[0.1em] text-ink-muted">
              {roi.counter.label.toUpperCase()}
            </p>
            <div className="mt-8 grid grid-cols-3 gap-4 border-t border-line pt-6">
              {roi.stats.map((s) => (
                <div key={s.label}>
                  <p className="text-xl font-bold tabular-nums tracking-tight">
                    {s.value}
                  </p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-muted">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

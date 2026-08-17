import Section from "@/components/Section";
import Kicker from "@/components/Kicker";
import Reveal from "@/components/Reveal";
import { introducing } from "@/content/site";

export default function Introducing() {
  return (
    <Section id="introducing" className="py-20 md:py-28">
      <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
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

        {/* the OS status window fills the right column */}
        <Reveal delay={120}>
          <div className="mx-auto w-full max-w-[380px] overflow-hidden border border-white/10 bg-bg-dark shadow-[8px_8px_0_rgba(10,10,10,0.2)]">
            <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.15em] text-neutral-400">
              <span
                aria-hidden
                className="live-dot h-2 w-2 shrink-0 rounded-full bg-accent"
              />
              {introducing.status.title}
            </div>
            <div className="space-y-2.5 px-5 py-6 font-mono text-[12px] leading-relaxed text-neutral-300">
              {introducing.status.rows.map((row) => (
                <p key={row} className="flex items-center gap-3">
                  <span aria-hidden className="text-accent">
                    ✓
                  </span>
                  {row}
                </p>
              ))}
              <p className="pt-2">
                <span className="hud-cursor inline-block h-[13px] w-[7px] bg-accent align-middle" />
              </p>
            </div>
            <div className="border-t border-white/10 px-4 py-2.5 font-mono text-[10px] tracking-[0.18em] text-neutral-500">
              {introducing.status.foot}
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

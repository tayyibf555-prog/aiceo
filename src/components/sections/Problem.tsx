import Section from "@/components/Section";
import Kicker from "@/components/Kicker";
import Reveal from "@/components/Reveal";
import Button from "@/components/Button";
import Highlight from "@/components/Highlight";
import DiagramFx from "@/components/fx/DiagramFx";
import { problem } from "@/content/site";

/* Scatter positions for the TODAY tabs, echoing the reference layout. */
const TAB_POS = [
  "left-[2%] top-[8%] -rotate-3",
  "left-[36%] top-[0%] rotate-2",
  "left-[68%] top-[10%] -rotate-2",
  "left-[8%] top-[54%] rotate-1",
  "left-[42%] top-[62%] -rotate-3",
  "left-[72%] top-[52%] rotate-3",
];

export default function Problem() {
  return (
    <Section id="problem" className="bg-bg-subtle py-20 md:py-28">
      <div className="grid items-start gap-14 lg:grid-cols-[1.05fr_0.85fr]">
        <div>
          <Kicker>{problem.kicker}</Kicker>
          <h2 className="display-2 mt-4">
            {problem.h2a}
            <br />
            <span className="text-ink-body">{problem.h2b}</span>
          </h2>
          <div className="mt-8 max-w-[58ch] space-y-5">
            {problem.paragraphs.map((p, i) => (
              <Reveal key={i} delay={i * 50}>
                <p className="text-lg leading-[1.55] text-ink-body">
                  {p.t}
                  {"hl" in p && p.hl && <Highlight>{p.hl}</Highlight>}
                  {"t2" in p && p.t2}
                </p>
              </Reveal>
            ))}
            <Reveal delay={280}>
              <p className="text-lg font-bold leading-[1.55] text-ink">
                {problem.bold} <Highlight>{problem.boldHl}</Highlight>
              </p>
            </Reveal>
            <Reveal delay={340}>
              <p className="pt-2 text-xl font-medium leading-[1.5] text-ink">
                <span aria-hidden className="mr-3 font-mono text-accent">
                  ›
                </span>
                {problem.turn}
              </p>
            </Reveal>
          </div>
          <Reveal delay={380}>
            <div className="mt-9">
              <Button href="#office" variant="secondary" arrow="↓">
                {problem.cta}
              </Button>
            </div>
          </Reveal>
        </div>

        {/* the TODAY → WITH THE BRAIN diagram */}
        <DiagramFx className="lg:sticky lg:top-20">
          <div className="border border-line bg-bg p-6 md:p-7">
            <div
              data-dg
              className="flex items-baseline justify-between font-mono text-[11px] tracking-[0.15em] text-ink-muted"
            >
              <span>
                <span aria-hidden className="text-accent">
                  ›
                </span>{" "}
                {problem.diagram.todayLabel}
              </span>
              <span>{problem.diagram.todayCount}</span>
            </div>

            <div className="relative mt-4 h-[140px]" aria-hidden>
              <span className="absolute left-[24%] top-[38%] font-mono text-[11px] text-ink-muted">
                ✕
              </span>
              <span className="absolute left-[58%] top-[30%] font-mono text-[11px] text-ink-muted">
                ✕
              </span>
              <span className="absolute left-[40%] top-[70%] font-mono text-[11px] text-ink-muted">
                ✕
              </span>
              {problem.diagram.tabs.map((tab, i) => (
                <span
                  key={tab}
                  data-dg
                  className={`absolute border border-line-strong bg-bg px-2.5 py-1 font-mono text-[10px] tracking-[0.12em] text-ink-body ${TAB_POS[i]}`}
                >
                  {tab}
                </span>
              ))}
            </div>
            <p
              data-dg
              className="mt-2 text-center font-mono text-[10px] tracking-[0.18em] text-ink-muted"
            >
              {problem.diagram.todayCaption}
            </p>

            <div
              data-dg
              aria-hidden
              className="my-5 text-center font-mono text-base text-ink-muted"
            >
              ↓
            </div>

            <div
              data-dg
              className="font-mono text-[11px] tracking-[0.15em] text-ink-muted"
            >
              <span aria-hidden className="text-accent">
                ›
              </span>{" "}
              {problem.diagram.brainLabel}
            </div>
            <div
              data-dg
              className="mt-3 rounded-lg border-2 border-ink bg-bg px-5 py-4 font-mono text-[12px]"
            >
              <p className="flex items-center gap-2 font-bold text-ink">
                <span
                  aria-hidden
                  className="live-dot h-1.5 w-1.5 rounded-full bg-accent"
                />
                {problem.diagram.folder}
              </p>
              {problem.diagram.rows.map((row, i) => (
                <p
                  key={row}
                  className="mt-2 flex items-center gap-3 pl-4 text-ink-body"
                >
                  <span aria-hidden className="text-ink-muted">
                    {i === problem.diagram.rows.length - 1 ? "└" : "├"}
                  </span>
                  {row}
                  <span aria-hidden className="h-px flex-1 bg-line" />
                </p>
              ))}
            </div>
            <p
              data-dg
              className="mt-3 text-center font-mono text-[10px] tracking-[0.18em] text-ink-muted"
            >
              {problem.diagram.brainCaption}
            </p>
          </div>
        </DiagramFx>
      </div>
    </Section>
  );
}

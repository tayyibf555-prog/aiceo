import Section from "@/components/Section";
import Kicker from "@/components/Kicker";
import Reveal from "@/components/Reveal";
import Button from "@/components/Button";
import Highlight from "@/components/Highlight";
import DiagramFx from "@/components/fx/DiagramFx";
import { problem } from "@/content/site";

/*
  The TODAY tabs sit on a shared coordinate space (percentages) so the
  dashed connector lines and the ✕ marks at their midpoints line up with
  the chip centres exactly. DiagramFx staggers everything in, then
  floats the chips gently.
*/
const CENTERS = [
  { x: 15, y: 20, r: -3 },
  { x: 46, y: 11, r: 2 },
  { x: 77, y: 21, r: -2 },
  { x: 21, y: 64, r: 1 },
  { x: 51, y: 73, r: -3 },
  { x: 80, y: 60, r: 3 },
];

const LINKS: Array<[number, number]> = [
  [0, 1],
  [1, 2],
  [0, 3],
  [1, 4],
  [2, 5],
  [3, 4],
  [4, 5],
];

export default function Problem() {
  return (
    <Section id="problem" className="py-20 md:py-28">
      <div className="grid items-start gap-14 lg:grid-cols-[1.05fr_0.85fr]">
        <div>
          <Kicker>{problem.kicker}</Kicker>
          <h2 className="display-2 mt-4">
            {problem.h2a}
            <br />
            <span className="text-accent">{problem.h2b}</span>
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
              <Button href="#pricing">
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

            <div className="relative mt-4 h-[150px]" aria-hidden>
              {/* dashed connectors, drawn in the same percent space */}
              <svg
                className="absolute inset-0 h-full w-full"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                {LINKS.map(([a, b]) => (
                  <line
                    key={`${a}-${b}`}
                    x1={CENTERS[a].x}
                    y1={CENTERS[a].y}
                    x2={CENTERS[b].x}
                    y2={CENTERS[b].y}
                    stroke="var(--color-line-strong)"
                    strokeWidth="0.5"
                    strokeDasharray="2 2.4"
                    vectorEffect="non-scaling-stroke"
                  />
                ))}
              </svg>
              {/* ✕ at every connector midpoint */}
              {LINKS.map(([a, b]) => (
                <span
                  key={`x-${a}-${b}`}
                  data-cross
                  className="absolute -translate-x-1/2 -translate-y-1/2 bg-bg px-0.5 font-mono text-[10px] leading-none text-ink-muted"
                  style={{
                    left: `${(CENTERS[a].x + CENTERS[b].x) / 2}%`,
                    top: `${(CENTERS[a].y + CENTERS[b].y) / 2}%`,
                  }}
                >
                  ✕
                </span>
              ))}
              {problem.diagram.tabs.map((tab, i) => (
                <span
                  key={tab}
                  data-dg
                  data-float
                  className="absolute -translate-x-1/2 -translate-y-1/2 border border-line-strong bg-bg px-2.5 py-1 font-mono text-[10px] tracking-[0.12em] text-ink-body"
                  style={{
                    left: `${CENTERS[i].x}%`,
                    top: `${CENTERS[i].y}%`,
                    rotate: `${CENTERS[i].r}deg`,
                  }}
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

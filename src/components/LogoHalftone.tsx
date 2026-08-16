import { MARK_GRID } from "@/lib/halftone-data";
import { seeded } from "@/lib/prng";
import { DitherBlock } from "@/components/Dither";

/*
  The hero graphic (brief §3.3): the AI CEO arrow mark rendered as accent
  halftone pixels inside a thin-bordered frame, with dithered satellite
  blocks orbiting it on hairlines. Server component, deterministic.
*/
export default function LogoHalftone() {
  const { cols, rows, cells } = MARK_GRID;
  const cell = 10;
  const rand = seeded("logo-halftone");
  let d = "";
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const jitter = 0.55 + 0.45 * rand(); // stable call order: one per cell
      if (!cells[r * cols + c]) continue;
      const s = cell * jitter;
      const x = c * cell + (cell - s) / 2;
      const y = r * cell + (cell - s) / 2;
      d += `M${x.toFixed(1)} ${y.toFixed(1)}h${s.toFixed(1)}v${s.toFixed(1)}h${(-s).toFixed(1)}z`;
    }
  }

  return (
    <div className="relative mx-auto w-full max-w-[400px]">
      {/* satellites */}
      <div
        aria-hidden
        className="absolute -top-7 -right-5 hidden md:block"
      >
        <DitherBlock seed="sat-a" size={7} className="h-11 w-11" />
      </div>
      <div
        aria-hidden
        className="absolute -bottom-9 -left-8 hidden md:block"
      >
        <DitherBlock seed="sat-b" size={9} density={0.35} className="h-14 w-14" />
      </div>
      <div
        aria-hidden
        className="absolute top-1/3 -left-14 hidden lg:block"
      >
        <DitherBlock seed="sat-c" size={5} density={0.55} className="h-8 w-8" />
      </div>
      {/* hairlines joining satellites to the frame */}
      <div aria-hidden className="absolute -top-7 right-8 hidden h-px w-16 bg-line md:block" />
      <div aria-hidden className="absolute -bottom-9 left-8 hidden h-px w-20 bg-line md:block" />
      <div aria-hidden className="absolute top-1/3 -left-14 hidden h-px w-14 translate-y-4 bg-line lg:block" />

      {/* the frame */}
      <div className="relative border border-line bg-bg p-6 md:p-8">
        <div className="flex items-baseline justify-between font-mono text-[10px] uppercase tracking-[0.15em] text-ink-muted">
          <span>MARK_01</span>
          <span>#1D6BFF</span>
        </div>
        <svg
          viewBox={`0 0 ${cols * cell} ${rows * cell}`}
          role="img"
          aria-label="The AI CEO arrow mark, rendered as halftone pixels"
          className="mt-4 block w-full"
        >
          <path d={d} fill="var(--color-accent)" />
        </svg>
        <div className="mt-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.15em] text-ink-muted">
          <span className="flex items-center gap-1.5">
            <span className="live-dot inline-block h-1.5 w-1.5 rounded-full bg-accent" />
            RENDER · {cols}×{rows}
          </span>
          <span>562 PX</span>
        </div>
      </div>
    </div>
  );
}

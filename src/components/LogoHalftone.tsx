import { MARK_GRID } from "@/lib/halftone-data";
import { seeded } from "@/lib/prng";
import HalftoneFx from "@/components/fx/HalftoneFx";

/*
  The hero graphic: the AI CEO arrow mark rendered as accent halftone
  pixels inside a thin-bordered frame. Cells are split into BUCKETS
  seeded random groups, one <path> each, so HalftoneFx can stagger the
  mark into existence. Server component, deterministic.
*/
const BUCKETS = 12;

export default function LogoHalftone() {
  const { cols, rows, cells } = MARK_GRID;
  const onCells = cells.reduce<number>((a, b) => a + b, 0);
  const cell = 10;
  const rand = seeded("logo-halftone");
  const paths: string[] = Array.from({ length: BUCKETS }, () => "");

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const jitter = 0.55 + 0.45 * rand(); // stable call order: per cell
      const bucket = Math.floor(rand() * BUCKETS);
      if (!cells[r * cols + c]) continue;
      const s = cell * jitter;
      const x = c * cell + (cell - s) / 2;
      const y = r * cell + (cell - s) / 2;
      paths[bucket] += `M${x.toFixed(1)} ${y.toFixed(1)}h${s.toFixed(1)}v${s.toFixed(1)}h${(-s).toFixed(1)}z`;
    }
  }

  return (
    <HalftoneFx className="mx-auto w-full max-w-[400px]">
      <div className="border border-line bg-bg p-6 md:p-8">
        <div className="flex items-baseline justify-between font-mono text-[10px] uppercase tracking-[0.15em] text-ink-muted">
          <span>MARK_01</span>
          <span>#1557E0</span>
        </div>
        <svg
          viewBox={`0 0 ${cols * cell} ${rows * cell}`}
          role="img"
          aria-label="The AI CEO arrow mark, rendered as halftone pixels"
          className="mt-4 block w-full"
        >
          {paths.map(
            (d, i) =>
              d && (
                <path key={i} data-ht d={d} fill="var(--color-accent)" />
              )
          )}
        </svg>
        <div className="mt-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.15em] text-ink-muted">
          <span className="flex items-center gap-1.5">
            <span
              aria-hidden
              className="live-dot inline-block h-1.5 w-1.5 rounded-full bg-accent"
            />
            RENDER · {cols}×{rows}
          </span>
          <span>{onCells} PX</span>
        </div>
      </div>
    </HalftoneFx>
  );
}

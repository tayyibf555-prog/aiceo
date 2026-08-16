import { seeded } from "@/lib/prng";

/*
  Motif 3 (brief §3.3): pixel-noise dither art. Server components only —
  rendered once into static HTML, never hydrated, deterministic via the
  seeded PRNG. Each SVG is two <path> nodes (grey field + sparse accent),
  not thousands of rects.
*/

function cellPaths(
  rand: () => number,
  cols: number,
  rows: number,
  cell: number,
  density: (row: number, col: number) => number,
  accentShare = 0.08
) {
  let grey = "";
  let accent = "";
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const draw = rand() < density(r, c);
      const isAccent = rand() < accentShare;
      if (!draw) continue;
      const d = `M${c * cell} ${r * cell}h${cell}v${cell}h${-cell}z`;
      if (isAccent) accent += d;
      else grey += d;
    }
  }
  return { grey, accent };
}

/** Full-width noise strip used as a section transition. */
export function DitherBand({
  seed,
  direction = "down",
  rows = 9,
  className = "",
}: {
  seed: string;
  direction?: "down" | "up" | "edges";
  rows?: number;
  className?: string;
}) {
  const cols = 220;
  const cell = 6;
  const rand = seeded(`band:${seed}`);
  const ramp = (r: number) => {
    const t = rows === 1 ? 0 : r / (rows - 1);
    if (direction === "down") return 0.7 * Math.pow(1 - t, 1.7) + 0.015;
    if (direction === "up") return 0.7 * Math.pow(t, 1.7) + 0.015;
    return 0.7 * Math.pow(Math.abs(2 * t - 1), 1.9) + 0.01;
  };
  const { grey, accent } = cellPaths(rand, cols, rows, cell, (r) => ramp(r));
  return (
    <svg
      viewBox={`0 0 ${cols * cell} ${rows * cell}`}
      preserveAspectRatio="none"
      aria-hidden
      className={`block h-14 w-full md:h-16 ${className}`}
    >
      <path d={grey} fill="var(--color-line-strong)" />
      <path d={accent} fill="var(--color-accent)" />
    </svg>
  );
}

/** Small square noise block — decorative satellite for the hero frame. */
export function DitherBlock({
  seed,
  size = 12,
  density = 0.45,
  accentShare = 0.12,
  className = "",
}: {
  seed: string;
  size?: number;
  density?: number;
  accentShare?: number;
  className?: string;
}) {
  const cell = 6;
  const rand = seeded(`block:${seed}`);
  const { grey, accent } = cellPaths(
    rand,
    size,
    size,
    cell,
    () => density,
    accentShare
  );
  return (
    <svg
      viewBox={`0 0 ${size * cell} ${size * cell}`}
      aria-hidden
      className={className}
    >
      <path d={grey} fill="var(--color-line-strong)" />
      <path d={accent} fill="var(--color-accent)" />
    </svg>
  );
}

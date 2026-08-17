import type { ReactNode } from "react";

/*
  Motif 5 (brief §3.5): near-black rounded inset window with a mono status
  header, deliberately high contrast against the white page.
*/
export default function DemoPanel({
  title,
  right,
  caption,
  children,
}: {
  title: string;
  right?: ReactNode;
  caption?: ReactNode;
  children: ReactNode;
}) {
  return (
    <figure className="m-0">
      <div className="overflow-hidden border border-white/10 bg-bg-dark shadow-[8px_8px_0_rgba(10,10,10,0.2)]">
        <div className="flex items-center justify-between gap-4 border-b border-white/10 px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.15em] text-neutral-400">
          <span className="flex min-w-0 items-center gap-2">
            <span
              aria-hidden
              className="live-dot h-2 w-2 shrink-0 rounded-full bg-accent"
            />
            <span className="truncate">{title}</span>
          </span>
          {right}
        </div>
        <div className="relative aspect-[16/10] bg-bg-dark">{children}</div>
      </div>
      {caption && (
        <figcaption className="mt-3 font-mono text-xs leading-relaxed text-ink-muted">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

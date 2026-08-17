"use client";

/*
  Motif 2 (brief §3.2): sticky terminal strip. Left: per-section exec label
  with blinking accent cursor. Right: version + scroll percentage. Below:
  2px accent progress line. On mobile only the line survives.

  Perf contract: passive scroll listener, rAF-gated, progress written via
  transform on a ref (no React state), text state updated only when the
  integer percentage changes, scrollHeight cached and refreshed on resize.
*/
import { useEffect, useRef, useState } from "react";
import { brand } from "@/content/site";

export default function TerminalHUD() {
  const [label, setLabel] = useState("00_boot");
  const [pct, setPct] = useState(0);
  const barRef = useRef<HTMLDivElement>(null);
  const pctRef = useRef(0);

  useEffect(() => {
    const observed = document.querySelectorAll<HTMLElement>("[data-exec]");
    const lastExec = observed[observed.length - 1]?.dataset.exec;
    const nearEnd = () =>
      window.scrollY >=
      (document.documentElement.scrollHeight - window.innerHeight) * 0.995;
    const io = new IntersectionObserver(
      (entries) => {
        // At the very bottom the footer never reaches the observer band;
        // hold the final label instead of letting faqs win the race.
        if (nearEnd() && lastExec) {
          setLabel(lastExec);
          return;
        }
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const exec = (entry.target as HTMLElement).dataset.exec;
            if (exec) setLabel(exec);
          }
        }
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );
    observed.forEach((el) => io.observe(el));

    // Re-measured by ResizeObserver: ScrollTrigger pinning inserts tall
    // spacers after mount, which would otherwise leave max stale and make
    // the percentage hit 100 early.
    let max = document.documentElement.scrollHeight - window.innerHeight;
    const measure = () => {
      max = document.documentElement.scrollHeight - window.innerHeight;
    };
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
        if (barRef.current)
          barRef.current.style.transform = `scaleX(${p.toFixed(4)})`;
        const whole = Math.round(p * 100);
        if (whole !== pctRef.current) {
          pctRef.current = whole;
          setPct(whole);
        }
        // The footer never reaches the observer band; snap to it at the end.
        if (p > 0.995 && lastExec) setLabel(lastExec);
      });
    };
    const onResize = () => {
      measure();
      onScroll();
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(document.body);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    onScroll();

    return () => {
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div className="sticky top-0 z-50 bg-bg/95 backdrop-blur-sm md:border-b md:border-line">
      <div className="mx-auto hidden h-9 max-w-6xl items-center justify-between px-6 font-mono text-[11px] tracking-[0.08em] text-ink-muted md:flex">
        <span className="flex items-center gap-2">
          <span className="text-accent">▶</span>
          <span>
            exec <span className="text-ink">{label}.render</span>
          </span>
          <span
            aria-hidden
            className="hud-cursor inline-block h-[13px] w-[7px] bg-accent"
          />
        </span>
        <span className="tabular-nums">
          {brand.hudLabel}
          <span className="inline-block w-4" />
          {String(pct).padStart(3, "0")}%
        </span>
      </div>
      <div className="h-[2px] w-full bg-line/60">
        <div
          ref={barRef}
          className="h-full w-full origin-left scale-x-0 bg-accent"
        />
      </div>
    </div>
  );
}

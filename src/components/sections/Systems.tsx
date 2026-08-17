"use client";

/*
  Stop-scroll systems: the four cards pin, reveal one at a time as you
  scroll, and a connector line draws between them (horizontal through
  the icon row on desktop, vertical through the icon column on mobile).
  Reduced motion renders everything revealed and connected, unpinned.
*/
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Section from "@/components/Section";
import Kicker from "@/components/Kicker";
import { systems } from "@/content/site";

gsap.registerPlugin(ScrollTrigger);

/* Mono line icons in the site's stroke style, one accent detail each. */
function SysIcon({ kind }: { kind: string }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.5 } as const;
  switch (kind) {
    case "brain":
      return (
        <svg viewBox="0 0 40 40" className="h-8 w-8" aria-hidden>
          <path
            {...common}
            d="M20 8c-6 0-10 4-10 9 0 3 1 5 3 7l1 3v4h12v-4l1-3c2-2 3-4 3-7 0-5-4-9-10-9z"
          />
          <path {...common} d="M20 8v23M14 15c2 2 4 2 6 0m0 4c2 2 4 2 6 0" />
          <circle cx="20" cy="24" r="1.6" fill="var(--color-accent)" stroke="none" />
        </svg>
      );
    case "bolt":
      return (
        <svg viewBox="0 0 40 40" className="h-8 w-8" aria-hidden>
          <path {...common} d="M22 7L11 23h7l-2 10 11-16h-7z" />
          <circle cx="20" cy="20" r="1.4" fill="var(--color-accent)" stroke="none" />
        </svg>
      );
    case "pick":
      return (
        <svg viewBox="0 0 40 40" className="h-8 w-8" aria-hidden>
          <path {...common} d="M13 27L29 11" />
          <path {...common} d="M21 8c4-1 9 1 12 4-1-4-4-8-8-9z" fill="none" />
          <path {...common} d="M11 29l3 3" />
          <circle cx="30" cy="10" r="1.4" fill="var(--color-accent)" stroke="none" />
        </svg>
      );
    case "sun":
      return (
        <svg viewBox="0 0 40 40" className="h-8 w-8" aria-hidden>
          <circle {...common} cx="20" cy="20" r="6" />
          <path
            {...common}
            d="M20 6v4M20 30v4M6 20h4M30 20h4M10 10l3 3M27 27l3 3M30 10l-3 3M13 27l-3 3"
          />
          <circle cx="20" cy="20" r="1.6" fill="var(--color-accent)" stroke="none" />
        </svg>
      );
    default:
      return null;
  }
}

export default function Systems() {
  const [active, setActive] = useState(0);
  const [staticMode, setStaticMode] = useState(false);
  const pinRef = useRef<HTMLDivElement>(null);
  const lineHRef = useRef<HTMLDivElement>(null);
  const lineVRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStaticMode(true);
      if (lineHRef.current) lineHRef.current.style.transform = "scaleX(1)";
      if (lineVRef.current) lineVRef.current.style.transform = "scaleY(1)";
      return;
    }
    const el = pinRef.current;
    if (!el) return;
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top 22%",
      end: `+=${systems.cards.length * 240}`,
      pin: true,
      onUpdate: (self) => {
        const p = self.progress;
        if (lineHRef.current)
          lineHRef.current.style.transform = `scaleX(${p.toFixed(4)})`;
        if (lineVRef.current)
          lineVRef.current.style.transform = `scaleY(${p.toFixed(4)})`;
        const idx = Math.min(
          systems.cards.length - 1,
          Math.floor(p * systems.cards.length)
        );
        if (idx !== activeRef.current) {
          activeRef.current = idx;
          setActive(idx);
        }
      },
    });
    return () => st.kill();
  }, []);

  return (
    <Section id="systems" className="py-20 md:py-28">
      <Kicker>{systems.kicker}</Kicker>
      <h2 className="display-2 mt-4 max-w-[24ch]">{systems.h2}</h2>

      <div ref={pinRef} className="mt-12 pb-2 pt-2">
        <div className="relative">
          {/* connector: horizontal through the icon row (desktop) */}
          <div
            aria-hidden
            className="absolute left-6 right-6 top-[52px] hidden h-px bg-line md:block"
          >
            <div
              ref={lineHRef}
              className="h-full w-full origin-left scale-x-0 bg-accent"
            />
          </div>
          {/* connector: vertical through the icon column (mobile) */}
          <div
            aria-hidden
            className="absolute bottom-6 left-[52px] top-6 w-px bg-line md:hidden"
          >
            <div
              ref={lineVRef}
              className="h-full w-full origin-top scale-y-0 bg-accent"
            />
          </div>

          <div className="grid gap-5 md:grid-cols-4">
            {systems.cards.map((card, i) => {
              const revealed = staticMode || i <= active;
              return (
                <div
                  key={card.name}
                  className={`border bg-bg p-6 transition-all duration-500 ${
                    revealed
                      ? "translate-y-0 border-line opacity-100"
                      : "translate-y-4 border-line opacity-0"
                  } ${!staticMode && i === active ? "border-accent shadow-[4px_4px_0_rgba(43,85,176,0.12)]" : ""}`}
                >
                  <div
                    className={`relative z-10 grid h-14 w-14 place-items-center border bg-bg transition-colors duration-300 ${
                      revealed ? "border-accent text-accent" : "border-line text-ink-muted"
                    }`}
                  >
                    <SysIcon kind={card.icon} />
                  </div>
                  <h3 className="mt-5 text-lg font-bold tracking-tight">
                    {card.name}
                  </h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink-body">
                    {card.pain}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <p className="mt-6 font-mono text-[11px] tracking-[0.15em] text-ink-muted">
          {staticMode
            ? `4 SYSTEMS · ONE BUILD`
            : `SYSTEM ${Math.min(active + 1, 4)} OF 4 · ONE BUILD`}
        </p>
      </div>
    </Section>
  );
}

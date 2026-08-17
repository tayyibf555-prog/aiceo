"use client";

/*
  Merged mechanism + systems: the four layers of the AI CEO OS, each
  carrying the pain it kills, revealed one at a time along a connector
  line in a pinned scroll sequence (lg+ only; md and below render
  static and fully connected, as does prefers-reduced-motion).
  GSAP work is wrapped in gsap.context and reverted on cleanup so
  StrictMode/HMR/scroll-restoration never desync React's DOM.
*/
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Section from "@/components/Section";
import Kicker from "@/components/Kicker";
import Highlight from "@/components/Highlight";
import { mechanism } from "@/content/site";

gsap.registerPlugin(ScrollTrigger);

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

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
    case "orbit":
      return (
        <svg viewBox="0 0 40 40" className="h-8 w-8" aria-hidden>
          <circle {...common} cx="20" cy="20" r="11" strokeDasharray="2.5 3" />
          <circle cx="20" cy="20" r="3" fill="var(--color-accent)" stroke="none" />
          <circle {...common} cx="20" cy="9" r="2.4" />
          <circle {...common} cx="30.5" cy="25" r="2.4" />
          <circle {...common} cx="9.5" cy="25" r="2.4" />
        </svg>
      );
    default:
      return null;
  }
}

export default function Mechanism() {
  const [active, setActive] = useState(0);
  const [staticMode, setStaticMode] = useState(false);
  const pinRef = useRef<HTMLDivElement>(null);
  const lineHRef = useRef<HTMLDivElement>(null);
  const lineVRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(0);

  useIsoLayoutEffect(() => {
    const pinnable =
      window.matchMedia("(min-width: 1024px)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!pinnable) {
      setStaticMode(true);
      if (lineHRef.current) lineHRef.current.style.transform = "scaleX(1)";
      if (lineVRef.current) lineVRef.current.style.transform = "scaleY(1)";
      return;
    }
    const el = pinRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: "top 88px",
        end: `+=${mechanism.layers.length * 260}`,
        pin: true,
        onUpdate: (self) => {
          const p = self.progress;
          if (lineHRef.current)
            lineHRef.current.style.transform = `scaleX(${p.toFixed(4)})`;
          if (lineVRef.current)
            lineVRef.current.style.transform = `scaleY(${p.toFixed(4)})`;
          const idx = Math.min(
            mechanism.layers.length - 1,
            Math.floor(p * mechanism.layers.length)
          );
          if (idx !== activeRef.current) {
            activeRef.current = idx;
            setActive(idx);
          }
        },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <Section id="mechanism" className="py-20 md:py-24">
      <div ref={pinRef}>
        <Kicker>{mechanism.kicker}</Kicker>
        <h2 className="display-2 mt-3">
          {mechanism.h2a}
          <br />
          <span className="text-ink-body">{mechanism.h2b}</span>
        </h2>
        <p className="mt-4 max-w-[62ch] text-[16px] leading-[1.5] text-ink-body">
          {mechanism.sub}
        </p>

        <div className="relative mt-9">
          {/* connector: horizontal through the icon row (lg) */}
          <div
            aria-hidden
            className="absolute left-6 right-6 top-[52px] hidden h-px bg-line lg:block"
          >
            <div
              ref={lineHRef}
              className="h-full w-full origin-left scale-x-0 bg-accent"
            />
          </div>
          {/* connector: vertical through the icon column (mobile only) */}
          <div
            aria-hidden
            className="absolute bottom-6 left-[52px] top-6 w-px bg-line md:hidden"
          >
            <div
              ref={lineVRef}
              className="h-full w-full origin-top scale-y-0 bg-accent"
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {mechanism.layers.map((layer, i) => {
              const revealed = staticMode || i <= active;
              return (
                <div
                  key={layer.code}
                  className={`border bg-bg p-6 transition-all duration-500 ${
                    revealed
                      ? "translate-y-0 border-line opacity-100"
                      : "translate-y-4 border-line opacity-0"
                  } ${
                    !staticMode && i === active
                      ? "border-accent shadow-[4px_4px_0_rgba(43,85,176,0.12)]"
                      : ""
                  }`}
                >
                  <div
                    className={`relative z-10 grid h-14 w-14 place-items-center border bg-bg transition-colors duration-300 ${
                      revealed
                        ? "border-accent text-accent"
                        : "border-line text-ink-muted"
                    }`}
                  >
                    <SysIcon kind={layer.icon} />
                  </div>
                  <p className="mt-4 font-mono text-[10px] tracking-[0.15em]">
                    <span className={revealed ? "text-accent" : "text-ink-muted"}>
                      {layer.code}
                    </span>
                    <span className="ml-2 text-ink-muted">{layer.tag}</span>
                  </p>
                  <h3 className="mt-2 text-lg font-bold tracking-tight">
                    {layer.name}
                  </h3>
                  <p className="mt-2 text-[14px] font-bold leading-relaxed text-ink">
                    {layer.pain}
                  </p>
                  <p className="mt-1.5 text-[14px] leading-relaxed text-ink-body">
                    {layer.text}
                  </p>
                  <p className="mt-4 border-t border-line pt-3 font-mono text-[11px] leading-relaxed text-ink-muted">
                    <span className="text-ink-body">Example:</span>{" "}
                    {layer.example}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-baseline justify-between gap-4">
          <p className="max-w-[70ch] text-[15px] leading-[1.6] text-ink-body">
            <strong className="text-ink">{mechanism.close.bold}</strong>
            {mechanism.close.rest}
            <Highlight>{mechanism.close.hl}</Highlight>
            {mechanism.close.tail}
          </p>
          <p className="font-mono text-[11px] tracking-[0.15em] text-ink-muted">
            {staticMode
              ? mechanism.staticTail
              : `SYSTEM ${Math.min(active + 1, 4)} ${mechanism.progressTail}`}
          </p>
        </div>
      </div>
    </Section>
  );
}

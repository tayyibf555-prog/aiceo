"use client";

/*
  Scroll-stop curriculum: the WHOLE section (heading included) pins on
  desktop while scroll steps expand each session and fill the progress
  bar. Pinning the full section keeps the heading from sliding beneath
  the card stack. On small screens and under prefers-reduced-motion
  there is no pin: everything renders expanded, static.
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
import { curriculum } from "@/content/site";

gsap.registerPlugin(ScrollTrigger);

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default function Curriculum() {
  const [active, setActive] = useState<number>(0);
  const [staticMode, setStaticMode] = useState(false);
  const pinRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(0);

  useIsoLayoutEffect(() => {
    const pinnable =
      window.matchMedia("(min-width: 768px)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!pinnable) {
      setStaticMode(true);
      return;
    }
    const el = pinRef.current;
    if (!el) return;
    // gsap.context + revert keeps the pin's DOM surgery in sync with
    // React across StrictMode double-mounts, HMR and scroll restoration.
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: "top 72px",
        end: `+=${curriculum.rows.length * 260}`,
        pin: true,
        onUpdate: (self) => {
          const idx = Math.min(
            curriculum.rows.length - 1,
            Math.floor(self.progress * curriculum.rows.length)
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

  const progress = staticMode ? 1 : (active + 1) / curriculum.rows.length;

  return (
    <Section id="curriculum" className="py-20 md:py-24">
      <div ref={pinRef}>
        <Kicker>{curriculum.kicker}</Kicker>
        <h2 className="display-2 mt-3 max-w-[24ch]">{curriculum.h2}</h2>
        <p className="mt-4 max-w-[62ch] text-[16px] leading-[1.5] text-ink-body">
          {curriculum.sub}
        </p>

        <div className="mt-8">
          <div className="grid grid-cols-[16px_1fr] gap-x-5 md:gap-x-7">
            {/* rail */}
            <div aria-hidden className="relative">
              <span className="absolute inset-y-2 left-1/2 w-px -translate-x-1/2 bg-line" />
              {curriculum.rows.map((row, i) => (
                <span
                  key={row.code}
                  className={`absolute left-1/2 h-[9px] w-[9px] -translate-x-1/2 rounded-full border-2 transition-colors duration-300 ${
                    staticMode || i <= active
                      ? "border-accent bg-accent"
                      : "border-line-strong bg-bg"
                  }`}
                  style={{
                    top: `${(i / (curriculum.rows.length - 1)) * 92 + 2}%`,
                  }}
                />
              ))}
            </div>

            {/* cards */}
            <div className="space-y-2">
              {curriculum.rows.map((row, i) => {
                const open = staticMode || i === active;
                const passed = !staticMode && i < active;
                return (
                  <div
                    key={row.code}
                    className={`border bg-bg px-5 py-3.5 transition-all duration-300 md:px-6 ${
                      open
                        ? "border-accent shadow-[4px_4px_0_rgba(43,85,176,0.12)]"
                        : "border-line"
                    } ${passed ? "opacity-70" : ""}`}
                  >
                    <div className="flex items-baseline justify-between gap-4">
                      <p className="font-mono text-[11px] tracking-[0.15em]">
                        <span
                          className={open ? "text-accent" : "text-ink-muted"}
                        >
                          {row.code}
                        </span>
                        <span className="ml-3 text-ink-muted">{row.week}</span>
                      </p>
                      {passed && (
                        <span
                          aria-hidden
                          className="font-mono text-[11px] text-accent"
                        >
                          ✓
                        </span>
                      )}
                    </div>
                    <h3
                      className={`mt-1 font-bold tracking-tight transition-all duration-300 ${
                        open ? "text-[17px]" : "text-[15px]"
                      }`}
                    >
                      {row.name}
                    </h3>
                    <div
                      className={`grid transition-all duration-300 ${
                        open
                          ? "grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className="pt-1.5 text-[14px] leading-relaxed text-ink-body">
                          {row.outcome}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* progress */}
          <div className="mt-5 grid grid-cols-[16px_1fr] gap-x-5 md:gap-x-7">
            <span />
            <div>
              <div className="h-[3px] w-full bg-line">
                <div
                  className="h-full bg-accent transition-[width] duration-300"
                  style={{ width: `${progress * 100}%` }}
                />
              </div>
              <p className="mt-2 font-mono text-[11px] tracking-[0.15em] text-ink-muted">
                {staticMode
                  ? `8 SESSIONS ${curriculum.progressLabel}`
                  : `SESSION ${active + 1} ${curriculum.progressLabel}`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

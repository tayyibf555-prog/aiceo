"use client";

/*
  Scroll-stop curriculum: the card stack pins while scrolling and each
  scroll step expands the next session, with the progress bar filling
  underneath (GSAP ScrollTrigger pin). Under prefers-reduced-motion the
  pin never mounts and every card renders expanded, static.
*/
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Section from "@/components/Section";
import Kicker from "@/components/Kicker";
import { curriculum } from "@/content/site";

gsap.registerPlugin(ScrollTrigger);

export default function Curriculum() {
  const [active, setActive] = useState<number>(0);
  const [staticMode, setStaticMode] = useState(false);
  const pinRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStaticMode(true);
      return;
    }
    const el = pinRef.current;
    if (!el) return;
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top 96px",
      end: `+=${curriculum.rows.length * 320}`,
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
    return () => st.kill();
  }, []);

  const progress = staticMode ? 1 : (active + 1) / curriculum.rows.length;

  return (
    <Section id="curriculum" className="py-20 md:py-28">
      <Kicker>{curriculum.kicker}</Kicker>
      <h2 className="display-2 mt-4 max-w-[24ch]">{curriculum.h2}</h2>
      <p className="mt-5 max-w-[62ch] text-lg leading-[1.55] text-ink-body">
        {curriculum.sub}
      </p>

      <div ref={pinRef} className="mt-10 pb-2 pt-4">
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
                style={{ top: `${(i / (curriculum.rows.length - 1)) * 92 + 2}%` }}
              />
            ))}
          </div>

          {/* cards */}
          <div className="space-y-2.5">
            {curriculum.rows.map((row, i) => {
              const open = staticMode || i === active;
              const passed = !staticMode && i < active;
              return (
                <div
                  key={row.code}
                  className={`border px-5 py-4 transition-all duration-300 md:px-6 ${
                    open
                      ? "border-accent bg-accent-soft/40 bg-bg shadow-[4px_4px_0_rgba(21,87,224,0.12)]"
                      : "border-line bg-bg"
                  } ${passed ? "opacity-70" : ""}`}
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <p className="font-mono text-[11px] tracking-[0.15em]">
                      <span className={open ? "text-accent" : "text-ink-muted"}>
                        {row.code}
                      </span>
                      <span className="ml-3 text-ink-muted">{row.week}</span>
                    </p>
                    {passed && (
                      <span aria-hidden className="font-mono text-[11px] text-accent">
                        ✓
                      </span>
                    )}
                  </div>
                  <h3
                    className={`mt-1.5 font-bold tracking-tight transition-all duration-300 ${
                      open ? "text-lg" : "text-[15px]"
                    }`}
                  >
                    {row.name}
                  </h3>
                  <div
                    className={`grid transition-all duration-300 ${
                      open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="pt-2 text-[15px] leading-relaxed text-ink-body">
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
        <div className="mt-7 grid grid-cols-[16px_1fr] gap-x-5 md:gap-x-7">
          <span />
          <div>
            <div className="h-[3px] w-full bg-line">
              <div
                className="h-full bg-accent transition-[width] duration-300"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
            <p className="mt-2.5 font-mono text-[11px] tracking-[0.15em] text-ink-muted">
              {staticMode
                ? `8 SESSIONS ${curriculum.progressLabel}`
                : `SESSION ${active + 1} ${curriculum.progressLabel}`}
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}

"use client";

/*
  Scroll-stop curriculum: the whole section pins (md+), and the eight
  session cards start blank, appearing one by one as you scroll. Cards
  already revealed stay open. Rows pair into weeks (Tuesday build next
  to its Thursday proof). Small screens and prefers-reduced-motion get
  the finished state, unpinned. GSAP lives in gsap.context and reverts
  on cleanup.
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
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: "top 72px",
        end: `+=${curriculum.rows.length * 240}`,
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

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {curriculum.rows.map((row, i) => {
            const revealed = staticMode || i <= active;
            const current = !staticMode && i === active;
            return (
              <div
                key={row.code}
                className={`border bg-bg px-5 py-4 transition-all duration-500 md:px-6 ${
                  revealed
                    ? "translate-y-0 opacity-100"
                    : "translate-y-3 opacity-0"
                } ${
                  current
                    ? "border-accent shadow-[4px_4px_0_rgba(43,85,176,0.12)]"
                    : "border-line"
                }`}
              >
                <p className="font-mono text-[11px] tracking-[0.15em]">
                  <span className={current ? "text-accent" : "text-ink-muted"}>
                    {row.code}
                  </span>
                  <span className="ml-3 text-ink-muted">{row.week}</span>
                </p>
                <h3 className="mt-1 text-[17px] font-bold tracking-tight">
                  {row.name}
                </h3>
                <p className="mt-1.5 text-[14px] leading-relaxed text-ink-body">
                  {row.outcome}
                </p>
              </div>
            );
          })}
        </div>

        {/* progress */}
        <div className="mt-6">
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
    </Section>
  );
}

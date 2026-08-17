"use client";

/*
  "Picture 30 days from now": pinned stop-scroll timeline. The accent
  line draws down the rail with scroll, and each beat reveals the
  moment the line reaches its dot. One beat per system. Pins on lg+
  only; smaller screens and reduced-motion render the finished state.
  GSAP work lives in gsap.context and reverts on cleanup.
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
import Button from "@/components/Button";
import { days } from "@/content/site";

gsap.registerPlugin(ScrollTrigger);

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default function Days() {
  const [active, setActive] = useState(0);
  const [staticMode, setStaticMode] = useState(false);
  const pinRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(0);
  const count = days.entries.length;

  useIsoLayoutEffect(() => {
    const pinnable =
      window.matchMedia("(min-width: 1024px)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!pinnable) {
      setStaticMode(true);
      if (lineRef.current) lineRef.current.style.transform = "scaleY(1)";
      return;
    }
    const el = pinRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: "top 88px",
        end: `+=${count * 230}`,
        pin: true,
        onUpdate: (self) => {
          const p = self.progress;
          if (lineRef.current)
            lineRef.current.style.transform = `scaleY(${p.toFixed(4)})`;
          // the line reaches dot i at p = i/(count-1); reveal just after
          const idx = Math.min(
            count - 1,
            Math.floor(p * (count - 1) + 0.04)
          );
          if (idx !== activeRef.current) {
            activeRef.current = idx;
            setActive(idx);
          }
        },
      });
    }, el);
    return () => ctx.revert();
  }, [count]);

  return (
    <Section id="days" className="py-20 md:py-24">
      <div ref={pinRef} className="max-w-[72ch]">
        <h2 className="display-2">{days.h2}</h2>

        <div className="relative mt-10 pl-9">
          {/* rail + animated fill */}
          <div
            aria-hidden
            className="absolute bottom-3 left-[5px] top-2 w-px bg-line"
          >
            <div
              ref={lineRef}
              className="h-full w-full origin-top scale-y-0 bg-accent"
            />
          </div>

          {days.entries.map((entry, i) => {
            const revealed = staticMode || i <= active;
            return (
              <div
                key={entry.time}
                className={`relative pb-9 transition-all duration-500 last:pb-0 ${
                  revealed
                    ? "translate-y-0 opacity-100"
                    : "translate-y-3 opacity-0"
                }`}
              >
                <span
                  aria-hidden
                  className={`absolute -left-9 top-1 h-[11px] w-[11px] -translate-x-[5px] rounded-full border-2 transition-colors duration-300 ${
                    revealed
                      ? "border-accent bg-accent"
                      : "border-line-strong bg-bg"
                  }`}
                  style={{ left: "-36px" }}
                />
                <p className="font-mono text-[11px] tracking-[0.18em]">
                  <span className={revealed ? "text-accent" : "text-ink-muted"}>
                    {entry.time}
                  </span>
                  <span className="ml-3 text-ink-muted">· {entry.tag}</span>
                </p>
                <p className="mt-2 max-w-[58ch] text-[17px] font-medium leading-relaxed text-ink">
                  {entry.text}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-9 flex flex-wrap items-center justify-between gap-4">
          <Button href={days.cta.href}>{days.cta.label}</Button>
          <p className="font-mono text-[11px] tracking-[0.15em] text-ink-muted">
            {staticMode
              ? days.staticTail
              : `BEAT ${Math.min(active + 1, count)} ${days.tail}`}
          </p>
        </div>
      </div>
    </Section>
  );
}

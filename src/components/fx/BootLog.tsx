"use client";

/*
  Decorative terminal boot readout for the hero: lines fade in one by
  one after the hero timeline, the last keeps a blinking cursor. Hidden
  from screen readers; static under prefers-reduced-motion.
*/
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { hero } from "@/content/site";

export default function BootLog() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        el.querySelectorAll("[data-line]"),
        { autoAlpha: 0, x: -6 },
        {
          autoAlpha: 1,
          x: 0,
          duration: 0.35,
          ease: "power2.out",
          stagger: 0.3,
          delay: 1.0,
        }
      );
    });
    return () => mm.revert();
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="font-mono text-[11px] leading-[2] tracking-[0.06em] text-ink-muted"
    >
      {hero.bootLog.map((line, i) => (
        <p data-line key={line}>
          <span className="text-accent">▶</span> {line}
          {i === hero.bootLog.length - 1 && (
            <span className="hud-cursor ml-2 inline-block h-[11px] w-[6px] bg-accent align-middle" />
          )}
        </p>
      ))}
    </div>
  );
}

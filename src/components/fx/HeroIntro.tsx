"use client";

/*
  Hero load timeline: staggers [data-hero] blocks up and in on first
  paint. Short, decisive, power3.out; nothing bouncy. Reduced motion
  leaves everything static.
*/
import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";

export default function HeroIntro({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        el.querySelectorAll("[data-hero]"),
        { autoAlpha: 0, y: 26 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.09,
        }
      );
    });
    return () => mm.revert();
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

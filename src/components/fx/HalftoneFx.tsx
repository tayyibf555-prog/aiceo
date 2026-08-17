"use client";

/*
  The arrow mark assembles from random pixel clusters: LogoHalftone
  renders its cells split into [data-ht] bucket paths; this staggers
  them in from random order, so the mark "renders" on arrival.
*/
import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";

export default function HalftoneFx({
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
      const tl = gsap.timeline({ delay: 0.15 });
      tl.fromTo(
        el,
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 0.55, ease: "power3.out" }
      ).fromTo(
        el.querySelectorAll("[data-ht]"),
        { autoAlpha: 0 },
        {
          autoAlpha: 1,
          duration: 0.4,
          ease: "power2.out",
          stagger: { each: 0.06, from: "random" },
        },
        "-=0.25"
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

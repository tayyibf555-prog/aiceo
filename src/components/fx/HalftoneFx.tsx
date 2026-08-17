"use client";

/*
  The arrow mark's life support. Three layers, all reduced-motion gated:
    1. Assembly: bucket paths stagger in from random order on load.
    2. Ambient: buckets breathe (opacity shimmer with re-randomised
       targets) and the whole mark drifts subtly, so the "second brain"
       reads as running, not printed.
    3. Parallax: on fine pointers the mark leans lazily toward the
       cursor.
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
      const buckets = el.querySelectorAll("[data-ht]");

      const ambient = () => {
        gsap.to(buckets, {
          opacity: () => gsap.utils.random(0.55, 1),
          duration: () => gsap.utils.random(1.4, 2.6),
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          repeatRefresh: true,
          stagger: { each: 0.18, from: "random" },
        });
      };

      const tl = gsap.timeline({ delay: 0.15, onComplete: ambient });
      tl.fromTo(
        el,
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 0.55, ease: "power3.out" }
      ).fromTo(
        buckets,
        { autoAlpha: 0 },
        {
          autoAlpha: 1,
          duration: 0.4,
          ease: "power2.out",
          stagger: { each: 0.06, from: "random" },
        },
        "-=0.25"
      );

      let removeMove: (() => void) | undefined;
      if (window.matchMedia("(pointer: fine)").matches) {
        const inner = el.firstElementChild as HTMLElement | null;
        if (inner) {
          const xTo = gsap.quickTo(inner, "x", { duration: 0.7, ease: "power3.out" });
          const yTo = gsap.quickTo(inner, "y", { duration: 0.7, ease: "power3.out" });
          const onMove = (e: PointerEvent) => {
            xTo((e.clientX / window.innerWidth - 0.5) * 14);
            yTo((e.clientY / window.innerHeight - 0.5) * 10);
          };
          window.addEventListener("pointermove", onMove, { passive: true });
          removeMove = () => window.removeEventListener("pointermove", onMove);
        }
      }
      return () => removeMove?.();
    });
    return () => mm.revert();
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

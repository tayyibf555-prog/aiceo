"use client";

/*
  Problem-section diagram: [data-dg] pieces stagger in when the panel
  scrolls into view; then the [data-float] chips drift gently and the
  [data-cross] marks pulse, so the "nothing talks to anything" state
  reads as alive but broken.
*/
import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function DiagramFx({
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
      const startDrift = () => {
        gsap.to(el.querySelectorAll("[data-float]"), {
          y: "+=5",
          duration: 2.4,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          stagger: { each: 0.3, from: "random" },
        });
        gsap.to(el.querySelectorAll("[data-cross]"), {
          opacity: 0.35,
          duration: 1.6,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          stagger: { each: 0.4, from: "random" },
        });
      };
      if (el.getBoundingClientRect().top < window.innerHeight * 0.92) {
        startDrift();
        return;
      }
      gsap.fromTo(
        el.querySelectorAll("[data-dg]"),
        { autoAlpha: 0, y: 14 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.45,
          ease: "power2.out",
          stagger: 0.07,
          scrollTrigger: { trigger: el, start: "top 80%", once: true },
          onComplete: startDrift,
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

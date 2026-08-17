"use client";

/*
  Interactive maths: drag the average-job slider, the yearly number
  tweens to value × 10 revived clients, and the fee-cover count updates.
*/
import { useRef, useState } from "react";
import gsap from "gsap";
import Section from "@/components/Section";
import Kicker from "@/components/Kicker";
import Reveal from "@/components/Reveal";
import { roi } from "@/content/site";

const FEE = 1299;

export default function RoiMaths() {
  const [value, setValue] = useState(roi.slider.initial);
  const [display, setDisplay] = useState(roi.slider.initial * 10);
  const tweenObj = useRef({ v: roi.slider.initial * 10 });

  const onSlide = (next: number) => {
    setValue(next);
    gsap.to(tweenObj.current, {
      v: next * 10,
      duration: 0.35,
      ease: "power2.out",
      onUpdate: () => setDisplay(Math.round(tweenObj.current.v)),
      overwrite: true,
    });
  };

  const cover = Math.max(1, Math.ceil(FEE / value));

  return (
    <Section id="roi" className="py-20 md:py-28">
      <Kicker>{roi.kicker}</Kicker>
      <h2 className="display-2 mt-4 max-w-[20ch]">{roi.h2}</h2>
      <p className="mt-5 max-w-[62ch] text-lg leading-[1.55] text-ink-body">
        {roi.body}
      </p>

      <div className="mt-12 grid items-stretch gap-5 lg:grid-cols-2">
        <Reveal>
          <div className="flex h-full flex-col border border-line bg-bg p-8">
            <p className="font-mono text-[11px] tracking-[0.18em] text-ink-muted">
              {roi.slider.label}
            </p>
            <p className="mt-5 text-4xl font-bold tabular-nums tracking-tight">
              ${value.toLocaleString("en-GB")}
            </p>
            <input
              type="range"
              min={roi.slider.min}
              max={roi.slider.max}
              step={roi.slider.step}
              value={value}
              onChange={(e) => onSlide(Number(e.target.value))}
              aria-label={`Average job value: £${value}`}
              className="range-accent mt-6"
            />
            <div className="mt-2 flex justify-between font-mono text-[10px] tracking-[0.12em] text-ink-muted">
              <span>${roi.slider.min}</span>
              <span>{roi.slider.hint.toUpperCase()}</span>
              <span>${roi.slider.max.toLocaleString("en-GB")}</span>
            </div>
            <p className="mt-auto border-t border-line pt-5 text-[15px] font-bold leading-relaxed text-ink">
              <span className="text-accent">{cover}</span> {roi.coverLabel}
            </p>
          </div>
        </Reveal>

        <Reveal delay={90}>
          <div className="flex h-full flex-col border-2 border-accent bg-bg p-8 shadow-[8px_8px_0_rgba(43,85,176,0.15)]">
            <p className="font-mono text-[11px] tracking-[0.18em] text-accent">
              {roi.result.label}
            </p>
            <p
              className="mt-4 font-bold tabular-nums tracking-tight"
              style={{ fontSize: "clamp(52px,6vw,84px)", lineHeight: 1.05 }}
            >
              ${display.toLocaleString("en-GB")}
            </p>
            <p className="mt-3 font-mono text-[11px] tracking-[0.1em] text-ink-muted">
              {roi.result.formula.toUpperCase()}
            </p>
            <p className="mt-auto pt-6 text-[15px] leading-relaxed text-ink-body">
              {roi.result.note}
            </p>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

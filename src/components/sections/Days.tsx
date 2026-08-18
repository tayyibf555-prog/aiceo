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

/* One OS screen per beat: the picture that changes as you scroll.
   Times mirror days.entries in site.ts. */
const OS_SHOTS: { time: string; rows: { k: string; v: string; hl?: boolean }[]; foot: string }[] = [
  {
    time: "11:42 PM",
    rows: [
      { k: "IN 23:42", v: "new enquiry · loft conversion" },
      { k: "OUT 23:46", v: "reply sent · your voice · price attached", hl: true },
      { k: "OFFERED", v: "Tue 10:00 / Thu 14:00" },
      { k: "YOU", v: "asleep" },
    ],
    foot: "speed_to_lead · 4 MIN REPLY",
  },
  {
    time: "2:00 AM",
    rows: [
      { k: "QUEUE", v: "40 dormant clients" },
      { k: "SENT", v: "████████░░ 32/40", hl: true },
      { k: "REPLIES", v: "3 already in" },
      { k: "YOU", v: "still asleep" },
    ],
    foot: "reactivation · THE OLD LIST, WORKING",
  },
  {
    time: "7:00 AM",
    rows: [
      { k: "TODAY", v: "set by the OS", hl: true },
      { k: "OVERNIGHT", v: "1 enquiry answered · 3 replies" },
      { k: "CHASE", v: "6 warm leads queued" },
      { k: "NEEDS YOU", v: "1 decision" },
    ],
    foot: "orchestrator · THE DAY, ALREADY SET",
  },
  {
    time: "9:15 AM",
    rows: [
      { k: "Q", v: "what did we quote in March?" },
      { k: "A", v: "£4,800 · fitted 12 March", hl: true },
      { k: "FOUND IN", v: "9 seconds" },
      { k: "SOURCE", v: "your files" },
    ],
    foot: "brain · NOTHING FORGOTTEN",
  },
  {
    time: "THE DAY",
    rows: [
      { k: "INBOX", v: "handled" },
      { k: "LEADS", v: "answered and chased" },
      { k: "LIST", v: "waking up" },
      { k: "YOU", v: "on the work only you can do", hl: true },
    ],
    foot: "aiceo_os · RUNNING WITHOUT YOU",
  },
];

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

  const shot = OS_SHOTS[staticMode ? 2 : Math.min(active, OS_SHOTS.length - 1)];

  return (
    <Section id="days" className="py-20 md:py-24">
      <div ref={pinRef}>
        <h2 className="display-2">{days.h2}</h2>

        <div className="mt-10 grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="relative pl-9">
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

        {/* the OS, pictured: one screen per beat, swapping with scroll */}
        <aside className="overflow-hidden border-2 border-accent bg-bg-dark shadow-[8px_8px_0_rgba(43,85,176,0.15)]">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5 font-mono text-[10.5px] tracking-[0.15em] text-neutral-400">
            <span className="flex items-center gap-2">
              <span aria-hidden className="live-dot h-1.5 w-1.5 rounded-full bg-accent" />
              THE AI CEO OS
            </span>
            <span className="text-accent">{shot.time}</span>
          </div>
          <div key={staticMode ? "static" : active} className="os-shot-enter space-y-3 px-4 py-5">
            {shot.rows.map((r) => (
              <p key={r.k} className="flex gap-3 font-mono text-[12px] leading-relaxed">
                <span className="w-24 shrink-0 text-neutral-500">{r.k}</span>
                <span className={r.hl ? "text-white" : "text-neutral-300"}>
                  {r.hl && (
                    <span aria-hidden className="mr-1.5 text-accent">
                      ▸
                    </span>
                  )}
                  {r.v}
                </span>
              </p>
            ))}
          </div>
          <div className="border-t border-white/10 px-4 py-2 font-mono text-[9.5px] tracking-[0.14em] text-neutral-500">
            $ {shot.foot}
          </div>
        </aside>
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

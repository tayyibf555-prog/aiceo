import Section from "@/components/Section";
import Kicker from "@/components/Kicker";
import Reveal from "@/components/Reveal";
import { whatYouGet } from "@/content/site";

/* Minimal mono line icons, one per card, drawn to sit inside the dashed
   frames. Stroke-only, currentColor, so they inherit ink-muted. */
function GetIcon({ kind }: { kind: string }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
  } as const;
  switch (kind) {
    case "folder":
      return (
        <svg viewBox="0 0 48 48" className="h-10 w-10" aria-hidden>
          <path {...common} d="M8 14h12l4 5h16v15H8z" />
          <path {...common} d="M8 19h32" />
          <circle cx="14" cy="27" r="1.6" fill="var(--color-accent)" stroke="none" />
        </svg>
      );
    case "chat":
      return (
        <svg viewBox="0 0 48 48" className="h-10 w-10" aria-hidden>
          <path {...common} d="M9 13h30v18H22l-7 6v-6H9z" />
          <path {...common} d="M15 20h18M15 25h11" />
        </svg>
      );
    case "bolt":
      return (
        <svg viewBox="0 0 48 48" className="h-10 w-10" aria-hidden>
          <path {...common} d="M26 9L14 27h8l-2 12 12-18h-8z" />
        </svg>
      );
    case "wave":
      return (
        <svg viewBox="0 0 48 48" className="h-10 w-10" aria-hidden>
          {[9, 14, 19, 24, 29, 34, 39].map((x, i) => (
            <line
              key={x}
              {...common}
              x1={x}
              y1={24 - [4, 8, 13, 16, 11, 7, 4][i]}
              x2={x}
              y2={24 + [4, 8, 13, 16, 11, 7, 4][i]}
              stroke={i === 3 ? "var(--color-accent)" : "currentColor"}
            />
          ))}
        </svg>
      );
    case "network":
      return (
        <svg viewBox="0 0 48 48" className="h-10 w-10" aria-hidden>
          <path {...common} d="M24 24L12 14M24 24l13-9M24 24L14 36m10-12l11 11" />
          <circle cx="24" cy="24" r="3" fill="var(--color-accent)" stroke="none" />
          {[
            [12, 14],
            [37, 15],
            [14, 36],
            [35, 35],
          ].map(([cx, cy]) => (
            <circle key={`${cx}${cy}`} {...common} cx={cx} cy={cy} r="2.5" />
          ))}
        </svg>
      );
    case "key":
      return (
        <svg viewBox="0 0 48 48" className="h-10 w-10" aria-hidden>
          <circle {...common} cx="17" cy="24" r="6" />
          <circle cx="17" cy="24" r="1.8" fill="var(--color-accent)" stroke="none" />
          <path {...common} d="M23 24h16m-5 0v5m-5-5v4" />
        </svg>
      );
    default:
      return null;
  }
}

export default function WhatYouGet() {
  return (
    <Section id="get" className="py-20 md:py-28">
      <Kicker>{whatYouGet.kicker}</Kicker>
      <h2 className="display-2 mt-4">{whatYouGet.h2}</h2>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {whatYouGet.cards.map((card, i) => (
          <Reveal key={card.label} delay={(i % 3) * 80}>
            <div className="h-full border border-line bg-bg p-6">
              <p className="font-mono text-[10px] tracking-[0.18em] text-ink-muted">
                {card.label.startsWith("LIVE") && (
                  <span
                    aria-hidden
                    className="live-dot mr-2 inline-block h-1.5 w-1.5 rounded-full bg-accent align-middle"
                  />
                )}
                {card.label}
              </p>
              <div className="mt-4 grid h-24 place-items-center border border-dashed border-line-strong text-ink-muted">
                <GetIcon kind={card.icon} />
              </div>
              <h3 className="mt-5 font-bold tracking-tight">{card.title}</h3>
              <p className="mt-1.5 text-[14px] leading-relaxed text-ink-body">
                {card.text}
              </p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={100}>
        <div className="mt-5 border border-line bg-bg p-8 md:p-10">
          <p className="font-mono text-[10px] tracking-[0.18em] text-ink-muted">
            {whatYouGet.banner.label}
          </p>
          <p className="display-2 mt-3">
            {whatYouGet.banner.h[0]}{" "}
            <span className="text-accent">{whatYouGet.banner.h[1]}</span>
          </p>
          <p className="mt-4 max-w-[70ch] text-lg leading-[1.55] text-ink-body">
            {whatYouGet.banner.text}
          </p>
        </div>
      </Reveal>
    </Section>
  );
}

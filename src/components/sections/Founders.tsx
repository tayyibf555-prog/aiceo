"use client";

/*
  Two founder cards. Clicking flips the card (CSS 3D, gated for reduced
  motion in globals.css) to reveal the bio on the back. Photos and bios
  are placeholders in site.ts until the real ones land.
*/
import { useState } from "react";
import Section from "@/components/Section";
import Kicker from "@/components/Kicker";
import Reveal from "@/components/Reveal";
import { founders } from "@/content/site";

function FounderCard({
  card,
}: {
  card: (typeof founders.cards)[number];
}) {
  const [flipped, setFlipped] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setFlipped((f) => !f)}
      aria-pressed={flipped}
      aria-label={`${card.name}: flip card to ${flipped ? "hide" : "show"} bio`}
      className="flip-scene block w-full text-left"
    >
      <div className={`flip-inner h-[420px] ${flipped ? "flipped" : ""}`}>
        {/* front */}
        <div className="flip-face absolute inset-0 flex flex-col border border-line bg-bg p-6 transition-colors hover:border-accent">
          <div className="grid flex-1 place-items-center border border-dashed border-line-strong">
            <div className="text-center font-mono text-[11px] tracking-[0.18em] text-ink-muted">
              <span className="mb-3 block text-3xl" aria-hidden>
                ◉
              </span>
              {card.photoLabel}
            </div>
          </div>
          <div className="mt-5 flex items-end justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold tracking-tight">{card.name}</h3>
              <p className="mt-0.5 font-mono text-[10px] tracking-[0.18em] text-ink-muted">
                {card.role}
              </p>
            </div>
            <span className="font-mono text-[10px] tracking-[0.15em] text-accent">
              {founders.flipHint} ⟳
            </span>
          </div>
        </div>
        {/* back */}
        <div className="flip-face flip-back absolute inset-0 flex flex-col border-2 border-accent bg-bg p-7">
          <p className="font-mono text-[10px] tracking-[0.18em] text-accent">
            {card.name} · {card.role}
          </p>
          <p className="mt-5 text-[16px] leading-[1.6] text-ink-body">
            {card.bio}
          </p>
          <p className="mt-auto font-mono text-[10px] tracking-[0.15em] text-ink-muted">
            {founders.flipHint} ⟲
          </p>
        </div>
      </div>
    </button>
  );
}

export default function Founders() {
  return (
    <Section id="founders" className="py-20 md:py-28">
      <Kicker>{founders.kicker}</Kicker>
      <h2 className="display-2 mt-4 max-w-[24ch]">
        {founders.h2a}
        <br />
        <span className="text-ink-body">{founders.h2b}</span>
      </h2>
      <p className="mt-5 max-w-[58ch] text-lg leading-[1.55] text-ink-body">
        {founders.body}
      </p>

      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:max-w-4xl">
        {founders.cards.map((card, i) => (
          <Reveal key={card.id} delay={i * 90}>
            <FounderCard card={card} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

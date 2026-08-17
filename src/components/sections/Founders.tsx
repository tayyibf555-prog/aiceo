"use client";

/*
  Two founder cards. Clicking flips the card (CSS 3D, gated for reduced
  motion in globals.css) to reveal the bio on the back. Photos and bios
  are placeholders in site.ts until the real ones land.
*/
import { useState } from "react";
import Image, { type StaticImageData } from "next/image";
import riteshPhoto from "../../../public/founders/ritesh.webp";
import Section from "@/components/Section";
import Kicker from "@/components/Kicker";
import Reveal from "@/components/Reveal";
import { founders } from "@/content/site";

/* Static imports guarantee the photos resolve at build time. */
const PHOTOS: Record<string, StaticImageData> = {
  "founder-2": riteshPhoto,
};

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
      <div className={`flip-inner h-[440px] ${flipped ? "flipped" : ""}`}>
        {/* front */}
        <div className="flip-face absolute inset-0 flex flex-col border border-line bg-bg p-6 transition-all duration-300 hover:border-accent hover:shadow-[4px_4px_0_rgba(43,85,176,0.12)]">
          <p className="mb-4 font-mono text-[10px] tracking-[0.18em] text-ink-muted">
            <span aria-hidden className="text-accent">
              ●
            </span>{" "}
            {card.role}
          </p>
          {PHOTOS[card.id] ? (
            <div className="relative flex-1 overflow-hidden border border-line">
              <Image
                src={PHOTOS[card.id]}
                alt={card.name}
                fill
                sizes="(max-width: 768px) 90vw, 420px"
                className="object-cover object-center"
              />
            </div>
          ) : (
            <div className="grid flex-1 place-items-center border border-dashed border-line-strong">
              <div className="text-center font-mono text-[11px] tracking-[0.18em] text-ink-muted">
                <span className="mb-3 block text-3xl" aria-hidden>
                  ◉
                </span>
                {card.photoLabel}
              </div>
            </div>
          )}
          <div className="mt-5 flex items-end justify-between gap-4">
            {card.name && (
              <h3 className="text-lg font-bold tracking-tight">{card.name}</h3>
            )}
            <span className="ml-auto font-mono text-[10px] tracking-[0.15em] text-accent">
              {founders.flipHint} ⟳
            </span>
          </div>
        </div>
        {/* back */}
        <div className="flip-face flip-back absolute inset-0 flex flex-col border-2 border-accent bg-bg p-7 shadow-[8px_8px_0_rgba(43,85,176,0.15)]">
          <p className="font-mono text-[10px] tracking-[0.18em] text-accent">
            {card.name ? `${card.name} · ${card.role}` : card.role}
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

function WallCard({ name }: { name: string }) {
  return (
    <figure className="relative h-[220px] w-[180px] shrink-0 border border-line bg-bg">
      <div className="absolute inset-0 grid place-items-center border-b border-dashed border-line">
        <span
          aria-hidden
          className="grid h-11 w-11 place-items-center border border-line-strong font-mono text-[13px] text-ink-muted"
        >
          ▶
        </span>
      </div>
      <figcaption className="absolute inset-x-0 bottom-0 bg-bg/90 px-3 py-2 font-mono text-[10px] tracking-[0.15em] text-ink-body">
        {name}
      </figcaption>
    </figure>
  );
}

export default function Founders() {
  return (
    <Section id="founders" container={false} className="overflow-hidden py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
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

        <p className="mt-16 font-mono text-[11px] tracking-[0.18em] text-ink-muted">
          <span aria-hidden className="text-accent">
            ●
          </span>{" "}
          THE WALL · {founders.wallSub.toUpperCase()}
        </p>
      </div>

      <div className="marquee mt-6 [mask-image:linear-gradient(90deg,transparent,black_6%,black_94%,transparent)]">
        <div className="marquee-track gap-5 pr-5">
          {[...founders.wall, ...founders.wall].map((card, i) => (
            <WallCard key={`${card.name}-${i}`} name={card.name} />
          ))}
        </div>
      </div>
    </Section>
  );
}

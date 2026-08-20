"use client";

/*
  Two founder cards. Clicking flips the card (CSS 3D, gated for reduced
  motion in globals.css) to reveal the bio on the back. Photos and bios
  are placeholders in site.ts until the real ones land.
*/
import { useState } from "react";
import Image, { type StaticImageData } from "next/image";
import riteshPhoto from "../../../public/founders/ritesh.webp";
import tayyibPhoto from "../../../public/founders/tayyib.webp";
import Section from "@/components/Section";
import Kicker from "@/components/Kicker";
import Reveal from "@/components/Reveal";
import { founders } from "@/content/site";

/* Static imports guarantee the photos resolve at build time. */
const PHOTOS: Record<string, StaticImageData> = {
  "founder-1": tayyibPhoto,
  "founder-2": riteshPhoto,
};

/* Where each portrait's face sits, so the wide card frame crops to it. */
const OBJ_POS: Record<string, string> = {
  "founder-1": "50% 26%",
  "founder-2": "50% 42%",
};

/* Social icons in the site's stroke language. */
function SocialIcon({ kind }: { kind: string }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.5 } as const;
  switch (kind) {
    case "web":
      return (
        <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" aria-hidden>
          <circle {...common} cx="12" cy="12" r="9" />
          <ellipse {...common} cx="12" cy="12" rx="4" ry="9" />
          <path {...common} d="M3 12h18" />
        </svg>
      );
    case "youtube":
      return (
        <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" aria-hidden>
          <rect {...common} x="3" y="6.5" width="18" height="11" rx="3" />
          <path d="M10.5 9.5v5l4.5-2.5z" fill="currentColor" stroke="none" />
        </svg>
      );
    case "instagram":
      return (
        <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" aria-hidden>
          <rect {...common} x="4" y="4" width="16" height="16" rx="4.5" />
          <circle {...common} cx="12" cy="12" r="4" />
          <circle cx="17" cy="7" r="1.2" fill="currentColor" stroke="none" />
        </svg>
      );
    default:
      return null;
  }
}

function FounderCard({
  card,
}: {
  card: (typeof founders.cards)[number];
}) {
  const [flipped, setFlipped] = useState(false);
  const toggle = () => setFlipped((f) => !f);

  return (
    /* div, not button: the back face holds real links */
    <div
      role="button"
      tabIndex={0}
      onClick={toggle}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggle();
        }
      }}
      aria-pressed={flipped}
      aria-label={`${card.name}: flip card to ${flipped ? "hide" : "show"} bio`}
      className="flip-scene block w-full cursor-pointer text-left"
    >
      <div className={`flip-inner h-[440px] ${flipped ? "flipped" : ""}`}>
        {/* front: the photo IS the card */}
        <div className="flip-face absolute inset-0 overflow-hidden border border-line bg-bg-dark transition-all duration-300 hover:border-accent hover:shadow-[4px_4px_0_rgba(43,85,176,0.12)]">
          {PHOTOS[card.id] ? (
            <Image
              src={PHOTOS[card.id]}
              alt={card.name}
              fill
              sizes="(max-width: 768px) 90vw, 420px"
              className="object-cover"
              style={{ objectPosition: OBJ_POS[card.id] ?? "center" }}
            />
          ) : (
            <div className="grid h-full place-items-center border border-dashed border-line-strong bg-bg">
              <span className="font-mono text-[11px] tracking-[0.18em] text-ink-muted">
                {card.photoLabel}
              </span>
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 px-4 py-3 [text-shadow:0_1px_8px_rgba(0,0,0,0.9)]">
            <h3 className="text-lg font-bold tracking-tight text-white">
              {card.name}
            </h3>
            <p className="mt-0.5 font-mono text-[10px] tracking-[0.18em] text-white/75">
              {card.role}
            </p>
          </div>
        </div>
        {/* the tag overlaps the corner, outside the clipped photo face;
            its own flip-face class hides it when the card turns */}
        <span className="flip-face absolute -right-2.5 -top-2.5 z-10 bg-accent px-3 py-1.5 font-mono text-[10px] tracking-[0.15em] text-accent-on shadow-[3px_3px_0_rgba(10,10,10,0.9)]">
          {founders.flipHint} ⟳
        </span>
        {/* back */}
        <div className="flip-face flip-back absolute inset-0 flex flex-col border-2 border-accent bg-bg p-7 shadow-[8px_8px_0_rgba(43,85,176,0.15)]">
          <p className="font-mono text-[10px] tracking-[0.18em] text-accent">
            {card.name ? `${card.name} · ${card.role}` : card.role}
          </p>
          <p className="mt-5 text-[15px] leading-[1.6] text-ink-body">
            {card.bio}
          </p>
          <div className="mt-6 flex items-center gap-2.5">
            {card.links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                aria-label={`${card.name} · ${link.label}`}
                onClick={(e) => e.stopPropagation()}
                className="grid h-9 w-9 place-items-center border border-line text-ink-body transition-colors hover:border-accent hover:text-accent"
              >
                {"img" in link && link.img ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={link.img} alt="" className="h-4.5 w-4.5 object-contain" />
                ) : (
                  <SocialIcon kind={link.kind} />
                )}
              </a>
            ))}
          </div>
          <p className="mt-auto font-mono text-[10px] tracking-[0.15em] text-ink-muted">
            {founders.flipHint} ⟲
          </p>
        </div>
      </div>
    </div>
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
          <span className="text-accent">{founders.h2b}</span>
        </h2>
        <p className="mt-5 max-w-[58ch] text-lg leading-[1.55] text-ink-body">
          {founders.body}
        </p>

        <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-2">
          {founders.cards.map((card, i) => (
            <Reveal key={card.id} delay={i * 90}>
              <FounderCard card={card} />
            </Reveal>
          ))}
        </div>

      </div>

      {/* THE WALL is parked until real faces and quotes exist. To bring
          it back, restore this block and the WallCard component below:

          <p className="mt-16 font-mono text-[11px] tracking-[0.18em] text-ink-muted">
            <span aria-hidden className="text-accent">●</span>{" "}
            THE WALL · {founders.wallSub.toUpperCase()}
          </p>
          <div className="marquee mt-6 [mask-image:linear-gradient(90deg,transparent,black_6%,black_94%,transparent)]">
            <div className="marquee-track gap-5 pr-5">
              {[...founders.wall, ...founders.wall].map((card, i) => (
                <WallCard key={`${card.name}-${i}`} name={card.name} />
              ))}
            </div>
          </div>

          founders.wall and founders.wallSub stay in site.ts, and the
          marquee CSS stays in globals.css, so nothing else is needed. */}
    </Section>
  );
}

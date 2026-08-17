import Section from "@/components/Section";
import Kicker from "@/components/Kicker";
import Reveal from "@/components/Reveal";
import LeadForm from "@/components/LeadForm";
import { pricing, checkoutUrl } from "@/content/site";

/*
  Two saturated accent cards (cohort + 1-on-1), each: dark pill badge,
  white title and intro, translucent WHAT YOU GET checklist, WHY IT'S
  WORTH IT block, price area with a black seat chip, and a full-width
  near-black action. The 1-on-1 card's action is the live enquiry form.
*/
function Check() {
  return (
    <span
      aria-hidden
      className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-[4px] bg-bg-dark font-mono text-[10px] leading-none text-white"
    >
      ✓
    </span>
  );
}

export default function Pricing() {
  return (
    <Section id="pricing" className="py-20 md:py-28">
      <Kicker>{pricing.kicker}</Kicker>
      <h2 className="display-2 mt-4">{pricing.h2}</h2>

      <div className="mt-12 grid items-stretch gap-6 lg:grid-cols-2">
        {pricing.cards.map((card, i) => (
          <Reveal key={card.id} delay={i * 100} className="h-full">
            <div className="flex h-full flex-col rounded-xl bg-gradient-to-br from-accent to-accent-hover p-7 text-white shadow-2xl md:p-8">
              <span className="self-start rounded-full bg-bg-dark px-4 py-1.5 font-mono text-[10px] tracking-[0.2em] text-white/90">
                {card.badge}
              </span>
              <h3 className="mt-5 text-3xl font-bold tracking-tight">
                {card.title}
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-white/90">
                {card.intro}
              </p>

              <div className="mt-6 rounded-lg border border-white/30 bg-white/15 p-5">
                <p className="font-mono text-[10px] tracking-[0.2em] text-white/75">
                  WHAT YOU GET
                </p>
                <ul className="mt-4 space-y-3">
                  {card.whatYouGet.map((item) => (
                    <li
                      key={item}
                      className="flex gap-3 font-mono text-[12.5px] leading-relaxed text-white"
                    >
                      <Check />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-7 border-t border-white/30 pt-6">
                <p className="font-mono text-[10px] tracking-[0.2em] text-white/75">
                  WHY IT&apos;S WORTH IT
                </p>
                <p className="mt-3 text-[15px] leading-relaxed text-white/95">
                  {card.worth}
                </p>
                {card.worthBold && (
                  <p className="mt-3 text-[15px] font-bold leading-relaxed text-white">
                    {card.worthBold}
                  </p>
                )}
              </div>

              <div className="mt-auto border-t border-white/30 pt-6">
                <p className="font-mono text-[10px] tracking-[0.2em] text-white/75">
                  {card.priceLabel}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-4">
                  <p className="text-5xl font-bold tabular-nums tracking-tight">
                    {card.price}
                  </p>
                  <span className="rounded bg-bg-dark px-3 py-1.5 font-mono text-[10px] tracking-[0.15em] text-white">
                    {card.seatChip}
                  </span>
                </div>
                <p className="mt-3 font-mono text-[12px] leading-relaxed text-white/80">
                  {card.priceSub}
                </p>

                <div className="mt-5">
                  {card.form ? (
                    <LeadForm source="one-on-one" cta={card.cta} tone="accent" />
                  ) : (
                    <a
                      href={checkoutUrl}
                      className="block w-full rounded-lg bg-bg-dark px-6 py-3.5 text-center font-bold text-white transition-colors hover:bg-black"
                    >
                      {card.cta}
                      <span className="ml-2">→</span>
                    </a>
                  )}
                </div>
                <p className="mt-3 font-mono text-[11px] tracking-[0.08em] text-white/80">
                  {card.ctaNote}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

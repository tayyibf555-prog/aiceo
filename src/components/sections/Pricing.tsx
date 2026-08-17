import Section from "@/components/Section";
import Kicker from "@/components/Kicker";
import Reveal from "@/components/Reveal";
import LeadForm from "@/components/LeadForm";
import { pricing, checkoutUrl } from "@/content/site";

/*
  Two cards in the site's featured-card language (see the ROI result
  panel): white, 2px accent border, accent-tinted hard offset shadow.
  Structure follows the reference: black badge chip, title, intro,
  inset WHAT YOU GET checklist, WHY IT'S WORTH IT, price + seat chip,
  full-width action. The 1-on-1 card's action is the live enquiry form.
*/
function Check() {
  return (
    <span
      aria-hidden
      className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center bg-accent font-mono text-[10px] leading-none text-accent-on"
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

      <div className="mt-12 grid items-stretch gap-8 lg:grid-cols-2">
        {pricing.cards.map((card, i) => (
          <Reveal key={card.id} delay={i * 100} className="h-full">
            <div className="flex h-full flex-col border-2 border-accent bg-bg p-7 shadow-[8px_8px_0_rgba(43,85,176,0.15)] md:p-8">
              <h3 className="text-3xl font-bold tracking-tight text-ink">
                {card.title}
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-body">
                {card.intro}
              </p>

              <div className="mt-6 border border-line bg-bg-subtle p-5">
                <p className="font-mono text-[10px] tracking-[0.2em] text-ink-muted">
                  WHAT YOU GET
                </p>
                <ul className="mt-4 space-y-3">
                  {card.whatYouGet.map((item) => (
                    <li
                      key={item}
                      className="flex gap-3 font-mono text-[12.5px] leading-relaxed text-ink-body"
                    >
                      <Check />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-7 border-t border-line pt-6">
                <p className="font-mono text-[10px] tracking-[0.2em] text-accent">
                  WHY IT&apos;S WORTH IT
                </p>
                <p className="mt-3 text-[15px] leading-relaxed text-ink-body">
                  {card.worth}
                </p>
                {card.worthBold && (
                  <p className="mt-3 text-[15px] font-bold leading-relaxed text-ink">
                    {card.worthBold}
                  </p>
                )}
              </div>

              <div className="mt-auto border-t border-line pt-6">
                <p className="font-mono text-[10px] tracking-[0.2em] text-accent">
                  {card.priceLabel}
                </p>
                {card.price && (
                  <div className="mt-2 flex flex-wrap items-center gap-4">
                    <p className="text-5xl font-bold tabular-nums tracking-tight text-ink">
                      {card.price}
                    </p>
                    {card.seatChip && (
                      <span className="bg-bg-dark px-3 py-1.5 font-mono text-[10px] tracking-[0.15em] text-white">
                        {card.seatChip}
                      </span>
                    )}
                  </div>
                )}
                <p className="mt-3 font-mono text-[12px] leading-relaxed text-ink-muted">
                  {card.priceSub}
                </p>

                <div className="mt-5">
                  {card.form ? (
                    <LeadForm source="one-on-one" cta={card.cta} />
                  ) : (
                    <a
                      href={checkoutUrl}
                      className="block w-full rounded-lg bg-accent px-6 py-3.5 text-center font-bold text-accent-on shadow-[3px_3px_0_rgba(10,10,10,0.9)] transition-all duration-150 hover:translate-x-[1px] hover:translate-y-[1px] hover:bg-accent-hover hover:shadow-[2px_2px_0_rgba(10,10,10,0.9)]"
                    >
                      {card.cta}
                      <span className="ml-2">→</span>
                    </a>
                  )}
                </div>
                <p className="mt-3 font-mono text-[11px] tracking-[0.08em] text-ink-muted">
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

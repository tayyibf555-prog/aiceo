import Section from "@/components/Section";
import Kicker from "@/components/Kicker";
import Reveal from "@/components/Reveal";
import Button from "@/components/Button";
import LeadForm from "@/components/LeadForm";
import { pricing, checkoutUrl } from "@/content/site";

export default function Pricing() {
  return (
    <Section id="pricing" className="py-20 md:py-28">
      <Kicker>{pricing.kicker}</Kicker>
      <h2 className="display-2 mt-4">{pricing.h2}</h2>
      <div className="mt-12 grid items-stretch gap-5 lg:grid-cols-3">
        {pricing.cards.map((card, i) => (
          <Reveal key={card.id} delay={i * 90} className="h-full">
            <div
              className={`relative flex h-full flex-col p-7 ${
                card.featured
                  ? "border-2 border-accent bg-bg shadow-[8px_8px_0_rgba(29,107,255,0.15)]"
                  : "border border-line bg-bg"
              }`}
            >
              {card.featured && (
                <span className="absolute -top-3 left-6 bg-accent px-2 py-0.5 font-mono text-[10px] tracking-[0.15em] text-accent-on">
                  COHORT 1
                </span>
              )}
              <p className="font-mono text-[11px] tracking-[0.15em] text-ink-muted">
                {card.meta}
              </p>
              <h3 className="mt-4 text-xl font-bold tracking-tight">
                {card.name}
              </h3>
              <p className="mt-2 text-4xl font-bold tabular-nums tracking-tight">
                {card.price}
              </p>
              <ul className="mt-6 flex-1 space-y-3">
                {card.features.map((f) => (
                  <li
                    key={f}
                    className="flex gap-2.5 text-[14px] leading-relaxed text-ink-body"
                  >
                    <span className="font-mono text-accent">›</span>
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                {card.id === "cohort" ? (
                  <Button
                    href={checkoutUrl}
                    variant="primary"
                    className="w-full text-center"
                  >
                    {card.ctaLabel}
                  </Button>
                ) : (
                  <LeadForm
                    source={card.id === "free" ? "free-brain" : "one-on-one"}
                    cta={card.ctaLabel}
                  />
                )}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

import Section from "@/components/Section";
import Kicker from "@/components/Kicker";
import Reveal from "@/components/Reveal";
import { systems } from "@/content/site";

export default function Systems() {
  return (
    <Section id="systems" grid className="py-20 md:py-28">
      <Kicker>{systems.kicker}</Kicker>
      <h2 className="display-2 mt-4 max-w-[24ch]">{systems.h2}</h2>
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {systems.cards.map((card, i) => (
          <Reveal key={card.name} delay={i * 80}>
            <div className="group h-full border border-line bg-bg p-6 transition-colors hover:border-accent">
              <div className="text-3xl">{card.icon}</div>
              <h3 className="mt-5 text-lg font-bold tracking-tight">
                {card.name}
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-body">
                {card.pain}
              </p>
              <div className="mt-5 h-px w-8 bg-line transition-all duration-300 group-hover:w-full group-hover:bg-accent" />
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

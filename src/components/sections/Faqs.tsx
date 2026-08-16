import Section from "@/components/Section";
import Kicker from "@/components/Kicker";
import Reveal from "@/components/Reveal";
import { faqs } from "@/content/site";

export default function Faqs() {
  return (
    <Section id="faqs" className="py-20 md:py-28">
      <div className="max-w-[75ch]">
        <Kicker>{faqs.kicker}</Kicker>
        <h2 className="display-2 mt-4">{faqs.h2}</h2>
        <Reveal className="mt-10">
          <div className="border-t border-line">
            {faqs.items.map((item) => (
              <details key={item.q} className="group border-b border-line">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-[17px] font-medium text-ink [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <span className="font-mono text-lg text-accent group-open:hidden">
                    +
                  </span>
                  <span className="hidden font-mono text-lg text-accent group-open:inline">
                    −
                  </span>
                </summary>
                <p className="max-w-[65ch] pb-6 text-[15px] leading-relaxed text-ink-body">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

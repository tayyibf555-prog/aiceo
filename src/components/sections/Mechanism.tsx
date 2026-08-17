import Section from "@/components/Section";
import Kicker from "@/components/Kicker";
import Reveal from "@/components/Reveal";
import Highlight from "@/components/Highlight";
import { mechanism } from "@/content/site";

export default function Mechanism() {
  return (
    <Section id="mechanism" className="py-20 md:py-28">
      <Kicker>{mechanism.kicker}</Kicker>
      <h2 className="display-2 mt-4">
        {mechanism.h2a}
        <br />
        <span className="text-ink-body">{mechanism.h2b}</span>
      </h2>
      <p className="mt-6 max-w-[58ch] text-lg leading-[1.55] text-ink-body">
        {mechanism.sub}
      </p>

      <div className="mt-12 grid gap-5 md:grid-cols-2">
        {mechanism.layers.map((layer, i) => (
          <Reveal key={layer.code} delay={i * 80}>
            <div className="h-full border border-line bg-bg p-7">
              <p className="font-mono text-[11px] tracking-[0.15em]">
                <span className="text-accent">{layer.code}</span>
                <span className="ml-3 text-ink-muted">{layer.tag}</span>
              </p>
              <h3 className="mt-4 text-xl font-bold tracking-tight">
                {layer.name}
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-body">
                <strong className="text-ink">{layer.lead}</strong> {layer.text}
              </p>
              <p className="mt-5 border-t border-line pt-4 font-mono text-[12px] leading-relaxed text-ink-muted">
                <span className="text-ink-body">Example:</span> {layer.example}
              </p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={120}>
        <p className="mt-10 max-w-[70ch] text-lg leading-[1.6] text-ink-body">
          <strong className="text-ink">{mechanism.close.bold}</strong>
          {mechanism.close.rest}
          <Highlight>{mechanism.close.hl}</Highlight>
          {mechanism.close.tail}
        </p>
      </Reveal>
    </Section>
  );
}

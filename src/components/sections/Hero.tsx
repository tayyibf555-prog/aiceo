import Section from "@/components/Section";
import Kicker from "@/components/Kicker";
import Button from "@/components/Button";
import Highlight from "@/components/Highlight";
import LogoHalftone from "@/components/LogoHalftone";
import HeroIntro from "@/components/fx/HeroIntro";
import { hero } from "@/content/site";

export default function Hero() {
  return (
    <Section
      id="hero"
      className="flex min-h-[calc(100dvh-150px)] items-center py-16 md:py-20"
    >
      <div className="grid items-center gap-14 md:grid-cols-[1.15fr_1fr]">
        <HeroIntro>
          <div data-hero>
            <Kicker glyph="●">{hero.badge}</Kicker>
          </div>
          <h1 data-hero className="display-1 mt-6">
            {hero.h1[0]}
            <br />
            <span className="text-accent">{hero.h1[1]}</span>
          </h1>
          <p
            data-hero
            className="mt-7 max-w-[56ch] text-lg leading-[1.55] text-ink-body"
          >
            {hero.sub.map((run, i) =>
              run.h ? (
                <Highlight key={i} variant={run.h}>
                  {run.t}
                </Highlight>
              ) : (
                <span key={i}>{run.t}</span>
              )
            )}
          </p>
          <div data-hero className="mt-9 flex flex-wrap gap-3">
            <Button href={hero.primary.href}>{hero.primary.label}</Button>
            <Button href={hero.secondary.href} variant="secondary" arrow="↓">
              {hero.secondary.label}
            </Button>
          </div>
        </HeroIntro>
        <LogoHalftone />
      </div>
    </Section>
  );
}

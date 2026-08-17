import Section from "@/components/Section";
import Kicker from "@/components/Kicker";
import { people } from "@/content/site";

/*
  Testimonial wall: an infinite CSS marquee (paused on hover, disabled
  under reduced motion). Cards are placeholders until real faces and
  clips land; the track is duplicated once for the seamless loop.
*/
function WallCard({ name }: { name: string }) {
  return (
    <figure className="relative h-[240px] w-[190px] shrink-0 border border-line bg-bg">
      <div className="absolute inset-0 grid place-items-center border-b border-dashed border-line">
        <span
          aria-hidden
          className="grid h-11 w-11 place-items-center rounded-full border border-line-strong font-mono text-[13px] text-ink-muted"
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

export default function People() {
  return (
    <Section id="people" container={false} className="overflow-hidden py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <Kicker>{people.kicker}</Kicker>
        <h2 className="display-2 mt-4">{people.h2}</h2>
        <p className="mt-4 max-w-[52ch] text-lg leading-[1.55] text-ink-body">
          {people.sub}
        </p>
      </div>

      <div className="marquee mt-10 [mask-image:linear-gradient(90deg,transparent,black_6%,black_94%,transparent)]">
        <div className="marquee-track gap-5 pr-5">
          {[...people.cards, ...people.cards].map((card, i) => (
            <WallCard key={`${card.name}-${i}`} name={card.name} />
          ))}
        </div>
      </div>
    </Section>
  );
}

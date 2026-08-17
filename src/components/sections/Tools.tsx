"use client";

/*
  Horizontal belt of tool windows. Screens are placeholders until the
  user supplies real captures; each frame keeps the mono window chrome
  so swapping in images later is a one-line change per card.
*/
import { useRef } from "react";
import Section from "@/components/Section";
import Kicker from "@/components/Kicker";
import { tools, type SectionId } from "@/content/site";

export default function Tools() {
  const beltRef = useRef<HTMLDivElement>(null);
  const nudge = (dir: 1 | -1) =>
    beltRef.current?.scrollBy({ left: dir * 460, behavior: "smooth" });

  return (
    // Parked section: "tools" left out of the sections array until real
    // screenshots land, so the id is cast for the interim.
    <Section id={"tools" as SectionId} className="py-20 md:py-28">
      <Kicker>{tools.kicker}</Kicker>
      <h2 className="display-2 mt-4 max-w-[24ch]">{tools.h2}</h2>
      <p className="mt-5 max-w-[58ch] text-lg leading-[1.55] text-ink-body">
        {tools.sub}
      </p>

      <div
        ref={beltRef}
        className="mt-10 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {tools.items.map((tool, i) => (
          <figure
            key={tool.name}
            className="w-[min(86vw,460px)] shrink-0 snap-start"
          >
            <div className="flex items-baseline justify-between font-mono text-[12px]">
              <span className="font-bold text-ink">
                {tool.name}
                <span className="text-accent">.</span>
              </span>
              <span className="text-ink-muted">
                {String(i + 1).padStart(2, "0")} / {String(tools.items.length).padStart(2, "0")}
              </span>
            </div>
            <div className="mt-3 overflow-hidden border border-line bg-bg">
              <div className="flex items-center gap-1.5 border-b border-line px-3 py-2">
                <span aria-hidden className="h-2 w-2 rounded-full bg-line-strong" />
                <span aria-hidden className="h-2 w-2 rounded-full bg-line-strong" />
                <span aria-hidden className="h-2 w-2 rounded-full bg-accent" />
                <span className="ml-2 font-mono text-[10px] tracking-[0.12em] text-ink-muted">
                  {tool.tag.toUpperCase()}
                </span>
              </div>
              <div className="grid aspect-[16/10] place-items-center border-b-0 border-dashed">
                <p className="border border-dashed border-line-strong px-4 py-2 font-mono text-[10px] tracking-[0.18em] text-ink-muted">
                  {tools.placeholder}
                </p>
              </div>
            </div>
          </figure>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="font-mono text-[11px] tracking-[0.18em] text-ink-muted">
          {tools.belt}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => nudge(-1)}
            aria-label="Previous tool"
            className="grid h-10 w-10 place-items-center border border-line bg-bg font-mono text-ink transition-colors hover:border-accent hover:text-accent"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => nudge(1)}
            aria-label="Next tool"
            className="grid h-10 w-10 place-items-center border border-line bg-bg font-mono text-ink transition-colors hover:border-accent hover:text-accent"
          >
            →
          </button>
        </div>
      </div>
    </Section>
  );
}

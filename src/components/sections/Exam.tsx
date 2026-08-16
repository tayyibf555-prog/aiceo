import Section from "@/components/Section";
import Kicker from "@/components/Kicker";
import Reveal from "@/components/Reveal";
import { exam } from "@/content/site";

export default function Exam() {
  return (
    <Section id="exam" className="bg-bg-dark py-20 text-bg md:py-28">
      <div className="grid items-center gap-12 md:grid-cols-[auto_1fr] md:gap-20">
        <Reveal>
          <div className="border border-white/15 px-10 py-12 text-center md:px-14">
            <p className="font-mono text-[11px] tracking-[0.2em] text-neutral-400">
              PASS MARK
            </p>
            <p className="display-1 mt-3 text-accent" style={{ fontSize: "clamp(64px,9vw,110px)" }}>
              {exam.score}
            </p>
            <p className="mt-3 font-mono text-[11px] tracking-[0.2em] text-neutral-400">
              MARKED BY YOU
            </p>
          </div>
        </Reveal>
        <div>
          <Kicker>{exam.kicker}</Kicker>
          <h2 className="display-2 mt-4 max-w-[22ch] text-bg">{exam.h2}</h2>
          <p className="mt-6 max-w-[58ch] text-lg leading-[1.55] text-neutral-400">
            {exam.body}
          </p>
          <p className="mt-5 max-w-[58ch] text-lg font-medium leading-[1.7]">
            <span className="rounded bg-accent box-decoration-clone px-1.5 py-0.5 text-accent-on">
              {exam.guarantee}
            </span>
          </p>
          <p className="mt-5 font-mono text-[12px] tracking-[0.08em] text-neutral-500">
            {exam.close}
          </p>
        </div>
      </div>
    </Section>
  );
}

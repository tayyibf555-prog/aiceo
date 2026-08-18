import type { Metadata } from "next";
import Image from "next/image";
import logo from "../../../public/brand/logo-lockup-clean.png";
import inviteShot from "../../../public/thank-you/invite-accept.webp";
import joinShot from "../../../public/thank-you/join-hq.webp";
import Kicker from "@/components/Kicker";
import Button from "@/components/Button";
import { thankYou, footer } from "@/content/site";

/*
  The page a buyer lands on straight after paying. Linked from the
  payment redirect only: no nav, no index, three numbered steps in the
  site's card language. Video slots are placeholder frames until the
  real links land; the screenshots are our own mock renders.
*/
export const metadata: Metadata = {
  title: "You're in · The AI CEO",
  robots: { index: false, follow: false },
};

function VideoFrame({
  video,
}: {
  video: { tag: string; title: string; length: string };
}) {
  return (
    <figure className="border border-line bg-bg-dark shadow-[4px_4px_0_rgba(43,85,176,0.12)]">
      <div className="relative grid aspect-video place-items-center">
        <span
          aria-hidden
          className="grid h-14 w-14 place-items-center rounded-full bg-accent text-xl text-accent-on shadow-[3px_3px_0_rgba(10,10,10,0.9)]"
        >
          ▶
        </span>
        <span className="absolute left-3 top-3 bg-accent px-2 py-1 font-mono text-[10px] tracking-[0.15em] text-accent-on">
          {video.tag}
        </span>
        <span className="absolute bottom-3 right-3 font-mono text-[11px] tracking-[0.1em] text-white/80">
          {video.length}
        </span>
      </div>
      <figcaption className="border-t border-white/10 px-4 py-3 font-mono text-[11px] tracking-[0.12em] text-neutral-300">
        {video.title.toUpperCase()}
      </figcaption>
    </figure>
  );
}

export default function ThankYouPage() {
  const [watch, invites, hq] = thankYou.steps;
  return (
    <>
      {/* slim header: logo home, one way back */}
      <header className="border-b border-line bg-bg">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <a href="/" aria-label="The AI CEO home">
            <Image src={logo} alt="AI CEO" priority className="h-9 w-auto" />
          </a>
          <a
            href="/"
            className="font-mono text-[11px] tracking-[0.15em] text-ink-muted transition-colors hover:text-accent"
          >
            ← {thankYou.backLink}
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 pb-24 pt-14 md:pt-20">
        <Kicker>{thankYou.kicker}</Kicker>
        <h1 className="display-1 mt-4">{thankYou.h1}</h1>
        <p className="mt-5 max-w-[56ch] text-lg leading-[1.55] text-ink-body">
          {thankYou.sub}
        </p>

        <div className="mt-14 space-y-10">
          {/* STEP 01 · the two videos */}
          <section className="border border-line bg-bg p-6 shadow-[4px_4px_0_rgba(43,85,176,0.12)] md:p-8">
            <p className="font-mono text-[11px] tracking-[0.2em] text-accent">
              {watch.code}
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight">
              {watch.title}
            </h2>
            <p className="mt-3 max-w-[62ch] text-[15px] leading-relaxed text-ink-body">
              {watch.body}
            </p>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {watch.videos!.map((v) => (
                <VideoFrame key={v.tag} video={v} />
              ))}
            </div>
          </section>

          {/* STEP 02 · accept the invites */}
          <section className="border border-line bg-bg p-6 shadow-[4px_4px_0_rgba(43,85,176,0.12)] md:p-8">
            <p className="font-mono text-[11px] tracking-[0.2em] text-accent">
              {invites.code}
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight">
              {invites.title}
            </h2>
            <p className="mt-3 max-w-[62ch] text-[15px] leading-relaxed text-ink-body">
              {invites.body}
            </p>
            <figure className="mt-6 overflow-hidden border border-line">
              <Image
                src={inviteShot}
                alt="A Gmail message with the S01 session invite: Google Meet details and the Yes button selected"
                className="w-full"
                sizes="(max-width: 896px) 100vw, 832px"
              />
              <figcaption className="border-t border-line bg-bg-subtle px-4 py-2.5 font-mono text-[11px] tracking-[0.1em] text-ink-muted">
                {invites.caption}
              </figcaption>
            </figure>
          </section>

          {/* STEP 03 · join the HQ */}
          <section className="border-2 border-accent bg-bg p-6 shadow-[8px_8px_0_rgba(43,85,176,0.15)] md:p-8">
            <p className="font-mono text-[11px] tracking-[0.2em] text-accent">
              {hq.code}
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight">
              {hq.title}
            </h2>
            <p className="mt-3 max-w-[62ch] text-[15px] leading-relaxed text-ink-body">
              {hq.body}
            </p>
            <div className="mt-5">
              <Button href={hq.href!}>{hq.cta}</Button>
            </div>
            <figure className="mt-6 overflow-hidden border border-line">
              <Image
                src={joinShot}
                alt="The welcome email opened in Gmail with the join button, and a preview of the cohort HQ channels, timeline and recordings"
                className="w-full"
                sizes="(max-width: 896px) 100vw, 832px"
              />
              <figcaption className="border-t border-line bg-bg-subtle px-4 py-2.5 font-mono text-[11px] tracking-[0.1em] text-ink-muted">
                {hq.caption}
              </figcaption>
            </figure>
          </section>
        </div>

        {/* closing */}
        <div className="mt-14 border-t border-line pt-8">
          <p className="text-lg font-bold text-ink">{thankYou.closing.line}</p>
          <p className="mt-2 font-mono text-[12px] tracking-[0.08em] text-ink-muted">
            {thankYou.closing.note.toUpperCase()}
          </p>
        </div>
      </main>

      <footer className="border-t border-line py-8">
        <p className="mx-auto max-w-4xl px-6 font-mono text-[11px] tracking-[0.15em] text-ink-muted">
          {footer.company.toUpperCase()} · {footer.year}
        </p>
      </footer>
    </>
  );
}

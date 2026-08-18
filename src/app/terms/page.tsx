import type { Metadata } from "next";

/*
  Plain-English terms. The refund rule (full refund before the first
  live session, committed after) was drafted by us and needs the
  owner's sign-off before it is treated as final.
*/
export const metadata: Metadata = {
  title: "Terms · The AI CEO",
};

const SECTIONS: { h: string; p: string[] }[] = [
  {
    h: "Who we are",
    p: [
      "The AI CEO is a programme run by Azen AI Ltd. These terms cover buying a seat on the cohort, and consulting engagements agreed with us directly.",
    ],
  },
  {
    h: "What you are buying",
    p: [
      "A cohort seat includes the eight live sessions, the session recordings, the cohort HQ, and the working files and systems built during the four weeks. Consulting engagements are scoped and agreed in writing before any work starts.",
    ],
  },
  {
    h: "Payment",
    p: [
      "Cohort seats are paid in full at checkout through our payment provider. We never see or store your card details. Prices are in US dollars unless stated otherwise.",
    ],
  },
  {
    h: "Refunds",
    p: [
      "Cancel any time before the first live session of your cohort for a full refund: one email is enough. From the first session onward your seat is committed and the fee is non-refundable, because seats are limited and each one shapes the room.",
      "If you cannot attend, you may transfer your seat to one named person in your business before the first session.",
    ],
  },
  {
    h: "Your files, your systems",
    p: [
      "Everything built on your business during the programme is yours: the files, the prompts, the configurations. Our course materials, templates and recordings remain ours and are for your business use, not for resale or redistribution.",
    ],
  },
  {
    h: "No earnings promises",
    p: [
      "We show real systems and real numbers from real businesses, and we build working systems with you. We do not promise revenue outcomes. Results depend on your business, your market and what you do with what we build.",
    ],
  },
  {
    h: "Liability",
    p: [
      "To the extent the law allows, our total liability under these terms is capped at the amount you paid us. Nothing in these terms limits liability that cannot lawfully be limited.",
    ],
  },
  {
    h: "The boring but true",
    p: [
      "These terms are governed by the law of England and Wales. If a term proves unenforceable, the rest still stand. Questions to cohort@azen.io.",
    ],
  },
];

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 pb-24 pt-16">
      <p className="font-mono text-[11px] tracking-[0.2em] text-accent">
        THE AI CEO · TERMS
      </p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight">
        Terms of purchase.
      </h1>
      <p className="mt-3 font-mono text-[11px] tracking-[0.1em] text-ink-muted">
        AZEN AI LTD · LAST UPDATED 18 AUGUST 2026
      </p>
      <div className="mt-10 space-y-8">
        {SECTIONS.map((s) => (
          <section key={s.h}>
            <h2 className="text-[17px] font-bold tracking-tight">{s.h}</h2>
            {s.p.map((t) => (
              <p
                key={t.slice(0, 24)}
                className="mt-2 text-[14.5px] leading-relaxed text-ink-body"
              >
                {t}
              </p>
            ))}
          </section>
        ))}
      </div>
      <p className="mt-12 border-t border-line pt-6 font-mono text-[11px] tracking-[0.1em] text-ink-muted">
        <a href="/" className="transition-colors hover:text-accent">
          ← BACK TO THE SITE
        </a>
      </p>
    </main>
  );
}

import type { Metadata } from "next";

/* Plain-English privacy notice for the lead form, checkout and
   cookieless analytics. */
export const metadata: Metadata = {
  title: "Privacy · The AI CEO",
};

const SECTIONS: { h: string; p: string[] }[] = [
  {
    h: "What we collect",
    p: [
      "When you join the list or enquire about working with us, we collect your name and email address, plus the page it came from. That is the lot. Payments are handled by our checkout provider; your card details never touch our systems.",
    ],
  },
  {
    h: "What we use it for",
    p: [
      "To send you the things you asked for: cohort details, seat openings, and replies to your enquiry. No third-party marketing, no selling your data, no list-swapping. Ever.",
    ],
  },
  {
    h: "Where it lives",
    p: [
      "Lead details are stored securely with our database provider and are only accessible to us. The site is hosted on infrastructure that keeps standard server logs.",
    ],
  },
  {
    h: "Analytics",
    p: [
      "We measure page visits and clicks with cookieless, aggregate analytics so we can see what works. It does not identify you, follow you across the web, or set tracking cookies.",
    ],
  },
  {
    h: "How long we keep it",
    p: [
      "Until you ask us not to, or until it is clearly no longer needed. Unsubscribing from an email removes you from future sends.",
    ],
  },
  {
    h: "Your rights",
    p: [
      "You can ask what we hold about you, ask for a copy, ask us to correct it, or ask us to delete it. One email to cohort@azen.io does it, and we answer within a month, usually much faster.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 pb-24 pt-16">
      <p className="font-mono text-[11px] tracking-[0.2em] text-accent">
        THE AI CEO · PRIVACY
      </p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight">
        Privacy, plainly.
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

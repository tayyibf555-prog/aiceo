/* Temporary token specimen — replaced by the real page in Phase 2. */
export default function Home() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-24">
      <p className="kicker-text text-ink-muted">
        <span className="text-accent">›</span> TOKEN SPECIMEN · PHASE 0
      </p>
      <h1 className="display-1 mt-6">
        Run your business
        <br />
        <span className="text-accent">like an AI CEO.</span>
      </h1>
      <p className="mt-6 max-w-[60ch] text-lg leading-[1.55] text-ink-body">
        Body copy at 18px on ink-body. A key phrase gets an{" "}
        <span className="rounded bg-accent-soft px-1">accent-soft pill</span>{" "}
        and another a{" "}
        <span className="border-b-2 border-dotted border-accent">
          dotted underline
        </span>
        .
      </p>
      <div className="mt-8 flex gap-3">
        <a
          href="#"
          className="rounded-lg bg-accent px-6 py-3 font-bold text-accent-on shadow-[3px_3px_0_rgba(10,10,10,0.9)] hover:bg-accent-hover"
        >
          Get the free brain →
        </a>
        <a
          href="#"
          className="rounded-lg border border-line bg-bg px-6 py-3 font-bold text-ink"
        >
          See the office ↓
        </a>
      </div>
      <div className="mt-10 rounded-2xl bg-bg-dark p-5 font-mono text-xs text-ink-muted">
        <span className="live-dot mr-2 inline-block h-2 w-2 rounded-full bg-accent" />
        THE OFFICE · SECOND BRAIN · LIVE
        <span className="hud-cursor ml-2 inline-block h-3 w-[7px] bg-accent align-middle" />
      </div>
    </main>
  );
}

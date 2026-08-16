import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center bg-bg px-6">
      <div className="text-center">
        <p className="font-mono text-[12px] tracking-[0.18em] text-ink-muted">
          <span className="text-accent">▶</span> exec 404_lost.render
          <span className="hud-cursor ml-2 inline-block h-[13px] w-[7px] bg-accent align-middle" />
        </p>
        <h1 className="display-2 mt-6">This page is not in the brain.</h1>
        <p className="mt-4 text-lg text-ink-body">
          Whatever was here, nobody loaded it in.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-lg bg-accent px-6 py-3 font-bold text-accent-on shadow-[3px_3px_0_rgba(10,10,10,0.9)] transition-all duration-150 hover:translate-x-[1px] hover:translate-y-[1px] hover:bg-accent-hover"
        >
          Back to the office <span className="ml-2">→</span>
        </Link>
      </div>
    </main>
  );
}

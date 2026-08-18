"use client";

/*
  React chrome around the office renderer: mono header, right rail fed
  from the SAME JSON as the scene, footer terminal line, fullscreen
  dialog re-rendering the same component. Styled in the site's card
  language: white panel, accent border, hard blue offset shadow.

  The heavy three.js engine (office3d) is loaded lazily when the
  section approaches the viewport; machines without WebGL get the
  vanilla SVG engine (office) instead. Both share one contract.
*/
import { useEffect, useRef, useState } from "react";
import { DEMO_STATE } from "@/office/demoState";
import "@/office/office.css";

type OfficeApi = {
  destroy: () => void;
  focusRoom: (id: string) => void;
  zoomOut: () => void;
  playReveal?: () => void;
};
type RenderFn = (
  host: HTMLElement,
  state: typeof DEMO_STATE,
  opts: { onSelect?: (id: string | null) => void }
) => OfficeApi | null;

/* What lives in each system: shown only when a zone is opened, with a
   search over all of it otherwise. Example-office data, same voice as
   site copy. */
const INVENTORY = [
  {
    id: "boardroom",
    room: "Boardroom",
    sys: "The Second Brain",
    week: "WK 1",
    role: "Answers with what the business knows",
    files: [
      "offer.md",
      "price-list.md",
      "promises.md",
      "voice-and-tone.md",
      "clients/march-notes.md",
      "way-we-work.md",
    ],
    tasks: ["Read every new file", "Answer the team's questions"],
    tools: ["FILES", "NOTES", "INBOX"],
  },
  {
    id: "reception",
    room: "Reception",
    sys: "Speed to Lead",
    week: "WK 2",
    role: "Replies to every enquiry in minutes",
    files: ["reply-templates.md", "pricing-rules.md", "booking-slots.md", "enquiries.log"],
    tasks: ["Reply in your voice, price attached", "Offer two slots, book it in"],
    tools: ["WHATSAPP", "EMAIL", "CALENDAR"],
  },
  {
    id: "archive",
    room: "Archive",
    sys: "Reactivation",
    week: "WK 3",
    role: "Wakes the clients who drifted",
    files: ["old-client-list.csv", "win-back-messages.md", "do-not-contact.md", "replies.log"],
    tasks: ["Message the dormant list properly", "Book the ones still interested"],
    tools: ["OLD LIST", "SMS", "EMAIL"],
  },
  {
    id: "corner",
    room: "Corner Office",
    sys: "The AI CEO",
    week: "WK 4",
    role: "Runs all three, hands you one decision",
    files: ["today.md", "what-ran-overnight.md", "needs-you.md", "numbers.md"],
    tasks: ["Decide what runs when", "Flag the one thing needing you"],
    tools: ["BRAIN", "LEADS", "LIST"],
  },
];

type SearchHit = {
  label: string;
  kind: string;
  zone: (typeof INVENTORY)[number];
};

/* Prefer the 3D engine; fall back to the SVG one without WebGL. */
async function loadRenderer(): Promise<RenderFn> {
  const canWebgl = (() => {
    try {
      const c = document.createElement("canvas");
      return !!(c.getContext("webgl2") || c.getContext("webgl"));
    } catch {
      return false;
    }
  })();
  if (canWebgl) {
    try {
      const m = (await import("@/office/office3d")) as { renderOffice: RenderFn };
      return m.renderOffice;
    } catch {
      /* fall through to the SVG engine */
    }
  }
  const m = (await import("@/office/office")) as { renderOffice: RenderFn };
  return m.renderOffice;
}

export default function OfficeScene() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const fullRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const apiRef = useRef<OfficeApi | null>(null);
  const fullApiRef = useRef<OfficeApi | null>(null);
  const renderFnRef = useRef<RenderFn | null>(null);
  const [ready, setReady] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [query, setQuery] = useState("");

  /* load the engine when the section approaches the viewport */
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    let cancelled = false;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
        void loadRenderer().then((fn) => {
          if (cancelled) return;
          renderFnRef.current = fn;
          setReady(true);
        });
      },
      { rootMargin: "600px" }
    );
    io.observe(wrap);
    return () => {
      cancelled = true;
      io.disconnect();
    };
  }, []);

  useEffect(() => {
    const fn = renderFnRef.current;
    if (!ready || !fn || !sceneRef.current) return;
    let api = fn(sceneRef.current, DEMO_STATE, { onSelect: setSelected });
    if (!api) {
      /* WebGL context refused at construction: use the SVG engine */
      void import("@/office/office").then((m) => {
        if (sceneRef.current) {
          renderFnRef.current = m.renderOffice as RenderFn;
          api = (m.renderOffice as RenderFn)(sceneRef.current, DEMO_STATE, {
            onSelect: setSelected,
          });
          apiRef.current = api;
        }
      });
    }
    apiRef.current = api;
    return () => apiRef.current?.destroy();
  }, [ready]);

  useEffect(() => {
    const fn = renderFnRef.current;
    if (dialogOpen && fullRef.current && fn) {
      fullApiRef.current = fn(fullRef.current, DEMO_STATE, {});
      return () => fullApiRef.current?.destroy();
    }
  }, [dialogOpen]);

  const openFull = () => {
    setDialogOpen(true);
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => dialogRef.current?.showModal());
  };
  const onClosed = () => {
    setDialogOpen(false);
    document.body.style.overflow = "";
  };

  const railClick = (id: string) => {
    if (selected === id) {
      apiRef.current?.zoomOut();
      setSelected(null);
    } else {
      apiRef.current?.focusRoom(id);
      setSelected(id);
    }
  };

  const sel = INVENTORY.find((z) => z.id === selected) ?? null;
  const q = query.trim().toLowerCase();
  const results: SearchHit[] = q
    ? INVENTORY.flatMap((zone): SearchHit[] => [
        { label: zone.sys, kind: "SYSTEM", zone },
        { label: zone.role, kind: "AGENT", zone },
        ...zone.files.map((f) => ({ label: f, kind: "FILE", zone })),
        ...zone.tasks.map((t) => ({ label: t, kind: "TASK", zone })),
        ...zone.tools.map((t) => ({ label: t, kind: "TOOL", zone })),
      ])
        .filter((r) => r.label.toLowerCase().includes(q))
        .slice(0, 9)
    : [];

  const openFromSearch = (id: string) => {
    setQuery("");
    apiRef.current?.focusRoom(id);
    setSelected(id);
  };

  return (
    <figure className="m-0" ref={wrapRef}>
      <div className="overflow-hidden border-2 border-accent bg-bg shadow-[8px_8px_0_rgba(43,85,176,0.15)]">
        {/* header */}
        <div className="flex items-center justify-between gap-4 border-b border-line px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.15em] text-ink-body">
          <span className="flex min-w-0 items-center gap-2.5">
            <span
              aria-hidden
              className="live-dot h-2 w-2 shrink-0 rounded-full bg-accent"
            />
            <span className="truncate">
              THE OFFICE · {DEMO_STATE.business} · LIVE
            </span>
          </span>
          <span className="flex shrink-0 items-center gap-3">
            <span className="hidden text-ink-muted md:inline">tap a zone</span>
            <button
              type="button"
              onClick={openFull}
              className="border border-line px-2.5 py-1 font-mono text-[10px] tracking-[0.14em] text-ink-body transition-colors hover:border-accent hover:text-accent"
            >
              ⤢ FULLSCREEN
            </button>
          </span>
        </div>

        {/* scene + rail */}
        <div className="grid lg:grid-cols-[1fr_240px]">
          <div className="relative min-w-0">
            <div ref={sceneRef} className="min-w-0" />
            {!ready && (
              <div
                aria-hidden
                className="grid aspect-[1.66] w-full place-items-center"
              >
                <span className="font-mono text-[11px] tracking-[0.2em] text-ink-muted">
                  ▶ RENDERING THE OFFICE…
                </span>
              </div>
            )}
          </div>
          <aside className="flex flex-col border-t border-line lg:border-l lg:border-t-0">
            {sel ? (
              /* an open section: everything filed inside it */
              <div className="flex min-h-0 flex-1 flex-col">
                <div className="flex items-center gap-2.5 border-b border-line bg-accent-soft px-4 py-3">
                  <span aria-hidden className="h-[7px] w-[7px] bg-accent" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-semibold text-ink">
                      {sel.sys}
                    </span>
                    <span className="block font-mono text-[9.5px] tracking-[0.1em] text-ink-muted">
                      {sel.room.toUpperCase()} · {sel.week}
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() => railClick(sel.id)}
                    aria-label={`Close ${sel.sys}`}
                    className="border border-line px-1.5 py-0.5 font-mono text-[10px] text-ink-body transition-colors hover:border-accent hover:text-accent"
                  >
                    ✕
                  </button>
                </div>
                <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4">
                  <p className="font-mono text-[10.5px] leading-relaxed text-ink-body">
                    <span className="tracking-[0.1em] text-accent">AGENT</span>{" "}
                    {sel.role}
                  </p>
                  <div>
                    <p className="font-mono text-[9px] tracking-[0.18em] text-ink-muted">
                      FILED HERE
                    </p>
                    <ul className="mt-1.5 space-y-1">
                      {sel.files.map((f) => (
                        <li
                          key={f}
                          className="flex items-center gap-2 font-mono text-[10.5px] text-ink-body"
                        >
                          <span aria-hidden className="text-ink-muted">
                            ▤
                          </span>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="font-mono text-[9px] tracking-[0.18em] text-ink-muted">
                      RUNS
                    </p>
                    <ul className="mt-1.5 space-y-1">
                      {sel.tasks.map((t) => (
                        <li
                          key={t}
                          className="flex gap-2 font-mono text-[10.5px] leading-snug text-ink-body"
                        >
                          <span aria-hidden className="text-accent">
                            ▸
                          </span>
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="font-mono text-[9px] tracking-[0.18em] text-ink-muted">
                      PLUGGED IN
                    </p>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {sel.tools.map((t) => (
                        <span
                          key={t}
                          className="border border-line px-1.5 py-0.5 font-mono text-[9px] tracking-[0.12em] text-ink-muted"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* nothing open: a quiet search over everything filed */
              <div className="flex flex-1 flex-col px-4 py-4">
                <label className="block">
                  <span className="sr-only">Search the office</span>
                  <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search the office…"
                    className="w-full border border-accent bg-bg px-3 py-2.5 font-mono text-[12px] text-ink caret-accent shadow-[3px_3px_0_rgba(43,85,176,0.12)] placeholder:text-accent/70 focus:outline-none focus:shadow-[4px_4px_0_rgba(43,85,176,0.18)]"
                  />
                </label>
                {q ? (
                  results.length ? (
                    <ul className="mt-3 space-y-1">
                      {results.map((r, i) => (
                        <li key={`${r.zone.id}-${r.kind}-${i}`}>
                          <button
                            type="button"
                            onClick={() => openFromSearch(r.zone.id)}
                            className="flex w-full items-baseline gap-2 border border-transparent px-2 py-1.5 text-left transition-colors hover:border-line-strong"
                          >
                            <span className="w-12 shrink-0 font-mono text-[8.5px] tracking-[0.1em] text-accent">
                              {r.kind}
                            </span>
                            <span className="min-w-0 flex-1 truncate font-mono text-[11px] text-ink-body">
                              {r.label}
                            </span>
                            <span className="shrink-0 font-mono text-[8.5px] tracking-[0.08em] text-ink-muted">
                              {r.zone.room.toUpperCase()}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-4 font-mono text-[10.5px] tracking-[0.06em] text-ink-muted">
                      Nothing filed under that. Yet.
                    </p>
                  )
                ) : (
                  <p className="mt-4 font-mono text-[10.5px] leading-relaxed text-ink-muted">
                    Tap a zone on the floor to open everything inside it, or
                    search: try &quot;prices&quot;, &quot;old list&quot;,
                    &quot;whatsapp&quot;.
                  </p>
                )}
                <p className="mt-auto pt-4 font-mono text-[9.5px] tracking-[0.14em] text-ink-muted">
                  + THE CORRIDOR · 12 DOORS · LOCKED
                </p>
              </div>
            )}
          </aside>
        </div>

        {/* footer terminal line */}
        <div className="border-t border-line px-4 py-2 font-mono text-[10px] tracking-[0.12em] text-ink-muted">
          $ AICEO RENDER --CLIENT EXAMPLE
          <span className="os-cursor ml-1 inline-block h-[10px] w-[5px] bg-accent align-middle" />
        </div>
      </div>

      <figcaption className="mt-3 font-mono text-[12px] leading-relaxed text-ink-muted">
        This is a real one, running. The named workers are your systems on
        shift. The locked doors are what we build next.
      </figcaption>

      {/* fullscreen */}
      <dialog
        ref={dialogRef}
        onClose={onClosed}
        className="fixed inset-0 m-0 h-[100dvh] max-h-none w-screen max-w-none bg-bg p-0 backdrop:bg-black/50 [overscroll-behavior:contain]"
      >
        {dialogOpen && (
          <div className="relative grid h-full w-full place-items-center p-4">
            <div ref={fullRef} className="w-full max-w-6xl" />
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              className="absolute right-4 top-4 border border-line-strong bg-bg px-3 py-2 font-mono text-[11px] tracking-[0.14em] text-ink transition-colors hover:border-accent hover:text-accent"
            >
              ✕ CLOSE
            </button>
          </div>
        )}
      </dialog>
    </figure>
  );
}

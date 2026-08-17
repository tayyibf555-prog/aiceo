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

const RAIL = [
  { id: "boardroom", name: "Boardroom", sub: "The Second Brain · wk 1" },
  { id: "reception", name: "Reception", sub: "Speed to Lead · wk 2" },
  { id: "archive", name: "Archive", sub: "Reactivation · wk 3" },
  { id: "corner", name: "Corner Office", sub: "The AI CEO OS · wk 4" },
  { id: "corridor", name: "The Corridor", sub: "12 doors · locked" },
];

function roomCount(id: string): string {
  if (id === "corridor") return "0/12";
  const rs = DEMO_STATE.rooms[id as keyof typeof DEMO_STATE.rooms];
  return rs?.state === "lit" ? "4/4" : "0/4";
}

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
    if (id === "corridor") return;
    if (selected === id) {
      apiRef.current?.zoomOut();
      setSelected(null);
    } else {
      apiRef.current?.focusRoom(id);
      setSelected(id);
    }
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
          <aside className="border-t border-line px-4 py-4 lg:border-l lg:border-t-0">
            <p className="font-mono text-[10px] tracking-[0.18em] text-ink-muted">
              FLOOR DIRECTORY
            </p>
            <ul className="mt-3 space-y-1.5">
              {RAIL.map((room) => {
                const active = selected === room.id;
                const count = roomCount(room.id);
                const lit = count.startsWith("4");
                return (
                  <li key={room.id}>
                    <button
                      type="button"
                      onClick={() => railClick(room.id)}
                      className={`grid w-full grid-cols-[10px_1fr_auto] items-baseline gap-2.5 border px-2.5 py-2 text-left transition-colors ${
                        active
                          ? "border-accent bg-accent-soft"
                          : "border-transparent hover:border-line-strong"
                      }`}
                    >
                      <span
                        aria-hidden
                        className={`h-[7px] w-[7px] self-center ${
                          lit ? "bg-accent" : "border border-line-strong"
                        }`}
                      />
                      <span className="min-w-0">
                        <span className="block truncate text-[13px] font-semibold text-ink">
                          {room.name}
                        </span>
                        <span className="block truncate font-mono text-[10px] tracking-[0.08em] text-ink-muted">
                          {room.sub}
                        </span>
                      </span>
                      <span className="font-mono text-[11px] tabular-nums text-ink-body">
                        {count}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
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

"use client";

/*
  React chrome around the vanilla office renderer (§10 of the spec):
  mono header, right rail fed from the SAME JSON as the scene, footer
  terminal line, fullscreen dialog re-rendering the same component.
*/
import { useEffect, useRef, useState } from "react";
import { renderOffice } from "@/office/office";
import { DEMO_STATE } from "@/office/demoState";
import "@/office/office.css";

type OfficeApi = ReturnType<typeof renderOffice>;

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

export default function OfficeScene() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const fullRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const apiRef = useRef<OfficeApi | null>(null);
  const fullApiRef = useRef<OfficeApi | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (!sceneRef.current) return;
    apiRef.current = renderOffice(sceneRef.current, DEMO_STATE, {
      onSelect: setSelected,
    });
    return () => apiRef.current?.destroy();
  }, []);

  useEffect(() => {
    if (dialogOpen && fullRef.current) {
      fullApiRef.current = renderOffice(fullRef.current, DEMO_STATE, {});
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
    <figure className="m-0">
      <div className="overflow-hidden border border-[#EEEAE4]/40 bg-[#070B14] shadow-[8px_8px_0_rgba(43,85,176,0.15)]">
        {/* header */}
        <div className="flex items-center justify-between gap-4 border-b border-white/10 px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.15em] text-neutral-400">
          <span className="flex min-w-0 items-center gap-2.5">
            <span
              aria-hidden
              className="live-dot h-2 w-2 shrink-0 rounded-full bg-[#1D6BFF]"
            />
            <span className="truncate">
              THE OFFICE · {DEMO_STATE.business} · LIVE
            </span>
          </span>
          <span className="flex shrink-0 items-center gap-3">
            <span className="hidden text-neutral-500 md:inline">
              tap a room
            </span>
            <button
              type="button"
              onClick={openFull}
              className="border border-white/15 px-2.5 py-1 font-mono text-[10px] tracking-[0.14em] text-neutral-400 transition-colors hover:border-[#1D6BFF] hover:text-[#1D6BFF]"
            >
              ⤢ FULLSCREEN
            </button>
          </span>
        </div>

        {/* scene + rail */}
        <div className="grid lg:grid-cols-[1fr_240px]">
          <div ref={sceneRef} className="min-w-0" />
          <aside className="border-t border-white/10 px-4 py-4 lg:border-l lg:border-t-0">
            <p className="font-mono text-[10px] tracking-[0.18em] text-neutral-500">
              ROOM DIRECTORY
            </p>
            <ul className="mt-3 space-y-1.5">
              {RAIL.map((room) => {
                const active = selected === room.id;
                const count = roomCount(room.id);
                const lit = count.startsWith("4") || count === "12/12";
                return (
                  <li key={room.id}>
                    <button
                      type="button"
                      onClick={() => railClick(room.id)}
                      className={`grid w-full grid-cols-[10px_1fr_auto] items-baseline gap-2.5 border px-2.5 py-2 text-left transition-colors ${
                        active
                          ? "border-[#1D6BFF] bg-[#1D6BFF]/10"
                          : "border-transparent hover:border-white/15"
                      }`}
                    >
                      <span
                        aria-hidden
                        className={`h-[7px] w-[7px] self-center ${
                          lit ? "bg-[#1D6BFF]" : "border border-neutral-600"
                        }`}
                      />
                      <span className="min-w-0">
                        <span className="block truncate text-[13px] font-semibold text-neutral-200">
                          {room.name}
                        </span>
                        <span className="block truncate font-mono text-[10px] tracking-[0.08em] text-neutral-500">
                          {room.sub}
                        </span>
                      </span>
                      <span className="font-mono text-[11px] tabular-nums text-neutral-400">
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
        <div className="border-t border-white/10 px-4 py-2 font-mono text-[10px] tracking-[0.12em] text-neutral-600">
          $ AICEO RENDER --CLIENT EXAMPLE
          <span className="os-cursor ml-1 inline-block h-[10px] w-[5px] bg-[#1D6BFF] align-middle" />
        </div>
      </div>

      <figcaption className="mt-3 font-mono text-[12px] leading-relaxed text-ink-muted">
        This is a real one, running. Lit rooms are systems working. Dark rooms
        are the pitch.
      </figcaption>

      {/* fullscreen */}
      <dialog
        ref={dialogRef}
        onClose={onClosed}
        className="fixed inset-0 m-0 h-[100dvh] max-h-none w-screen max-w-none bg-[#070B14] p-0 backdrop:bg-black/85 [overscroll-behavior:contain]"
      >
        {dialogOpen && (
          <div className="relative grid h-full w-full place-items-center p-4">
            <div ref={fullRef} className="w-full max-w-6xl" />
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              className="absolute right-4 top-4 border border-white/20 bg-[#070B14]/80 px-3 py-2 font-mono text-[11px] tracking-[0.14em] text-white/90 transition-colors hover:border-[#1D6BFF] hover:text-[#1D6BFF]"
            >
              ✕ CLOSE
            </button>
          </div>
        )}
      </dialog>
    </figure>
  );
}

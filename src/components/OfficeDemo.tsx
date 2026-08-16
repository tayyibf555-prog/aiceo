"use client";

/*
  The dark panel's contents: a lazy facade over the second-brain-viz
  build living in public/office/.

  Desktop (fine pointer): the iframe mounts when the panel nears the
  viewport (IO, 200px margin) with wheel-zoom disabled, so wheel events
  chain through to page scroll and drag rotates the brain. The header's
  fullscreen button opens a <dialog> with zoom enabled.

  Mobile (coarse pointer): no inline iframe at all. The poster is a
  tap target that opens the fullscreen <dialog>, where the app mounts
  with full interaction. Closing unmounts it to free the GPU.

  Lighthouse never scrolls or taps, so audits load one webp and none of
  the 1.3MB WebGL bundle.
*/
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { office } from "@/content/site";

const EMBED_URL = "/office/index.html?embed=1&zoom=0";
const FULL_URL = "/office/index.html?embed=1";

export default function OfficeDemo() {
  const [inlineActive, setInlineActive] = useState(false);
  const [inlineLoaded, setInlineLoaded] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [coarse, setCoarse] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    setCoarse(isCoarse);
    if (isCoarse) return; // mobile: poster only until tapped

    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInlineActive(true);
          io.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const openDialog = () => {
    setDialogOpen(true);
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => dialogRef.current?.showModal());
  };
  const closeDialog = () => {
    dialogRef.current?.close();
  };
  const onDialogClosed = () => {
    setDialogOpen(false);
    document.body.style.overflow = "";
  };

  return (
    <div ref={rootRef} className="absolute inset-0">
      {/* poster layer */}
      <button
        type="button"
        onClick={coarse ? openDialog : undefined}
        aria-label={coarse ? "Open the live office demo fullscreen" : undefined}
        className={`absolute inset-0 z-10 block w-full cursor-${coarse ? "pointer" : "default"} transition-opacity duration-700 ${
          inlineLoaded ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
      >
        <Image
          src="/office/poster.webp"
          alt={office.posterAlt}
          fill
          sizes="(max-width: 768px) 100vw, 1100px"
          className="object-cover"
        />
        <span className="absolute bottom-3 left-4 font-mono text-[11px] tracking-[0.18em] text-white/70">
          {coarse ? office.openLabelTouch : office.openLabel}
        </span>
      </button>

      {/* fullscreen control, desktop only (mobile's poster is the tap target) */}
      {!coarse && (
        <button
          type="button"
          onClick={openDialog}
          className="absolute right-3 top-3 z-20 border border-white/20 bg-bg-dark/70 px-2.5 py-1.5 font-mono text-[10px] tracking-[0.15em] text-white/80 backdrop-blur-sm transition-colors hover:border-accent hover:text-accent"
        >
          {office.fullscreenLabel}
        </button>
      )}

      {/* inline iframe, desktop only */}
      {!coarse && inlineActive && (
        <iframe
          src={EMBED_URL}
          title="The Office, a live second brain"
          loading="lazy"
          allow="fullscreen"
          onLoad={() => setTimeout(() => setInlineLoaded(true), 600)}
          className="absolute inset-0 h-full w-full border-0"
        />
      )}

      {/* fullscreen dialog, both pointers */}
      <dialog
        ref={dialogRef}
        onClose={onDialogClosed}
        className="fixed inset-0 m-0 h-[100dvh] max-h-none w-screen max-w-none bg-bg-dark p-0 backdrop:bg-black/80 [overscroll-behavior:contain]"
      >
        {dialogOpen && (
          <div className="relative h-full w-full">
            <iframe
              src={FULL_URL}
              title="The Office, fullscreen"
              className="absolute inset-0 h-full w-full border-0"
            />
            <button
              type="button"
              onClick={closeDialog}
              className="absolute right-4 top-4 border border-white/20 bg-bg-dark/80 px-3 py-2 font-mono text-[11px] tracking-[0.15em] text-white/90 backdrop-blur-sm transition-colors hover:border-accent hover:text-accent"
            >
              {office.closeLabel}
            </button>
          </div>
        )}
      </dialog>
    </div>
  );
}

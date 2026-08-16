import type { ReactNode } from "react";

/* Mono kicker (brief §2): 12px, uppercase, +0.15em, preceded by › or ●. */
export default function Kicker({
  glyph = "›",
  className = "",
  children,
}: {
  glyph?: "›" | "●";
  className?: string;
  children: ReactNode;
}) {
  return (
    <p className={`kicker-text text-ink-muted ${className}`}>
      <span
        aria-hidden
        className={
          glyph === "●" ? "live-dot mr-2 inline-block text-accent" : "mr-2 text-accent"
        }
      >
        {glyph}
      </span>
      {children}
    </p>
  );
}

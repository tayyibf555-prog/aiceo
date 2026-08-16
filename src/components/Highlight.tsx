import type { ReactNode } from "react";

/* Prose highlights (brief §3.6): dotted accent underline or accent-soft pill. */
export default function Highlight({
  variant = "pill",
  children,
}: {
  variant?: "pill" | "dotted";
  children: ReactNode;
}) {
  return variant === "pill" ? (
    <span className="rounded bg-accent-soft px-1 text-ink">{children}</span>
  ) : (
    <span className="border-b-2 border-dotted border-accent text-ink">
      {children}
    </span>
  );
}

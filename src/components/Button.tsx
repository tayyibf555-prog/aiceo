import type { ReactNode } from "react";

/*
  Brief §3.6: primary = accent bg, white bold label, trailing →, ~8px
  radius, subtle hard shadow. Secondary = white with a line border.
*/
export default function Button({
  href,
  variant = "primary",
  arrow = "→",
  className = "",
  children,
}: {
  href: string;
  variant?: "primary" | "secondary";
  arrow?: string | null;
  className?: string;
  children: ReactNode;
}) {
  const base =
    "inline-block rounded-lg px-6 py-3 font-bold transition-all duration-150";
  const look =
    variant === "primary"
      ? "bg-accent text-accent-on shadow-[3px_3px_0_rgba(10,10,10,0.9)] hover:translate-x-[1px] hover:translate-y-[1px] hover:bg-accent-hover hover:shadow-[2px_2px_0_rgba(10,10,10,0.9)]"
      : "border border-line bg-bg text-ink hover:border-line-strong hover:bg-bg-subtle";
  return (
    <a href={href} className={`${base} ${look} ${className}`}>
      {children}
      {arrow && <span className="ml-2">{arrow}</span>}
    </a>
  );
}

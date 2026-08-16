import type { ReactNode } from "react";
import { sections, type SectionId } from "@/content/site";

/*
  Section shell: wires the anchor id and the data-exec attribute the
  TerminalHUD observes, and optionally lays grid paper behind the content.
*/
export default function Section({
  id,
  grid = false,
  container = true,
  className = "",
  children,
}: {
  id: SectionId;
  grid?: boolean;
  container?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const exec = sections.find((s) => s.id === id)?.exec;
  return (
    <section
      id={id}
      data-exec={exec}
      className={`relative ${grid ? "grid-paper" : ""} ${className}`}
    >
      {container ? (
        <div className="relative z-10 mx-auto max-w-6xl px-6">{children}</div>
      ) : (
        children
      )}
    </section>
  );
}

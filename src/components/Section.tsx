import type { ReactNode } from "react";
import { sections, type SectionId } from "@/content/site";

/*
  Section shell: wires the anchor id and the data-exec attribute the
  TerminalHUD observes.
*/
export default function Section({
  id,
  container = true,
  className = "",
  children,
}: {
  id: SectionId;
  container?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const exec = sections.find((s) => s.id === id)?.exec;
  return (
    <section id={id} data-exec={exec} className={`relative ${className}`}>
      {container ? (
        <div className="relative z-10 mx-auto max-w-6xl px-6">{children}</div>
      ) : (
        children
      )}
    </section>
  );
}

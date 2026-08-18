import Image from "next/image";
import logo from "../../../public/brand/logo-lockup-clean.png";
import Section from "@/components/Section";
import { footer, nav } from "@/content/site";

export default function Footer() {
  return (
    <Section id="footer" className="border-t border-line py-14">
      <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
        <div>
          <Image src={logo} alt="AI CEO" className="h-6 w-auto" />
          <p className="mt-4 font-mono text-[12px] tracking-[0.08em] text-ink-muted">
            {footer.line}
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2">
          {nav.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-mono text-[11px] tracking-[0.12em] text-ink-muted transition-colors hover:text-accent"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
      <div className="mt-10 flex flex-col gap-2 border-t border-line pt-6 font-mono text-[11px] tracking-[0.1em] text-ink-muted md:flex-row md:items-center md:justify-between">
        <span>
          © {footer.year} {footer.company} ·{" "}
          <a href="/terms" className="transition-colors hover:text-accent">
            TERMS
          </a>{" "}
          ·{" "}
          <a href="/privacy" className="transition-colors hover:text-accent">
            PRIVACY
          </a>
        </span>
        <span>
          <span className="text-accent">●</span> {footer.note}
        </span>
      </div>
    </Section>
  );
}

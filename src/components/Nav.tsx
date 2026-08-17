import Image from "next/image";
import logo from "../../public/brand/logo-lockup-clean.png";
import { nav } from "@/content/site";
import Button from "@/components/Button";

export default function Nav() {
  return (
    <header className="border-b border-line bg-bg">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <a href="#hero" aria-label="The AI CEO — back to top">
          <Image src={logo} alt="AI CEO" priority className="h-7 w-auto" />
        </a>
        <nav className="hidden items-center gap-7 lg:flex">
          {nav.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-mono text-[13px] tracking-[0.12em] text-ink-body transition-colors hover:text-accent"
            >
              {link.label}
            </a>
          ))}
        </nav>
        {/* span wrapper: Button's own inline-block would tie with an
            added `hidden` (same specificity), so display lives out here */}
        <span className="hidden sm:block">
          <Button href={nav.cta.href}>{nav.cta.label}</Button>
        </span>
      </div>
    </header>
  );
}

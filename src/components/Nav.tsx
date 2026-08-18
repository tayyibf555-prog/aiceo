import { nav } from "@/content/site";
import Button from "@/components/Button";

export default function Nav() {
  return (
    <header className="border-b border-line bg-bg">
      <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-6">
        <a href="#hero" aria-label="The AI CEO — back to top">
          {/* typed wordmark with the card shadow, soft blue offset */}
          <span className="text-[26px] font-black tracking-[-0.02em] text-accent [text-shadow:3px_3px_0_rgba(43,85,176,0.25)]">
            AI CEO.
          </span>
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

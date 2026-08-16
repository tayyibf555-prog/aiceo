/*
  Every word on the site lives here (copy rules: docs/brief.md §5 —
  British spelling, no em-dashes, banned-word list enforced by
  scripts/copy-lint.sh). Section components consume this, never
  hard-code copy.
*/

export const brand = {
  name: "The AI CEO",
  company: "Azen AI Ltd",
  hudLabel: "AICEO_V1.0",
};

export const announcement =
  "Doors open August 20 · Cohort 1 · 10 seats · £997";

/** Section ids double as anchor targets; exec labels feed the terminal HUD. */
export const sections = [
  { id: "hero", exec: "00_boot" },
  { id: "office", exec: "01_office" },
  { id: "problem", exec: "02_problem" },
  { id: "introducing", exec: "03_aiceo" },
  { id: "systems", exec: "04_systems" },
  { id: "curriculum", exec: "05_sessions" },
  { id: "exam", exec: "06_exam" },
  { id: "roi", exec: "07_roi" },
  { id: "fit", exec: "08_fit" },
  { id: "pricing", exec: "09_pricing" },
  { id: "faqs", exec: "10_faq" },
  { id: "footer", exec: "11_end" },
] as const;

export type SectionId = (typeof sections)[number]["id"];

export const nav = {
  links: [
    { label: "WHAT YOU GET", href: "#systems" },
    { label: "HOW IT WORKS", href: "#curriculum" },
    { label: "PRICING", href: "#pricing" },
    { label: "FAQS", href: "#faqs" },
    { label: "THE OFFICE", href: "#office" },
  ],
  cta: { label: "Get the free brain", href: "#pricing" },
};

/** Set when the user supplies the checkout link for the £997 cohort card. */
export const checkoutUrl = "#pricing";

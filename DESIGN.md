# Design system

Source of truth: docs/brief.md §1–3 and src/app/globals.css (@theme). Values are fixed by the brief; do not drift.

## Color

| Token | Value | Use |
|---|---|---|
| --color-bg | #FFFFFF | page |
| --color-bg-subtle | #FAFAFA | alternate section tint |
| --color-bg-dark | #0A0A0A | inset demo windows, exam section |
| --color-ink | #0A0A0A | headings |
| --color-ink-body | #525252 | body copy |
| --color-ink-muted | #A3A3A3 | mono labels, captions |
| --color-line | #E5E7EB | hairlines |
| --color-line-strong | #D4D4D4 | diagram chip borders |
| --color-accent | #2B55B0 | THE accent, replaces reference red everywhere (brief's #1D6BFF → #1557E0 → calmer royal #2B55B0, both at user request, 17 Aug) |
| --color-accent-hover | #22458F | button hover |
| --color-accent-soft | rgb(43 85 176 / .12) | pills, tints |
| --color-bronze | #B46F37 | optional warm secondary, tiny doses |

Strategy: restrained neutrals with one hot accent (the reference site's own strategy). Accent appears in: announcement bar, H1 final line, primary buttons, halftone pixels, HUD cursor and progress, live dots, kicker glyphs, sparse dither pixels.

## Typography

- Display and body: Helvetica Neue system stack. H1 clamp(40px, 7vw, 64px)/1.05, 700, -0.02em (`display-1`). H2 clamp(31px, 4.5vw, 47px) (`display-2`). Body 18px/1.55 max 60ch.
- Mono: JetBrains Mono (next/font). Kickers 12px uppercase +0.15em with › or ● glyph. Nav links 13px. HUD 11px.

## Components

Section (anchor + data-exec) · TerminalHUD · AnnouncementBar · Nav · Button (accent, hard offset shadow, trailing →; secondary white/line) · Kicker · Highlight (pill | dotted) · LogoHalftone (seeded bucket paths, server-rendered) · DemoPanel (dark chrome + mono header) · OfficeDemo (lazy facade) · LeadForm (mono inputs) · Counter · Reveal (GSAP) · fx/{HeroIntro,HalftoneFx,DiagramFx}.

Removed at user request (17 Aug): grid-paper backgrounds, DitherBand/DitherBlock noise art and satellites. The halftone arrow mark stays; it is the logo, not decoration.

## Motion

GSAP 3 + ScrollTrigger: hero load timeline (staggered blocks), halftone mark assembles from random pixel buckets, scroll reveals (power3.out, ~0.6s, y 20px, once), problem-diagram stagger. HUD cursor steps(1) blink, live-dot pulse, count-up 700ms rAF. Everything gated by prefers-reduced-motion via gsap.matchMedia. Nothing bouncy, nothing on layout properties.

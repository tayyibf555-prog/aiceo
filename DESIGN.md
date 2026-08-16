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
| --color-line | #E5E7EB | hairlines, grid paper |
| --color-line-strong | #D4D4D4 | dither grey pixels |
| --color-accent | #1D6BFF | THE accent, replaces reference red everywhere |
| --color-accent-hover | #1557E0 | button hover |
| --color-accent-soft | rgb(29 107 255 / .12) | pills, tints |
| --color-bronze | #B46F37 | optional warm secondary, tiny doses |

Strategy: restrained neutrals with one hot accent (the reference site's own strategy). Accent appears in: announcement bar, H1 final line, primary buttons, halftone pixels, HUD cursor and progress, live dots, kicker glyphs, sparse dither pixels.

## Typography

- Display and body: Helvetica Neue system stack. H1 clamp(40px, 7vw, 64px)/1.05, 700, -0.02em (`display-1`). H2 clamp(31px, 4.5vw, 47px) (`display-2`). Body 18px/1.55 max 60ch.
- Mono: JetBrains Mono (next/font). Kickers 12px uppercase +0.15em with › or ● glyph. Nav links 13px. HUD 11px.

## Components

Section (anchor + data-exec + optional grid-paper) · TerminalHUD · AnnouncementBar · Nav · Button (accent, hard offset shadow, trailing →; secondary white/line) · Kicker · Highlight (pill | dotted) · DitherBand/DitherBlock (seeded, server-rendered) · LogoHalftone · DemoPanel (dark chrome + mono header) · OfficeDemo (lazy facade) · LeadForm (mono inputs) · Counter · Reveal.

## Motion

Fade/slide 300ms ease-out via .reveal, HUD cursor steps(1) blink, live-dot pulse, count-up 700ms. Everything gated by prefers-reduced-motion. Nothing bouncy, nothing on layout properties.

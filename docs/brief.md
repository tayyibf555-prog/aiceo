# The AI CEO — Website Build Brief

Build brief for Claude Code. The site clones the design language of thefounderos.com (verified against the live site on 14 Aug 2026, computed styles extracted from the DOM) with one systematic change: **everywhere they use red, we use AI CEO blue**. Content is our offer, not theirs.

---

## 1. Design tokens

The Founder OS is built on a Tailwind-style neutral scale with one hot accent. These are the exact values pulled from their live site, with the accent swapped.

```css
:root {
  /* Backgrounds */
  --bg:            #FFFFFF;   /* page background, white */
  --bg-subtle:     #FAFAFA;   /* alternate section tint */
  --bg-dark:       #0A0A0A;   /* dark inset panels (demo windows, terminal chrome) */

  /* Text */
  --ink:           #0A0A0A;   /* headings and primary text (neutral-950) */
  --ink-body:      #525252;   /* body copy (neutral-600) */
  --ink-muted:     #A3A3A3;   /* captions, mono labels (neutral-400) */

  /* Lines */
  --line:          #E5E7EB;   /* hairline borders and the background grid */
  --line-strong:   #D4D4D4;

  /* THE ACCENT — theirs is #EF4444 (Tailwind red-500). Ours: */
  --accent:        #1D6BFF;   /* AI CEO blue, from the logo mark */
  --accent-hover:  #1557E0;
  --accent-soft:   rgba(29, 107, 255, 0.12);  /* dithers, tints, halftone pixels */
  --accent-on:     #FFFFFF;   /* text on accent */

  /* Optional warm secondary (they use a bronze #B46F37 in tiny doses; keep or drop) */
  --bronze:        #B46F37;
}
```

**The swap rule for Claude Code:** any place the reference site uses red (#EF4444 or tints of it) becomes `--accent` blue. That includes: announcement bar background, hero headline accent line, primary buttons, the dithered/halftone logo pixels, progress bar fills, exec-label cursors, red pixels in the noise textures, link underlines and live-dot indicators. Nothing else changes hue.

## 2. Typography

Two typefaces, no more:

- **Display and body:** Helvetica Neue, fallback Helvetica, Arial, sans-serif. (Substitute: Inter or Neue Haas Grotesk if Helvetica Neue licensing is a bother, but tuned tight.)
- **Mono (labels, kickers, terminal chrome, nav links):** JetBrains Mono, fallback ui-monospace.

Scale, measured from their live site:

- **H1:** 64px / 700 / letter-spacing −1.28px (−0.02em) / line-height ~1.05. Two or three stacked lines, the final line in `--accent`: "Run your business **like an AI CEO.**"
- **H2 section titles:** ~44–48px / 700 / −0.02em, sentence case with a full stop. ("A live map of everything your business knows.")
- **Body:** 18px / 400 / `--ink-body` / line-height 1.55, max-width ~60ch.
- **Mono kickers:** 12–13px, UPPERCASE, letter-spacing +0.15em, `--ink-muted`, preceded by a `›` or `●` glyph. Example: `› INSIDE THE OFFICE · LIVE`.
- **Nav links:** mono, uppercase, 13px, spaced.

## 3. Signature design motifs (what makes it feel like that site)

These six things ARE the look. Reproduce all of them:

1. **Grid-paper background.** Faint 1px `--line` grid (~48–64px cells) behind content sections, fading out via radial mask. Content sits on white cards/columns above it.
2. **Terminal HUD.** A sticky top strip in mono: left side `▶ exec 01_brain.render` (the label changes per section as you scroll, with a blinking accent cursor block), right side `AICEO_V1.0  042%` where the percentage is scroll progress, plus a thin accent progress line under the strip. This is the single most memorable device on their site.
3. **Dither/halftone art.** The hero graphic is the logo mark rendered as halftone pixels in accent colour inside a thin-bordered frame, with small dithered pixel blocks orbiting it connected by hairlines. Also large pixel-noise bands (grey + sparse accent pixels) used as section transitions. Our version: the AI CEO arrow mark dithered in blue.
4. **Announcement bar.** Full-width accent bar, white mono text, top of page: `Doors open August 20 · Cohort 1 · 10 seats · £997`.
5. **Dark inset demo windows.** Near-black `--bg-dark` rounded panels with a mono status header (`● THE OFFICE · SECOND BRAIN · LIVE`) containing the interactive demo. High contrast against the white page is deliberate.
6. **Prose highlights.** Key phrases in body copy get dotted underlines or a soft accent-tint pill ("own outright" style). Buttons: accent background, white bold label, trailing `→`, ~8px radius, subtle hard shadow; secondary button is white with a `--line` border.

Motion: sections fade/slide up on scroll, exec label swaps per section, progress % ticks. Subtle, fast (200–400ms), never bouncy.

## 4. Page structure (sections in order, with our content)

1. **Announcement bar** — accent blue: `Doors open August 20 · Cohort 1 · 10 seats · £997`.
2. **Nav** — logo left (AI CEO mark + wordmark), mono links: WHAT YOU GET · HOW IT WORKS · PRICING · FAQS · THE OFFICE. Accent CTA button right: `Get the free brain →`.
3. **Hero** — pill badge (`● FREE BRAIN OPEN · COHORT 1: 10 SEATS`), H1: "Run your business / like an **AI CEO.**" (accent on last line). Subhead: "Over 8 live sessions we build systems you own outright: a second brain, a deputy that answers for you, speed to lead, reactivation, and a 7am brief. Your business runs on it. You own every file." Primary CTA `Get the free brain →`, secondary `See the office ↓`. Right: dithered blue logo mark frame.
4. **Live demo** — kicker `› INSIDE THE OFFICE · LIVE`, H2 "A live map of everything your business knows." Dark panel embedding the isometric Office / Operating Map demo (rooms lit and dark, clickable). Caption: "This is a real one, running. You get yours free, on day one."
5. **The problem** — short manifesto block: enquiries dying in the inbox overnight, everything worth knowing living in the owner's head, Monday mornings spent asking people what happened. Their "30 tabs" section, rewritten for owners.
6. **Introducing The AI CEO** — H2 "Introducing The AI CEO." with dithered transition band above. The one-paragraph offer (free brain plus paid cohort), followed by three mono-labelled vignettes (their OVERNIGHT / 7:00 AM pattern): `OVERNIGHT` the enquiry answered at 11pm; `7:00 AM` the brief on your phone; `TUESDAY` a dead lead replies to a message you never sent.
7. **The four systems** — four cards matching the four weeks: 🧠 The Brain & Deputy, ⚡ Speed to Lead, ⛏️ Reactivation, ☀️ The Daily Brief. Each with the pain it kills in one line.
8. **How it works / curriculum** — 8 sessions over 4 weeks, Tuesday builds Thursday proves, each session row: mono session number, name, one-line outcome, "ends with something running in your business".
9. **The exam / guarantee** — its own section, it's the differentiator: "At the end of week one you ask it twenty questions about your own business. You mark it. 16/20 or we keep working free until it passes."
10. **ROI maths** — reactivation framing: one revived client covers the fee. Simple counter graphic.
11. **Fit check** — who this is for / not for (from the ICP: owner attends personally, live business, no AI tourists).
12. **Pricing** — Free brain card + Cohort card (£997, 10 seats) + 1-on-1 card (£2,500–£3,500). Retainer mentioned under cohort as "after".
13. **FAQs** — not technical, time cost (~10 hours), data safety, what if I score under 16, do I need a Mac (no).
14. **Footer** — mono, minimal, Azen AI Ltd.

## 5. Copy rules

British spelling. No em-dashes. Never: help, adopt, scale, leverage, automations, AI-powered, digital transformation, workforce, agents, empire, unlock, 10x, "co-pilot" as a product name, "AI Operating System". The voice is "you, running the business like an AI CEO", never "an AI that is the CEO".

## 6. Build notes for Claude Code

- Stack: single Next.js or plain Vite site, Tailwind with the tokens above mapped into the theme; JetBrains Mono via Google Fonts; system Helvetica stack.
- The terminal HUD, grid background, dither textures and scroll-exec labels are the four components to build first; they carry 80% of the feel.
- Dithers: generate as tiny canvas/SVG pixel fields at build time, not images, so the accent stays a CSS variable.
- The demo panel embeds the Operating Map / isometric office as an iframe or inline component sharing the same state JSON as the client maps.
- Mobile: hero stacks, HUD collapses to just the progress line, demo panel becomes tap-to-fullscreen.
- Lighthouse target 95+; no heavy libraries for the dithers or scroll effects.

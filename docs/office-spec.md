# The Office — Full Design Spec (v1, office only)

The user-supplied spec of record for the pixel office. The renderer at
`src/office/office.js` implements this document; consult it before any
change to the scene. Core laws:

- The Office is the ONLY visual. No brain, no constellation, anywhere.
- Dimetric 2:1 pixel isometric. Fixed camera. Integer coordinates,
  `crispEdges`, no anti-aliasing, no gradients, no soft shadows.
- 9-colour palette: void #070B14, floor #0A0E1A, wall #111827, cream
  #EEEAE4 (60% for dark rooms), accent #1D6BFF, accent-dim #143E8F,
  ember #E8833A (moving things only), warm #F5E9C9 (corner-office lamp
  only), danger #E5484D (flag tray only).
- Dither does all shading (25/50/75 checkerboards); one key light
  top-left; one 50%-dither drop shadow, offset 6px down-right.
- Rooms = weeks: Boardroom/Second Brain (wk1, centre, largest),
  Reception/Speed to Lead (wk2, full front), Archive/Reactivation
  (wk3), Corner Office/Daily view (wk4). Corridor: 12 locked doors
  (QUOTING, FOLLOW-UP, REACTIVATION II, CONTRACTS, COMPLIANCE,
  SCHEDULING, SUPPLIERS, QUALITY, FORECASTING, TEAM LOAD, MARGIN,
  PHONE ANSWERING) — the upsell ladder. Courtyard paves the arrow mark.
- 16 fixtures, 4 per room, each with dark/wired/lit variants defined as
  coordinate arrays in `src/office/sprites.js`. Dark rooms are still
  (one dust dither); stillness is the contrast that sells.
- Motion: single rAF clock quantised to 12fps. Idle: window flicker,
  ember dots on the floor wiring between lit rooms, keyhole glints,
  room loops (bell, papers, till coin, lamp, print line). Transitions
  stepped, never tweened. Reduced motion: static, single-frame cuts.
- In-scene text: 5×7 pixel font only (`src/office/font5x7.js`). HUD
  chrome around the scene: JetBrains Mono. Never mix layers.
- Four modes from one JSON (`src/office/demoState.js` holds demo +
  scan example): demo (all lit), scan-result (their answers light
  2–4 fixtures; dark rooms get stamped diagnosis plaques + `LIT n/16`
  strip), client (their name in the header, weekly wiring pulse),
  reveal (scripted ~20s boot timeline, also the sales-video loop).
- Interaction: hover lifts a room 1 unit + nameplate; click = stepped
  zoom (no popups, no modals, ever); drag pan ±60 logical px with
  eased settle.
- The standing test for every frame: a machine running a business,
  drawn by someone with taste — chunky, quantised, navy and cream,
  ember only where something moves. If it could pass for a mobile game
  or a smooth SaaS illustration, pull it back to the terminal.

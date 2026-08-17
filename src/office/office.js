/*
  THE OFFICE — dimetric pixel renderer. Vanilla, zero dependencies.
  SVG out, JSON in; same JSON → same pixels. Spec: docs/office-spec.
    - 2:1 dimetric, 480×300 logical px, integer coordinates only
    - 9-colour palette, dither shading, one key light top-left
    - fixtures are coordinate-array sprites with dark/wired/lit states
    - a 12fps quantised clock drives every idle loop and transition
  API: renderOffice(el, state, opts) → { destroy, setState, focusRoom,
       zoomOut, playReveal }
*/
import { FIXTURES } from "./sprites";
import { textPixels, textWidth } from "./font5x7";
import { MARK_GRID } from "../lib/halftone-data";

export const PALETTE = {
  void: "#070B14",
  floor: "#0A0E1A",
  wall: "#111827",
  L: "#EEEAE4",
  LD: "rgba(238,234,228,0.6)",
  A: "#1D6BFF",
  AD: "#143E8F",
  E: "#E8833A",
  W: "#F5E9C9",
  D: "#E5484D",
  K: "#111827",
};

const NS = "http://www.w3.org/2000/svg";
const CX = 240;
const CY = 74;

/* World → screen. +X = (2,1), +Y = (-2,1), +Z = (0,-1). Integers in,
   integers out: the whole scene quantises. */
const iso = (x, y, z = 0) => [CX + (x - y) * 2, CY + x + y - z];

/* ── Layout (world units) ────────────────────────────────────────── */
const ROOMS = [
  {
    id: "archive",
    name: "ARCHIVE",
    week: "WK 3",
    x: 2, y: 10, w: 22, d: 22,
    fixtures: {
      cabinets: [6, 13], sortdesk: [10, 22], outbox: [19, 26], till: [13, 17],
    },
  },
  {
    id: "boardroom",
    name: "BOARDROOM",
    week: "WK 1",
    x: 24, y: 8, w: 42, d: 26,
    fixtures: {
      table: [42, 20], intray: [50, 17], rulebook: [38, 10], chair: [36, 22], phone: [48, 23],
    },
  },
  {
    id: "corner",
    name: "CORNER OFFICE",
    week: "WK 4",
    x: 66, y: 10, w: 28, d: 22,
    fixtures: {
      desklamp: [78, 18], page: [76, 21], wallchart: [82, 12], flagtray: [88, 24],
    },
  },
  {
    id: "reception",
    name: "RECEPTION",
    week: "WK 2",
    x: 2, y: 34, w: 62, d: 20,
    fixtures: {
      letterbox: [10, 50], bell: [28, 42], clipboard: [20, 37], shelf: [46, 39],
    },
  },
];

const COURTYARD = { x: 66, y: 34, w: 28, d: 20 };

const DOORS = [
  "QUOTING", "FOLLOW-UP", "REACTIVATION II", "CONTRACTS", "COMPLIANCE",
  "SCHEDULING", "SUPPLIERS", "QUALITY", "FORECASTING", "TEAM LOAD",
  "MARGIN", "PHONE ANSWERING",
];

/* Floor wiring: boardroom heart → each room, L-shaped runs. */
const HEART = [45, 21];
const WIRES = {
  archive: [[45, 21], [26, 21], [13, 21]],
  reception: [[45, 21], [45, 44], [30, 44]],
  corner: [[45, 21], [68, 21], [80, 21]],
};

/* ── tiny svg helpers ────────────────────────────────────────────── */
function make(tag, attrs, parent) {
  const n = document.createElementNS(NS, tag);
  for (const k in attrs) n.setAttribute(k, attrs[k]);
  if (parent) parent.appendChild(n);
  return n;
}
const rect = (p, x, y, w, h, f, extra = {}) =>
  make("rect", { x, y, width: w, height: h, fill: f, ...extra }, p);

function poly(p, pts, f, extra = {}) {
  return make(
    "polygon",
    { points: pts.map(([a, b]) => `${a},${b}`).join(" "), fill: f, ...extra },
    p
  );
}

function stampText(parent, str, sx, sy, fill) {
  const g = make("g", { transform: `translate(${sx},${sy})` }, parent);
  for (const p of textPixels(str)) rect(g, p.x, p.y, 1, 1, fill);
  return g;
}

/* ── renderer ────────────────────────────────────────────────────── */
export function renderOffice(host, state, opts = {}) {
  const anim = new Map(); // cls → els
  const reg = (cls, el) => {
    if (!cls) return el;
    if (!anim.has(cls)) anim.set(cls, []);
    anim.get(cls).push(el);
    return el;
  };
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* innerHTML below only ever CLEARS nodes (""), never inserts markup;
     all content is built via createElementNS. No untrusted HTML. */
  host.innerHTML = "";
  const svg = make("svg", {
    viewBox: "114 38 336 206",
    class: "office-svg",
    "shape-rendering": "crispEdges",
    role: "img",
    "aria-label":
      "The Office: an isometric pixel building. Lit rooms are systems running; dark rooms are systems missing.",
  });
  host.appendChild(svg);

  /* dither patterns */
  const defs = make("defs", {}, svg);
  const mkDither = (id, fill, cells) => {
    const pat = make(
      "pattern",
      { id, width: 2, height: 2, patternUnits: "userSpaceOnUse" },
      defs
    );
    for (const [px_, py_] of cells) rect(pat, px_, py_, 1, 1, fill);
  };
  mkDither("d25", PALETTE.void, [[0, 0]]);
  mkDither("d50", PALETTE.void, [[0, 0], [1, 1]]);
  mkDither("shadow50", "rgba(0,0,0,0.55)", [[0, 0], [1, 1]]);
  mkDither("lit25", "rgba(29,107,255,0.28)", [[1, 0]]);

  rect(svg, 0, 0, 560, 320, PALETTE.void);
  const scene = make("g", { class: "office-scene" }, svg);

  /* drop shadow of the whole slab, offset 6 down-right */
  const slab = [iso(0, 0), iso(96, 0), iso(96, 56), iso(0, 56)];
  poly(
    scene,
    slab.map(([x, y]) => [x + 6, y + 6]),
    "url(#shadow50)"
  );

  /* ground slab */
  poly(scene, slab, PALETTE.floor);
  poly(scene, slab, "none", { stroke: PALETTE.LD, "stroke-width": 1 });

  /* corridor platform + 12 locked doors along the back wall */
  const backWall = make("g", {}, scene);
  poly(
    backWall,
    [iso(0, 0, 20), iso(96, 0, 20), iso(96, 0, 0), iso(0, 0, 0)],
    PALETTE.wall
  );
  make(
    "polyline",
    {
      points: [iso(0, 0, 20), iso(96, 0, 20)].map((p) => p.join(",")).join(" "),
      stroke: PALETTE.L,
      "stroke-width": 1,
      fill: "none",
    },
    backWall
  );
  const doorGroups = [];
  DOORS.forEach((name, i) => {
    const wx = 4 + i * 7.6;
    const [dx, dy] = iso(wx, 0, 0);
    const g = make("g", { class: "office-door" }, backWall);
    rect(g, dx, dy - 12, 8, 12, PALETTE.void);
    rect(g, dx, dy - 12, 8, 1, PALETTE.LD);
    rect(g, dx, dy - 1, 8, 1, PALETTE.LD);
    rect(g, dx, dy - 12, 1, 12, PALETTE.LD);
    rect(g, dx + 7, dy - 12, 1, 12, PALETTE.LD);
    reg("keyhole", rect(g, dx + 5, dy - 6, 1, 1, PALETTE.E, { opacity: 0 }));
    doorGroups.push({ g, name, x: dx });
  });

  /* courtyard paving + the arrow mark as paving */
  const cy = make("g", {}, scene);
  poly(
    cy,
    [
      iso(COURTYARD.x, COURTYARD.y),
      iso(COURTYARD.x + COURTYARD.w, COURTYARD.y),
      iso(COURTYARD.x + COURTYARD.w, COURTYARD.y + COURTYARD.d),
      iso(COURTYARD.x, COURTYARD.y + COURTYARD.d),
    ],
    PALETTE.floor
  );
  const step = 2;
  for (let r = 0; r < MARK_GRID.rows; r += step) {
    for (let c = 0; c < MARK_GRID.cols; c += step) {
      if (!MARK_GRID.cells[r * MARK_GRID.cols + c]) continue;
      const wx = COURTYARD.x + 5 + (c / step) * 0.9;
      const wy = COURTYARD.y + 2 + (r / step) * 0.8;
      if (wx > COURTYARD.x + COURTYARD.w - 2 || wy > COURTYARD.y + COURTYARD.d - 2)
        continue;
      const [sx, sy] = iso(wx, wy, 0);
      rect(cy, sx, sy, 2, 1, PALETTE.AD);
    }
  }

  /* static wiring runs (drawn under rooms' fixtures, over floors) */
  const wireLayer = make("g", {}, scene);
  const wirePaths = {};
  for (const roomId in WIRES) {
    const pts = WIRES[roomId];
    const samples = [];
    for (let s = 0; s < pts.length - 1; s++) {
      const [x1, y1] = pts[s];
      const [x2, y2] = pts[s + 1];
      const stepsN = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1));
      for (let i = 0; i <= stepsN; i += 2) {
        const wx = x1 + ((x2 - x1) * i) / stepsN;
        const wy = y1 + ((y2 - y1) * i) / stepsN;
        samples.push(iso(Math.round(wx), Math.round(wy), 0));
      }
    }
    wirePaths[roomId] = samples;
    samples.forEach(([sx, sy], i) => {
      if (i % 2 === 0) rect(wireLayer, sx, sy, 1, 1, PALETTE.AD);
    });
  }

  /* rooms, painter-sorted */
  const roomEls = {};
  const sorted = [...ROOMS].sort((a, b) => a.x + a.y - (b.x + b.y));
  for (const room of sorted) {
    const rs = (state.rooms && state.rooms[room.id]) || { state: "dark" };
    const lit = rs.state === "lit";
    const wired = rs.state === "wired";
    const g = make("g", { class: "office-room", "data-room": room.id }, scene);
    const { x, y, w, d } = room;

    const floorPts = [iso(x, y), iso(x + w, y), iso(x + w, y + d), iso(x, y + d)];
    poly(g, floorPts, PALETTE.floor);
    if (lit) poly(g, floorPts, "url(#lit25)");
    poly(g, floorPts, "none", {
      stroke: lit || wired ? PALETTE.L : PALETTE.LD,
      "stroke-width": 1,
      class: wired ? "office-wired-outline" : "",
    });

    /* walls: north tall, west mid, east dithered, south cutaway */
    const wall = (x1, y1, x2, y2, h, dark) => {
      poly(g, [iso(x1, y1, 0), iso(x2, y2, 0), iso(x2, y2, h), iso(x1, y1, h)], PALETTE.wall);
      if (dark)
        poly(g, [iso(x1, y1, 0), iso(x2, y2, 0), iso(x2, y2, h), iso(x1, y1, h)], "url(#d50)");
      make(
        "polyline",
        {
          points: [iso(x1, y1, h), iso(x2, y2, h)].map((p) => p.join(",")).join(" "),
          stroke: lit || wired ? PALETTE.L : PALETTE.LD,
          "stroke-width": 1,
          fill: "none",
        },
        g
      );
    };
    wall(x, y, x + w, y, 14, false);       // north
    wall(x, y, x, y + d, 10, false);       // west (key-light face)
    wall(x + w, y, x + w, y + d, 10, true); // east (shade side)
    wall(x, y + d, x + w, y + d, 5, true);  // south cutaway

    /* room glow halo when lit: scattered accent pixels above roofline */
    if (lit && !reduced) {
      const halo = make("g", { class: "office-halo" }, g);
      const [hx, hy] = iso(x + w / 2, y + d / 2, 16);
      for (let i = 0; i < 10; i++) {
        const a = (i * 137) % 20 - 10;
        const b = ((i * 71) % 12) - 6;
        reg(
          "halopx",
          rect(halo, hx + a, hy + b, 1, 1, PALETTE.A, {
            opacity: 0.35 + (i % 3) * 0.2,
          })
        );
      }
    }

    /* fixtures */
    for (const fid in room.fixtures) {
      const fstate = (rs.fixtures && rs.fixtures[fid]) || rs.state || "dark";
      const variant =
        FIXTURES[fid][fstate === "lit" ? "lit" : fstate === "wired" ? "wired" : "dark"];
      const [ax, ay] = room.fixtures[fid];
      const [sx, sy] = iso(ax, ay, 0);
      const fg = make("g", { transform: `translate(${sx - 6},${sy - 10})` }, g);
      for (const r of variant) {
        reg(r.cls, rect(fg, r.x, r.y, r.w, r.h, PALETTE[r.f] || r.f));
      }
    }

    /* flicker overlay */
    if (lit)
      reg(
        "flicker",
        poly(g, floorPts, PALETTE.void, { opacity: 0, "data-room": room.id })
      );

    roomEls[room.id] = { g, room, rs };
  }

  /* scan-mode plaques + score strip */
  if (state.mode === "scan") {
    for (const room of ROOMS) {
      const rs = (state.rooms && state.rooms[room.id]) || {};
      if (rs.plaque) {
        const [px_, py_] = iso(room.x + room.w / 2, room.y + room.d / 2, 2);
        const wtxt = textWidth(rs.plaque);
        const g = make("g", {}, scene);
        rect(g, px_ - wtxt / 2 - 3, py_ - 5, wtxt + 6, 11, PALETTE.void);
        rect(g, px_ - wtxt / 2 - 3, py_ - 5, wtxt + 6, 1, PALETTE.LD);
        rect(g, px_ - wtxt / 2 - 3, py_ + 5, wtxt + 6, 1, PALETTE.LD);
        stampText(g, rs.plaque, Math.round(px_ - wtxt / 2), py_ - 3, PALETTE.L);
      }
    }
  }
  if (state.score) {
    const s = `LIT ${state.score}`;
    stampText(svg, s, 240 - Math.round(textWidth(s) / 2), 286, PALETTE.L);
  }
  if (state.numbers) {
    const s = state.numbers.join(" · ");
    stampText(svg, s, 240 - Math.round(textWidth(s) / 2), 286, PALETTE.L);
  }

  /* hover nameplate */
  const plate = make("g", { class: "office-plate", opacity: 0 }, svg);

  /* ── interaction: hover lift + nameplate, stepped zoom, pan ─────── */
  let zoom = 0;
  let panX = 0, panY = 0, targetPan = [0, 0];
  let focus = null;
  const applyTransform = (steps) => {
    const conf =
      zoom === 0
        ? { s: 1, tx: 0, ty: 0 }
        : (() => {
            const r = focus;
            const [fx, fy] = iso(r.x + r.w / 2, r.y + r.d / 2, 6);
            const s = 2;
            return { s, tx: 240 - fx * s, ty: 150 - fy * s };
          })();
    let frame = 0;
    const from = scene._t || { s: 1, tx: 0, ty: 0 };
    const stepFn = () => {
      frame++;
      const p = frame / steps;
      const q = Math.round(p * steps) / steps;
      const s = from.s + (conf.s - from.s) * q;
      const tx = Math.round(from.tx + (conf.tx - from.tx) * q);
      const ty = Math.round(from.ty + (conf.ty - from.ty) * q);
      scene.setAttribute("transform", `translate(${tx + panX},${ty + panY}) scale(${s})`);
      if (frame < steps) timeline.push({ at: tick + 1, fn: stepFn });
      else scene._t = conf;
    };
    stepFn();
  };

  for (const id in roomEls) {
    const { g, room, rs } = roomEls[id];
    g.style.cursor = "pointer";
    g.addEventListener("pointerenter", () => {
      g.setAttribute("transform", "translate(0,-2)");
      plate.innerHTML = "";
      const running = rs.fixtures
        ? Object.values(rs.fixtures).filter((s) => s === "lit").length
        : rs.state === "lit"
          ? 4
          : 0;
      const line = `${room.name} · ${room.week} · ${running}/4 RUNNING`;
      const wtxt = textWidth(line);
      const [hx, hy] = iso(room.x + room.w / 2, room.y, 22);
      const bx = Math.min(Math.max(hx - wtxt / 2, 4), 476 - wtxt);
      rect(plate, bx - 4, hy - 6, wtxt + 8, 13, PALETTE.void);
      rect(plate, bx - 4, hy - 6, wtxt + 8, 1, PALETTE.L);
      rect(plate, bx - 4, hy + 6, wtxt + 8, 1, PALETTE.L);
      stampText(plate, line, Math.round(bx), hy - 3, PALETTE.L);
      plate.setAttribute("opacity", 1);
    });
    g.addEventListener("pointerleave", () => {
      g.removeAttribute("transform");
      plate.setAttribute("opacity", 0);
    });
    g.addEventListener("click", (e) => {
      e.stopPropagation();
      if (zoom === 1 && focus === room) {
        zoom = 0;
        focus = null;
      } else {
        zoom = 1;
        focus = room;
      }
      applyTransform(reduced ? 1 : 4);
      if (opts.onSelect) opts.onSelect(zoom === 1 ? room.id : null);
    });
  }
  svg.addEventListener("click", () => {
    if (zoom !== 0) {
      zoom = 0;
      focus = null;
      applyTransform(reduced ? 1 : 4);
      if (opts.onSelect) opts.onSelect(null);
    }
  });

  /* pan (whole-building level only) */
  let dragging = false, dragStart = null;
  svg.addEventListener("pointerdown", (e) => {
    if (zoom !== 0) return;
    dragging = true;
    dragStart = [e.clientX - panX, e.clientY - panY];
  });
  window.addEventListener("pointermove", onMove);
  window.addEventListener("pointerup", onUp);
  function onMove(e) {
    if (!dragging) return;
    panX = Math.max(-60, Math.min(60, e.clientX - dragStart[0]));
    panY = Math.max(-30, Math.min(30, e.clientY - dragStart[1]));
    scene.setAttribute("transform", `translate(${Math.round(panX)},${Math.round(panY)})`);
  }
  function onUp() {
    dragging = false;
  }

  /* ── the 12fps clock ────────────────────────────────────────────── */
  let tick = 0;
  let raf = null;
  let last = 0;
  const timeline = [];
  const embers = [];

  const litRooms = () =>
    Object.keys(wirePaths).filter(
      (id) => state.rooms && state.rooms[id] && state.rooms[id].state === "lit"
    );

  const drives = {
    keyhole: (els) => {
      els.forEach((el, i) => {
        const period = 72 + (i % 5) * 24;
        const phase = (tick + i * 17) % period;
        el.setAttribute("opacity", phase < 2 ? 1 : 0);
      });
    },
    flicker: (els) => {
      els.forEach((el, i) => {
        const period = 36 + ((i * 13) % 60);
        el.setAttribute("opacity", (tick + i * 29) % period < 2 ? 0.12 : 0);
      });
    },
    halopx: (els) => {
      if (tick % 3) return;
      els.forEach((el, i) => {
        if ((tick + i) % 7 === 0)
          el.setAttribute("opacity", 0.2 + ((tick + i * 3) % 5) * 0.15);
      });
    },
    phoneled: (els) =>
      els.forEach((el) => el.setAttribute("fill", tick % 12 < 6 ? "#25D366" : PALETTE.AD)),
    pageflick: (els) =>
      els.forEach((el, i) => el.setAttribute("opacity", (tick + i * 7) % 120 < 3 ? 1 : 0.4)),
    chairpulse: (els) =>
      els.forEach((el) => el.setAttribute("opacity", tick % 90 < 6 ? 1 : 0.45)),
    paper1: (els) => els.forEach((el) => el.setAttribute("opacity", tick % 48 < 30 ? 1 : 0)),
    paper2: (els) => els.forEach((el) => el.setAttribute("opacity", tick % 48 < 16 ? 1 : 0)),
    envelope: (els) => {
      const phase = tick % 84;
      els.forEach((el) => {
        el.setAttribute("opacity", phase < 8 ? 1 : 0);
        el.setAttribute("transform", `translate(0,${Math.min(phase, 4)})`);
      });
    },
    bellarc: (els) => {
      const phase = tick % 60;
      els.forEach((el) => el.setAttribute("opacity", phase < 3 ? 1 : 0));
    },
    bellbody: (els) => {
      const phase = tick % 60;
      els.forEach((el) =>
        el.setAttribute("transform", phase < 2 ? "translate(0,-1)" : "")
      );
    },
    tick1: (els) => els.forEach((el) => el.setAttribute("opacity", tick % 96 > 12 ? 1 : 0)),
    tick2: (els) => els.forEach((el) => el.setAttribute("opacity", tick % 96 > 36 ? 1 : 0)),
    tick3: (els) => els.forEach((el) => el.setAttribute("opacity", tick % 96 > 60 ? 1 : 0)),
    folderslide: (els) =>
      els.forEach((el) =>
        el.setAttribute("transform", tick % 110 < 8 ? "translate(2,0)" : "")
      ),
    drawer1: (els) =>
      els.forEach((el) => el.setAttribute("transform", tick % 70 < 10 ? "translate(0,2)" : "")),
    drawer2: (els) =>
      els.forEach((el) => el.setAttribute("transform", (tick + 23) % 82 < 10 ? "translate(0,2)" : "")),
    drawer3: (els) =>
      els.forEach((el) => el.setAttribute("transform", (tick + 47) % 94 < 10 ? "translate(0,2)" : "")),
    dust: (els) =>
      els.forEach((el, i) =>
        el.setAttribute("transform", `translate(0,${-(((tick / 2 + i * 5) % 8))})`)
      ),
    outpaper: (els) => {
      const phase = tick % 96;
      els.forEach((el) => {
        el.setAttribute("opacity", phase < 10 ? 1 : 0);
        el.setAttribute("transform", `translate(${phase < 10 ? phase : 0},0)`);
      });
    },
    tilldrawer: (els) =>
      els.forEach((el) => el.setAttribute("transform", tick % 130 < 12 ? "translate(0,2)" : "")),
    coin: (els) => {
      const phase = tick % 130;
      els.forEach((el) => {
        el.setAttribute("opacity", phase < 12 ? 1 : 0);
        el.setAttribute("transform", phase < 6 ? "translate(0,-2)" : "");
      });
    },
    lampdither: (els) =>
      els.forEach((el, i) => el.setAttribute("opacity", (tick + i * 4) % 24 < 20 ? 0.9 : 0.5)),
    printline: (els) => {
      const phase = tick % 144;
      els.forEach((el) => {
        el.setAttribute("opacity", phase < 27 ? 1 : 0);
        el.setAttribute("transform", `translate(0,${Math.min(Math.floor(phase / 3), 8)})`);
      });
    },
    bar1: (els) => barDrive(els, 0),
    bar2: (els) => barDrive(els, 1),
    bar3: (els) => barDrive(els, 2),
    flag: (els) =>
      els.forEach((el) => el.setAttribute("transform", tick % 200 < 24 ? "translate(0,-2)" : "")),
    glowline: (els) =>
      els.forEach((el) => el.setAttribute("opacity", tick % 24 < 12 ? 1 : 0.55)),
  };
  function barDrive(els, n) {
    if (tick % 120 !== n * 7) return;
    els.forEach((el) => {
      const h = 2 + ((tick / 7 + n * 3) % 6);
      el.setAttribute("height", h);
      el.setAttribute("y", 8 - h);
    });
  }

  function spawnEmber() {
    const pool = litRooms();
    if (!pool.length) return;
    const roomId = pool[Math.floor(Math.random() * pool.length)];
    const path = wirePaths[roomId];
    const el = rect(wireLayer, -9, -9, 2, 2, PALETTE.E);
    embers.push({ el, path, i: 0, dir: Math.random() < 0.5 ? 1 : -1 });
  }

  function stepEmbers() {
    for (let i = embers.length - 1; i >= 0; i--) {
      const em = embers[i];
      em.i++;
      const idx = em.dir === 1 ? em.i : em.path.length - 1 - em.i;
      if (idx < 0 || idx >= em.path.length) {
        em.el.remove();
        embers.splice(i, 1);
        continue;
      }
      const [sx, sy] = em.path[idx];
      em.el.setAttribute("x", sx);
      em.el.setAttribute("y", sy - 1);
    }
    if (tick % (24 + Math.floor(Math.random() * 24)) === 0) spawnEmber();
  }

  function frame(now) {
    raf = requestAnimationFrame(frame);
    if (now - last < 83) return; // quantise to ~12fps
    last = now;
    tick++;
    for (const [cls, els] of anim) if (drives[cls]) drives[cls](els);
    stepEmbers();
    /* pan settle */
    if (!dragging && zoom === 0 && (panX || panY)) {
      panX = Math.abs(panX) < 2 ? 0 : panX - Math.sign(panX) * 2;
      panY = Math.abs(panY) < 2 ? 0 : panY - Math.sign(panY) * 2;
      scene.setAttribute("transform", `translate(${panX},${panY})`);
    }
    /* timeline */
    for (let i = timeline.length - 1; i >= 0; i--) {
      if (timeline[i].at <= tick) {
        const { fn } = timeline[i];
        timeline.splice(i, 1);
        fn();
      }
    }
  }
  if (!reduced) raf = requestAnimationFrame(frame);

  /* ── reveal timeline (session 8 / hero loop) ────────────────────── */
  function playReveal() {
    const order = ["boardroom", "reception", "archive", "corner"];
    order.forEach((id, i) => {
      timeline.push({
        at: tick + 12 + i * 24,
        fn: () => {
          const el = roomEls[id];
          if (!el) return;
          el.g.setAttribute("opacity", 0.25);
          let f = 0;
          const boot = () => {
            f++;
            el.g.setAttribute("opacity", 0.25 + f * 0.15);
            if (f === 5) el.g.setAttribute("opacity", 1);
            else timeline.push({ at: tick + 1, fn: boot });
          };
          boot();
        },
      });
    });
  }

  return {
    destroy() {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      host.innerHTML = "";
    },
    setState(next) {
      const api = renderOffice(host, next, opts);
      return api;
    },
    focusRoom(id) {
      const r = ROOMS.find((x) => x.id === id);
      if (!r) return;
      zoom = 1;
      focus = r;
      applyTransform(reduced ? 1 : 4);
    },
    zoomOut() {
      zoom = 0;
      focus = null;
      applyTransform(reduced ? 1 : 4);
    },
    playReveal,
    ROOMS,
  };
}

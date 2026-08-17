/*
  THE OFFICE — open-plan cartoon HQ (v3 art direction, modelled on the
  virtual-HQ reference: one big floor, low thick walls, furniture
  clusters, named workers) rendered in the site's own branding: white
  floor with the grid-paper etched in, grey-tint walls, royal blue for
  everything alive, ink name pills, the halftone arrow inlaid in the
  floor. Vanilla, zero dependencies, SVG out, JSON in → same scene out.

  innerHTML below only ever CLEARS nodes (""), never inserts markup;
  all content is built via createElementNS. No untrusted HTML.
*/
import { MARK_GRID } from "../lib/halftone-data";

export const PAL = {
  page: "#FFFFFF",
  floor: "#FDFDFE",
  grid: "#E9EDF5",
  plinthL: "#EDEFF4",
  plinthR: "#DCE0E9",
  wallL: "#EEF0F5",
  wallR: "#D9DEE8",
  wallTop: "#F7F8FB",
  edge: "#C7CCD8",
  ink: "#0A0A0A",
  inkSoft: "#22262E",
  grey: "#A3A3A3",
  body: "#525252",
  accent: "var(--color-accent)",
  accentDeep: "#22458F",
  accentSoft: "rgba(43,85,176,0.14)",
  accentGlow: "rgba(43,85,176,0.07)",
  cream: "#F5E9C9",
  creamDeep: "#EAD9A8",
  green: "#9DB39A",
  greenDeep: "#7E9880",
  skinA: "#EFCFAE",
  skinB: "#B9885C",
  white: "#FFFFFF",
};

const NS = "http://www.w3.org/2000/svg";
const CX = 240;
const CY = 84;
const WT = 1.6; /* wall thickness */

/* World → screen. +X = (2,1), +Y = (-2,1), +Z = (0,-1). */
const iso = (x, y, z = 0) => [CX + (x - y) * 2, CY + x + y - z];

/* ── zones: the working sections. Same contract the rail uses. ────── */
const ZONES = [
  { id: "archive", name: "Archive", sys: "REACTIVATION", week: "WK 3", x: 3, y: 3, w: 24, d: 22 },
  { id: "boardroom", name: "Boardroom", sys: "SECOND BRAIN", week: "WK 1", x: 58, y: 3, w: 35, d: 24 },
  { id: "reception", name: "Reception", sys: "SPEED TO LEAD", week: "WK 2", x: 4, y: 30, w: 36, d: 23 },
  { id: "corner", name: "Corner Office", sys: "THE AI CEO", week: "WK 4", x: 62, y: 31, w: 31, d: 22 },
];

/* work flowing through the floor: entrance → reception → onwards */
const RUN_PATHS = [
  [[33, 55], [33, 44], [22, 44], [22, 38]],
  [[22, 38], [34, 30], [46, 26], [58, 22], [70, 18]],
  [[46, 26], [30, 18], [18, 12]],
  [[58, 22], [70, 34], [74, 40]],
];

/* ── svg helpers ─────────────────────────────────────────────────── */
function make(tag, attrs, parent) {
  const n = document.createElementNS(NS, tag);
  for (const k in attrs) n.setAttribute(k, attrs[k]);
  if (parent) parent.appendChild(n);
  return n;
}
const poly = (p, pts, f, extra = {}) =>
  make("polygon", { points: pts.map(([a, b]) => `${a},${b}`).join(" "), fill: f, ...extra }, p);
const line = (p, a, b, stroke, w = 1, extra = {}) =>
  make("line", { x1: a[0], y1: a[1], x2: b[0], y2: b[1], stroke, "stroke-width": w, "stroke-linecap": "round", ...extra }, p);
const circ = (p, cx, cy, r, f, extra = {}) => make("circle", { cx, cy, r, fill: f, ...extra }, p);
const rrect = (p, x, y, w, h, r, f, extra = {}) =>
  make("rect", { x, y, width: w, height: h, rx: r, fill: f, ...extra }, p);

/* Extruded cartoon box at world (x,y), footprint w×d, height h. */
function isoBox(p, x, y, w, d, h, c = {}) {
  const g = make("g", {}, p);
  poly(g, [iso(x, y + d, 0), iso(x + w, y + d, 0), iso(x + w, y + d, h), iso(x, y + d, h)], c.left || PAL.wallL);
  poly(g, [iso(x + w, y, 0), iso(x + w, y + d, 0), iso(x + w, y + d, h), iso(x + w, y, h)], c.right || PAL.wallR);
  poly(g, [iso(x, y, h), iso(x + w, y, h), iso(x + w, y + d, h), iso(x, y + d, h)], c.top || PAL.white, {
    stroke: c.stroke === "none" ? "none" : c.stroke || PAL.edge,
    "stroke-width": 0.5,
    "stroke-linejoin": "round",
  });
  return g;
}

function textEl(p, str, x, y, size, fill, extra = {}) {
  const t = make(
    "text",
    {
      x, y,
      "font-family": "var(--font-mono, ui-monospace, monospace)",
      "font-size": size,
      "letter-spacing": "0.08em",
      "font-weight": 700,
      fill,
      ...extra,
    },
    p
  );
  t.textContent = str;
  return t;
}

/* ── renderer ────────────────────────────────────────────────────── */
export function renderOffice(host, state, opts = {}) {
  const anim = new Map();
  const reg = (cls, el) => {
    if (!anim.has(cls)) anim.set(cls, []);
    anim.get(cls).push(el);
    return el;
  };
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  host.innerHTML = "";
  const svg = make("svg", {
    viewBox: "114 56 336 200",
    class: "office-svg",
    role: "img",
    "aria-label":
      "The Office: a cartoon open-plan headquarters. Each named worker is a system running.",
  });
  host.appendChild(svg);

  const defs = make("defs", {}, svg);
  const blur = make("filter", { id: "office-soft", x: "-40%", y: "-40%", width: "180%", height: "180%" }, defs);
  make("feGaussianBlur", { stdDeviation: 3 }, blur);
  const slabPts = [iso(0, 0), iso(96, 0), iso(96, 56), iso(0, 56)];
  const clip = make("clipPath", { id: "office-floor" }, defs);
  poly(clip, slabPts, "none");

  make("rect", { x: 0, y: 0, width: 580, height: 320, fill: PAL.page }, svg);
  const scene = make("g", { class: "office-scene" }, svg);

  /* soft cartoon shadow, then the slab */
  poly(scene, slabPts.map(([x, y]) => [x + 4, y + 8]), "rgba(20,30,60,0.14)", { filter: "url(#office-soft)" });
  poly(scene, [iso(0, 56, 0), iso(96, 56, 0), iso(96, 56, -3), iso(0, 56, -3)], PAL.plinthL);
  poly(scene, [iso(96, 0, 0), iso(96, 56, 0), iso(96, 56, -3), iso(96, 0, -3)], PAL.plinthR);
  poly(scene, slabPts, PAL.floor, { stroke: PAL.edge, "stroke-width": 0.8, "stroke-linejoin": "round" });

  /* the site's grid paper, etched into the floor */
  const gridG = make("g", { "clip-path": "url(#office-floor)" }, scene);
  for (let gx = 8; gx < 96; gx += 8) line(gridG, iso(gx, 0), iso(gx, 56), PAL.grid, 0.5);
  for (let gy = 8; gy < 56; gy += 8) line(gridG, iso(0, gy), iso(96, gy), PAL.grid, 0.5);

  /* halftone arrow mark inlaid in the open floor */
  const markG = make("g", { "clip-path": "url(#office-floor)" }, scene);
  const MS = 2;
  for (let r = 0; r < MARK_GRID.rows; r += MS) {
    for (let c = 0; c < MARK_GRID.cols; c += MS) {
      if (!MARK_GRID.cells[r * MARK_GRID.cols + c]) continue;
      const wx = 33 + (c / MS) * 1.05;
      const wy = 6 + (r / MS) * 0.82;
      const [sx, sy] = iso(wx, wy, 0);
      rrect(markG, sx - 0.9, sy - 0.55, 1.8, 1.1, 0.4, "rgba(43,85,176,0.09)");
    }
  }

  /* zone floor labels, etched */
  for (const z of ZONES) {
    const [lx, ly] = iso(z.x + z.w / 2, z.y + z.d - 2.4, 0);
    textEl(scene, z.name.toUpperCase(), lx, ly, 4.6, "#C9CEDA", { "text-anchor": "middle", "font-weight": 500 });
  }

  /* back walls with thickness (left run x=0, top run y=0) */
  isoBox(scene, 0, 0, WT, 56, 11, { left: PAL.wallL, right: PAL.wallR, top: PAL.wallTop });
  isoBox(scene, 0, 0, 96, WT, 14, { left: PAL.wallL, right: PAL.wallR, top: PAL.wallTop });

  /* 12 locked doors along the back wall's inner face */
  for (let i = 0; i < 12; i++) {
    const wx = 3 + i * 4.55;
    const g = make("g", { class: "office-door" }, scene);
    poly(g, [iso(wx, WT, 0), iso(wx + 3.3, WT, 0), iso(wx + 3.3, WT, 8.6), iso(wx, WT, 8.6)], PAL.wallR, {
      stroke: PAL.edge, "stroke-width": 0.45, "stroke-linejoin": "round",
    });
    const [hx, hy] = iso(wx + 2.6, WT, 4.2);
    reg("glint", circ(g, hx, hy, 0.7, PAL.accent, { opacity: 0 }));
  }

  /* boardroom wall screen: the live chart the brain keeps current */
  {
    const g = make("g", {}, scene);
    poly(g, [iso(64, WT, 4.5), iso(88, WT, 4.5), iso(88, WT, 12.5), iso(64, WT, 12.5)], PAL.white, {
      stroke: PAL.edge, "stroke-width": 0.6, "stroke-linejoin": "round",
    });
    for (let b = 0; b < 5; b++) {
      const bx = 66.5 + b * 4.4;
      const h = 2 + (b % 3) * 1.6;
      const [p1x, p1y] = iso(bx, WT, 5.6);
      const [p2x, p2y] = iso(bx + 2.6, WT, 5.6);
      reg("bars", make("polygon", {
        points: `${p1x},${p1y} ${p2x},${p2y} ${p2x},${p2y - h} ${p1x},${p1y - h}`,
        fill: b === 3 ? PAL.accent : "rgba(43,85,176,0.32)",
        "data-h": h,
      }, g));
    }
    const [tx, ty] = iso(86.5, WT, 11.2);
    reg("pulse", circ(g, tx, ty, 0.9, PAL.accent));
  }

  /* ── furniture + people, depth-sorted like a cartoon should be ── */
  const items = [];
  const place = (depth, zone, draw) => items.push({ depth, zone, draw });

  /* monitor: stand + panel drawn on the desk's face plane, so it sits
     ON the desk instead of towering from the floor */
  const monitor = (g, mx, myF, s = 1) => {
    const [b0x, b0y] = iso(mx, myF, 4);
    make("ellipse", { cx: b0x, cy: b0y, rx: 1.2 * s, ry: 0.5 * s, fill: PAL.inkSoft }, g);
    line(g, [b0x, b0y], [b0x, b0y - 1.1 * s], PAL.inkSoft, 0.7);
    poly(g, [iso(mx - 1.9 * s, myF, 5), iso(mx + 1.9 * s, myF, 5), iso(mx + 1.9 * s, myF, 5 + 2.4 * s), iso(mx - 1.9 * s, myF, 5 + 2.4 * s)], PAL.inkSoft, {
      stroke: PAL.ink, "stroke-width": 0.4, "stroke-linejoin": "round",
    });
    reg("screen", poly(g, [iso(mx - 1.62 * s, myF, 5.2), iso(mx + 1.62 * s, myF, 5.2), iso(mx + 1.62 * s, myF, 5 + 2.2 * s), iso(mx - 1.62 * s, myF, 5 + 2.2 * s)], PAL.accent, { opacity: 0.9 }));
  };

  const desk = (x, y, w = 8, d = 4.2, o = {}) => (g) => {
    isoBox(g, x, y, w, d, 4, { top: PAL.white });
    if (o.monitor !== false) monitor(g, x + w * 0.5, y + 1.4);
    if (o.papers) {
      const [px, py] = iso(x + 1.8, y + d - 1.2, 4);
      rrect(g, px - 1.5, py - 1.1, 3, 1.5, 0.4, PAL.white, { stroke: PAL.edge, "stroke-width": 0.45 });
    }
  };

  const chair = (x, y, back = "s") => (g) => {
    isoBox(g, x - 1.4, y - 1.4, 2.8, 2.8, 2.6, { top: PAL.accent, left: PAL.accentDeep, right: PAL.accentDeep, stroke: "none" });
    const b = {
      n: [x - 1.4, y - 1.9, 2.8, 0.7],
      s: [x - 1.4, y + 1.2, 2.8, 0.7],
      e: [x + 1.2, y - 1.4, 0.7, 2.8],
      w: [x - 1.9, y - 1.4, 0.7, 2.8],
    }[back];
    isoBox(g, b[0], b[1], b[2], b[3], 5.6, { top: PAL.accent, left: PAL.accentDeep, right: PAL.accentDeep, stroke: "none" });
  };

  const roundTable = (x, y, r) => (g) => {
    const [cx0, cy0] = iso(x, y, 0);
    const [cxT, cyT] = iso(x, y, 5);
    make("ellipse", { cx: cx0, cy: cy0 + 1, rx: r * 2.1, ry: r * 1.06, fill: "rgba(20,30,60,0.07)" }, g);
    make("path", {
      d: `M ${cxT - r * 2} ${cyT} A ${r * 2} ${r} 0 0 0 ${cxT + r * 2} ${cyT} L ${cx0 + r * 2} ${cy0} A ${r * 2} ${r} 0 0 1 ${cx0 - r * 2} ${cy0} Z`,
      fill: PAL.creamDeep,
    }, g);
    make("ellipse", { cx: cxT, cy: cyT, rx: r * 2, ry: r, fill: PAL.cream, stroke: PAL.edge, "stroke-width": 0.6 }, g);
    reg("pulse", circ(g, cxT, cyT - 0.4, 1, PAL.accent));
  };

  const sofa = (x, y, w) => (g) => {
    isoBox(g, x, y, w, 3.4, 3, { top: PAL.accent, left: PAL.accentDeep, right: PAL.accentDeep, stroke: "none" });
    isoBox(g, x, y - 1, w, 1.2, 5.4, { top: PAL.accent, left: PAL.accentDeep, right: PAL.accentDeep, stroke: "none" });
    isoBox(g, x - 1.1, y - 1, 1.3, 4.4, 4.2, { top: PAL.accent, left: PAL.accentDeep, right: PAL.accentDeep, stroke: "none" });
    isoBox(g, x + w - 0.2, y - 1, 1.3, 4.4, 4.2, { top: PAL.accent, left: PAL.accentDeep, right: PAL.accentDeep, stroke: "none" });
    line(g, iso(x + w / 3, y + 1.2, 3.1), iso(x + w / 3, y + 3.2, 3.1), PAL.accentDeep, 0.7);
    line(g, iso(x + (2 * w) / 3, y + 1.2, 3.1), iso(x + (2 * w) / 3, y + 3.2, 3.1), PAL.accentDeep, 0.7);
  };

  const lowTable = (x, y) => (g) => {
    isoBox(g, x, y, 4.6, 3, 2.2, { top: PAL.white });
    const [px, py] = iso(x + 2.3, y + 1.5, 2.2);
    circ(g, px, py, 1, PAL.accentSoft);
  };

  const pingpong = (x, y) => (g) => {
    isoBox(g, x, y, 9, 5, 3.4, { top: PAL.accent, left: PAL.accentDeep, right: PAL.accentDeep, stroke: "none" });
    line(g, iso(x + 4.5, y, 3.45), iso(x + 4.5, y + 5, 3.45), PAL.white, 0.8);
    line(g, iso(x, y + 2.5, 3.45), iso(x + 9, y + 2.5, 3.45), PAL.white, 0.45, { opacity: 0.8 });
  };

  const plant = (x, y) => (g) => {
    isoBox(g, x - 1, y - 1, 2, 2, 2.2, { top: PAL.accentDeep, left: PAL.accent, right: PAL.accentDeep, stroke: "none" });
    const [px, py] = iso(x, y, 2.2);
    circ(g, px - 1.4, py - 2.2, 1.7, PAL.greenDeep);
    circ(g, px + 1.3, py - 2.6, 1.9, PAL.green);
    circ(g, px - 0.1, py - 4.2, 1.6, PAL.green);
  };

  const cabinet = (x, y) => (g) => {
    isoBox(g, x, y, 3.4, 3.2, 8.6, {});
    /* drawer fronts live on the cabinet's face plane */
    for (let dz = 0; dz < 3; dz++) {
      const z0 = 1.6 + dz * 2.4;
      const el = poly(g, [iso(x + 0.4, y + 3.2, z0), iso(x + 3, y + 3.2, z0), iso(x + 3, y + 3.2, z0 + 1.5), iso(x + 0.4, y + 3.2, z0 + 1.5)], dz === 1 ? PAL.accent : PAL.wallR, {
        stroke: PAL.edge, "stroke-width": 0.35, "stroke-linejoin": "round",
      });
      if (dz === 1) reg("drawer", el);
    }
  };

  const rack = (x, y) => (g) => {
    isoBox(g, x, y, 3.6, 3, 11.5, { top: PAL.inkSoft, left: PAL.inkSoft, right: PAL.ink, stroke: "none" });
    for (let r = 0; r < 4; r++) {
      const [ax, ay] = iso(x + 3.6, y + 1, 2.6 + r * 2.4);
      reg("led", circ(g, ax + 0.7, ay + 0.6, 0.45, PAL.accent));
      circ(g, ax + 1.8, ay + 1.15, 0.45, "#3FDB7C", { opacity: 0.85 });
    }
  };

  const shelf = (x, y) => (g) => {
    isoBox(g, x, y, 3, 7, 9.4, {});
    /* book spines on the front face plane, one shelf line per row */
    const yF = y + 7;
    const COLS = [PAL.accent, PAL.creamDeep, PAL.accentDeep, PAL.wallR];
    for (let s = 0; s < 3; s++) {
      const z0 = 1.7 + s * 2.6;
      line(g, iso(x + 0.2, yF, z0 + 2.15), iso(x + 2.8, yF, z0 + 2.15), PAL.edge, 0.4);
      for (let k = 0; k < 3; k++) {
        const bx = x + 0.45 + k * 0.85;
        poly(g, [iso(bx, yF, z0), iso(bx + 0.6, yF, z0), iso(bx + 0.6, yF, z0 + 2), iso(bx, yF, z0 + 2)], COLS[(s + k) % 4]);
      }
    }
  };

  const rug = (x, y, w, d) => (g) => {
    const pts = [iso(x, y, 0.1), iso(x + w, y, 0.1), iso(x + w, y + d, 0.1), iso(x, y + d, 0.1)];
    poly(g, pts, PAL.accentGlow, { stroke: PAL.accentSoft, "stroke-width": 0.7, "stroke-linejoin": "round" });
  };

  const lamp = (x, y) => (g) => {
    const [bx, by] = iso(x, y, 0);
    make("ellipse", { cx: bx, cy: by, rx: 2, ry: 1, fill: PAL.wallR }, g);
    line(g, [bx, by], [bx, by - 10], PAL.inkSoft, 0.9);
    poly(g, [[bx - 2.4, by - 10], [bx + 2.4, by - 10], [bx + 1.6, by - 13.4], [bx - 1.6, by - 13.4]], PAL.creamDeep);
    reg("lamplight", make("ellipse", { cx: bx, cy: by - 9.2, rx: 3.4, ry: 1.5, fill: PAL.cream, opacity: 0.55 }, g));
  };

  const cooler = (x, y) => (g) => {
    isoBox(g, x - 1.1, y - 1, 2.2, 2, 5.6, {});
    const [px, py] = iso(x, y, 5.6);
    rrect(g, px - 1.1, py - 2.6, 2.2, 2.8, 0.9, PAL.accentSoft, { stroke: PAL.accent, "stroke-width": 0.5 });
  };

  /* little cartoon worker; the name pill is drawn in the overlay */
  const person = (x, y, o = {}) => (g) => {
    const s = o.scale || 1;
    const [px, py] = iso(x, y, 0);
    const wrap = make("g", { class: "office-person" }, g);
    make("ellipse", { cx: px, cy: py + 0.6, rx: 3 * s, ry: 1.1 * s, fill: "rgba(20,30,60,0.12)" }, wrap);
    const bob = make("g", {}, wrap);
    if (!o.seated) {
      rrect(bob, px - 1.5 * s, py - 3.2 * s, 1.25 * s, 3.2 * s, 0.6 * s, o.trousers || PAL.inkSoft);
      rrect(bob, px + 0.25 * s, py - 3.2 * s, 1.25 * s, 3.2 * s, 0.6 * s, o.trousers || PAL.inkSoft);
    }
    const bh = (o.seated ? 4.6 : 5.6) * s;
    const by = py - (o.seated ? 4.2 : 8.2) * s - bh + bh; /* body top offset below */
    const bodyTop = py - (o.seated ? 8.6 : 8.2) * s;
    rrect(bob, px - 2 * s, bodyTop, 4 * s, bh, 1.9 * s, o.shirt || PAL.accent);
    if (o.tie) rrect(bob, px - 0.45 * s, bodyTop + 0.7 * s, 0.9 * s, 2.6 * s, 0.4 * s, o.tie);
    circ(bob, px, bodyTop - 1.6 * s, 2.05 * s, o.skin || PAL.skinA);
    make("path", {
      d: `M ${px - 2.05 * s} ${bodyTop - 1.9 * s} a ${2.05 * s} ${2.05 * s} 0 0 1 ${4.1 * s} 0 Z`,
      fill: o.hair || PAL.ink,
    }, bob);
    reg("bob", bob);
    void by;
  };

  /* ARCHIVE — reactivation digs through the old list */
  place(9, "archive", (g) => rack(4, 4)(g));
  place(13, "archive", (g) => rack(4, 8.6)(g));
  place(17, "archive", (g) => cabinet(12, 4)(g));
  place(21, "archive", (g) => cabinet(16.4, 4)(g));
  place(25, "archive", (g) => cabinet(20.8, 4)(g));
  place(28, "archive", desk(10, 13, 8, 4.2, { papers: true }));
  place(34, "archive", chair(14, 19.6, "s"));
  place(35, "archive", person(19.5, 15.5, { shirt: PAL.accentDeep, skin: PAL.skinB, hair: PAL.inkSoft }));

  /* BOARDROOM — the second brain holds what the business knows */
  place(65, "boardroom", (g) => shelf(90.5, 4)(g));
  place(78, "boardroom", roundTable(74, 13, 4));
  place(81, "boardroom", chair(74, 6.8, "n"));
  place(80, "boardroom", chair(67.8, 11.6, "w"));
  place(97, "boardroom", chair(80.6, 16.2, "e"));
  place(88.5, "boardroom", person(70.6, 17.6, { shirt: PAL.accent }));
  place(88, "boardroom", person(79.2, 8.6, { seated: true, shirt: PAL.wallR, hair: PAL.skinB }));

  /* RECEPTION — speed to lead answers before anyone else */
  place(47, "reception", desk(8, 34, 10, 4.6, { papers: true }));
  place(43.5, "reception", person(10.5, 32.6, { shirt: PAL.accent, hair: PAL.inkSoft }));
  place(68, "reception", desk(24, 40, 8, 4.2));
  place(75, "reception", chair(28, 46.6, "s"));
  place(74.8, "reception", person(28, 46.4, { seated: true, shirt: PAL.accentDeep, skin: PAL.skinB }));
  place(56.5, "reception", (g) => plant(6, 50)(g));
  place(57, "reception", (g) => cooler(20.5, 36)(g));

  /* COMMONS — the cartoon office breathes */
  place(66, "commons", pingpong(34, 27));
  place(91, "commons", sofa(45, 42, 9));
  place(85.6, "commons", lowTable(47, 36.6));
  place(85, "commons", (g) => plant(57.5, 27.5)(g));
  place(92, "commons", (g) => plant(41.5, 50)(g));

  /* CORNER OFFICE — the AI CEO OS runs the whole floor */
  place(100, "corner", rug(66, 34, 22, 15));
  place(110, "corner", desk(72, 38, 10, 5, {}));
  place(111, "corner", (g) => {
    /* second monitor on the exec desk */
    monitor(g, 79.6, 39.6, 0.85);
  });
  place(112, "corner", chair(77, 36.2, "n"));
  place(117, "corner", person(70, 47, { scale: 1.12, shirt: PAL.ink, tie: PAL.accent, hair: PAL.inkSoft }));
  place(123, "corner", (g) => lamp(88, 35)(g));
  place(141, "corner", (g) => plant(90.5, 50.5)(g));

  /* front knee walls at the lip, entrance gap left open */
  place(400, null, (g) => {
    isoBox(g, 0, 54.4, 26, WT, 3.2, { top: PAL.wallTop });
    isoBox(g, 40, 54.4, 56, WT, 3.2, { top: PAL.wallTop });
    isoBox(g, 94.4, 0, WT, 54.4, 3.2, { top: PAL.wallTop });
    const [ex, ey] = iso(33, 56, 0);
    textEl(g, "IN", ex, ey + 6, 4.4, PAL.grey, { "text-anchor": "middle", "font-weight": 500 });
  });

  const litZone = (id) => ((state.rooms && state.rooms[id]) || {}).state === "lit";
  items.sort((a, b) => a.depth - b.depth);
  const zoneGroups = {};
  for (const it of items) {
    const g = make("g", it.zone ? { "data-zone": it.zone } : {}, scene);
    it.draw(g);
    if (it.zone && it.zone !== "commons" && !litZone(it.zone)) g.setAttribute("opacity", 0.45);
    if (it.zone) (zoneGroups[it.zone] = zoneGroups[it.zone] || []).push(g);
  }

  /* runner dots: work flowing between the sections */
  const runLayer = make("g", {}, scene);
  const runSamples = RUN_PATHS.map((pts) => {
    const s = [];
    for (let i = 0; i < pts.length - 1; i++) {
      const [x1, y1] = pts[i];
      const [x2, y2] = pts[i + 1];
      const n = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1)) * 2;
      for (let k = 0; k <= n; k++) s.push(iso(x1 + ((x2 - x1) * k) / n, y1 + ((y2 - y1) * k) / n, 0.4));
    }
    return s;
  });

  /* scan plaques */
  if (state.mode === "scan") {
    for (const z of ZONES) {
      const rs = (state.rooms && state.rooms[z.id]) || {};
      if (!rs.plaque) continue;
      const [px, py] = iso(z.x + z.w / 2, z.y + z.d / 2, 9);
      const g = make("g", {}, scene);
      const wtxt = rs.plaque.length * 3.1 + 8;
      rrect(g, px - wtxt / 2, py - 4, wtxt, 8, 1.6, PAL.white, { stroke: PAL.edge, "stroke-width": 0.6 });
      textEl(g, rs.plaque, px, py + 1.8, 4.6, PAL.body, { "text-anchor": "middle" });
    }
  }
  if (state.score) textEl(svg, `LIT ${state.score}`, 282, 250, 7, PAL.body, { "text-anchor": "middle" });

  /* ── name pills: the working sections, by name ─────────────────── */
  const pills = make("g", {}, scene);
  const PILLS = [
    { zone: "archive", label: "REACTIVATION", at: [19.5, 15.5], lift: 16 },
    { zone: "boardroom", label: "SECOND BRAIN", at: [70.6, 17.6], lift: 16 },
    { zone: "reception", label: "SPEED TO LEAD", at: [10.5, 32.6], lift: 16 },
    { zone: "corner", label: "THE AI CEO", at: [70, 47], lift: 18, boss: true },
  ];
  for (const p of PILLS) {
    const [ax, ay] = iso(p.at[0], p.at[1], 0);
    const w = p.label.length * 3.4 + 12;
    const g = make("g", { "data-zone": p.zone }, pills);
    const lit = litZone(p.zone);
    rrect(g, ax - w / 2, ay - p.lift - 8, w, 8, 2.4, p.boss ? PAL.accent : PAL.ink, { opacity: 0.94 });
    reg("pulse", circ(g, ax - w / 2 + 4.2, ay - p.lift - 4, 1.15, lit ? (p.boss ? PAL.white : "#3FDB7C") : PAL.grey));
    textEl(g, p.label, ax - w / 2 + 7.6, ay - p.lift - 2.4, 4.8, PAL.white);
    make("path", { d: `M ${ax - 1.7} ${ay - p.lift} l 1.7 2.3 1.7 -2.3 Z`, fill: p.boss ? PAL.accent : PAL.ink, opacity: 0.94 }, g);
    if (!lit) g.setAttribute("opacity", 0.55);
  }

  /* hover plate (chrome layer, outside the pan/zoom transform) */
  const plate = make("g", { class: "office-plate", opacity: 0 }, svg);

  /* ── interactions: hover wash + plate, stepped zoom, gentle pan ── */
  let zoom = 0, focus = null, panX = 0, panY = 0;
  const applyTransform = () => {
    const conf =
      zoom === 0
        ? { s: 1, tx: 0, ty: 0 }
        : (() => {
            const r = focus;
            const [fx, fy] = iso(r.x + r.w / 2, r.y + r.d / 2, 4);
            return { s: 1.85, tx: 282 - fx * 1.85, ty: 156 - fy * 1.85 };
          })();
    scene.style.transition = reduced ? "none" : "transform 0.45s cubic-bezier(0.22,1,0.36,1)";
    scene.style.transform = `translate(${conf.tx + panX}px,${conf.ty + panY}px) scale(${conf.s})`;
  };

  for (const z of ZONES) {
    const zonePts = [iso(z.x, z.y, 0.05), iso(z.x + z.w, z.y, 0.05), iso(z.x + z.w, z.y + z.d, 0.05), iso(z.x, z.y + z.d, 0.05)];
    const wash = poly(scene, zonePts, PAL.accent, { opacity: 0, "pointer-events": "none" });
    const hit = poly(scene, zonePts, "transparent", { style: "cursor:pointer" });
    hit.addEventListener("pointerenter", () => {
      wash.setAttribute("opacity", 0.06);
      plate.innerHTML = "";
      const label = `${z.name.toUpperCase()} · ${z.week} · ${z.sys} ${litZone(z.id) ? "RUNNING" : "OFF"}`;
      const wtxt = label.length * 4.1 + 15;
      const [hx0, hy0] = iso(z.x + z.w / 2, z.y, 16);
      const bx = Math.min(Math.max(hx0 - wtxt / 2, 118), 446 - wtxt);
      const by = Math.max(hy0 - 6, 60);
      rrect(plate, bx, by, wtxt, 11.5, 2.4, PAL.white, { stroke: PAL.edge, "stroke-width": 0.8 });
      circ(plate, bx + 5.5, by + 5.7, 1.4, litZone(z.id) ? PAL.accent : PAL.grey);
      textEl(plate, label, bx + 9.5, by + 7.6, 5, PAL.ink);
      plate.setAttribute("opacity", 1);
    });
    hit.addEventListener("pointerleave", () => {
      wash.setAttribute("opacity", 0);
      plate.setAttribute("opacity", 0);
    });
    hit.addEventListener("click", (e) => {
      e.stopPropagation();
      if (zoom === 1 && focus === z) { zoom = 0; focus = null; }
      else { zoom = 1; focus = z; }
      applyTransform();
      if (opts.onSelect) opts.onSelect(zoom === 1 ? z.id : null);
    });
  }
  svg.addEventListener("click", () => {
    if (zoom !== 0) {
      zoom = 0; focus = null;
      applyTransform();
      if (opts.onSelect) opts.onSelect(null);
    }
  });

  let dragging = false, dragStart = null;
  svg.addEventListener("pointerdown", (e) => {
    if (zoom !== 0) return;
    dragging = true;
    dragStart = [e.clientX - panX, e.clientY - panY];
  });
  const onMove = (e) => {
    if (!dragging) return;
    panX = Math.max(-46, Math.min(46, e.clientX - dragStart[0]));
    panY = Math.max(-24, Math.min(24, e.clientY - dragStart[1]));
    scene.style.transition = "none";
    scene.style.transform = `translate(${panX}px,${panY}px)`;
  };
  const onUp = () => {
    if (!dragging) return;
    dragging = false;
    panX = 0; panY = 0;
    applyTransform();
  };
  window.addEventListener("pointermove", onMove);
  window.addEventListener("pointerup", onUp);

  /* ── clock: 30fps, smooth cartoon motion ───────────────────────── */
  let tick = 0, raf = null, last = 0;
  const runners = [];

  const drives = {
    pulse: (els) => els.forEach((el, i) => el.setAttribute("opacity", 0.55 + 0.45 * Math.sin((tick + i * 23) / 14))),
    screen: (els) => els.forEach((el, i) => el.setAttribute("opacity", 0.8 + 0.16 * Math.sin((tick + i * 31) / 9))),
    led: (els) => els.forEach((el, i) => el.setAttribute("opacity", (tick + i * 37) % 90 < 62 ? 1 : 0.25)),
    glint: (els) => els.forEach((el, i) => {
      const period = 240 + (i % 5) * 70;
      const ph = (tick + i * 53) % period;
      el.setAttribute("opacity", ph < 9 ? 1 - ph / 9 : 0);
    }),
    bob: (els) => els.forEach((el, i) => el.setAttribute("transform", `translate(0,${0.45 * Math.sin((tick + i * 29) / 21)})`)),
    lamplight: (els) => els.forEach((el) => el.setAttribute("opacity", 0.45 + 0.12 * Math.sin(tick / 26))),
    drawer: (els) => els.forEach((el, i) => {
      const ph = (tick + i * 60) % 220;
      el.setAttribute("transform", ph < 24 ? `translate(0,${Math.sin((ph / 24) * Math.PI) * 1.8})` : "");
    }),
    bars: (els) => els.forEach((el, i) => {
      if ((tick + i * 45) % 210 !== 0) return;
      const base = parseFloat(el.getAttribute("data-h"));
      const h = base + ((tick / 30 + i) % 3) * 1.2;
      const pts = el.getAttribute("points").split(" ").map((p) => p.split(",").map(Number));
      pts[2][1] = pts[1][1] - h;
      pts[3][1] = pts[0][1] - h;
      el.setAttribute("points", pts.map((p) => p.join(",")).join(" "));
    }),
  };

  function spawnRunner() {
    const path = runSamples[Math.floor(Math.random() * runSamples.length)];
    const el = circ(runLayer, -9, -9, 1.3, PAL.accent);
    runners.push({ el, path, i: 0 });
  }
  function stepRunners() {
    for (let i = runners.length - 1; i >= 0; i--) {
      const r = runners[i];
      r.i += 1.15;
      const idx = Math.floor(r.i);
      if (idx >= r.path.length) {
        r.el.remove();
        runners.splice(i, 1);
        continue;
      }
      r.el.setAttribute("cx", r.path[idx][0]);
      r.el.setAttribute("cy", r.path[idx][1]);
    }
    if (tick % 85 === 0) spawnRunner();
  }

  function frame(now) {
    raf = requestAnimationFrame(frame);
    if (now - last < 33) return;
    last = now;
    tick++;
    for (const [cls, els] of anim) if (drives[cls]) drives[cls](els);
    stepRunners();
  }
  if (!reduced) raf = requestAnimationFrame(frame);

  function playReveal() {
    const order = ["boardroom", "reception", "archive", "corner"];
    order.forEach((id, i) => {
      (zoneGroups[id] || []).forEach((g) => {
        g.style.transition = `opacity 0.5s ease-out ${0.35 + i * 0.4}s`;
        g.setAttribute("opacity", 1);
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
      return renderOffice(host, next, opts);
    },
    focusRoom(id) {
      const z = ZONES.find((x) => x.id === id);
      if (!z) return;
      zoom = 1; focus = z;
      applyTransform();
    },
    zoomOut() {
      zoom = 0; focus = null;
      applyTransform();
    },
    playReveal,
    ROOMS: ZONES,
  };
}

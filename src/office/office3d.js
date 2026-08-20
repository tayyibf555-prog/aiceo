/*
  THE OFFICE — real-3D cartoon HQ (v4 art direction, three.js).
  Same floorplan, zones and contract as the SVG engine (office.js),
  which stays as the no-WebGL fallback. Orthographic iso camera,
  rounded cartoon geometry, soft shadows, emissive screens, the site's
  grid paper and halftone mark baked into the floor texture, and the
  four systems as named workers with DOM pills tracking their heads.

  All DOM below is built with createElement/textContent; innerHTML is
  only ever used to CLEAR nodes. No untrusted HTML.
*/
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { MARK_GRID } from "../lib/halftone-data";

/* World: x 0..96 (screen lower-right), z 0..56 (screen lower-left), y up. */
const ZONES = [
  { id: "archive", name: "Archive", sys: "REACTIVATION", week: "WK 3", x: 3, z: 3, w: 24, d: 22 },
  { id: "boardroom", name: "Boardroom", sys: "SECOND BRAIN", week: "WK 1", x: 58, z: 3, w: 35, d: 24 },
  { id: "reception", name: "Reception", sys: "SPEED TO LEAD", week: "WK 2", x: 4, z: 30, w: 36, d: 23 },
  { id: "corner", name: "Corner Office", sys: "THE AI CEO", week: "WK 4", x: 62, z: 31, w: 31, d: 22 },
];

const RUN_PATHS = [
  [[33, 55], [33, 44], [22, 44], [22, 38]],
  [[22, 38], [34, 30], [46, 26], [58, 22], [70, 18]],
  [[46, 26], [30, 18], [18, 12]],
  [[58, 22], [70, 34], [74, 40]],
];

const PILLS = [
  { zone: "archive", label: "REACTIVATION", at: [19.5, 15.5], h: 13 },
  { zone: "boardroom", label: "SECOND BRAIN", at: [70.6, 17.6], h: 13 },
  { zone: "reception", label: "SPEED TO LEAD", at: [10.5, 32.6], h: 13 },
  { zone: "corner", label: "THE AI CEO", at: [70, 47], h: 14.6, boss: true },
];

function cssColor(varName, fallback) {
  if (typeof window === "undefined") return fallback;
  const v = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  return v || fallback;
}

export function renderOffice(host, state, opts = {}) {
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const ACCENT = cssColor("--color-accent", "#2b55b0");
  const C = {
    accent: new THREE.Color(ACCENT),
    accentDeep: new THREE.Color("#22458f"),
    white: new THREE.Color("#ffffff"),
    floorWhite: new THREE.Color("#fdfdfe"),
    wall: new THREE.Color("#e9ecf3"),
    wallDeep: new THREE.Color("#d9dee8"),
    ink: new THREE.Color("#171a20"),
    inkSoft: new THREE.Color("#2a2f38"),
    cream: new THREE.Color("#f5e9c9"),
    creamDeep: new THREE.Color("#ead9a8"),
    green: new THREE.Color("#9db39a"),
    greenDeep: new THREE.Color("#7e9880"),
    skinA: new THREE.Color("#efcfae"),
    skinB: new THREE.Color("#b9885c"),
    hairBrown: new THREE.Color("#4a3728"),
    hairLight: new THREE.Color("#8a6440"),
    grey: new THREE.Color("#a3a3a3"),
  };
  const fontStack =
    (typeof window !== "undefined" &&
      getComputedStyle(document.body).getPropertyValue("--font-mono").trim()) ||
    "ui-monospace, monospace";

  host.innerHTML = "";
  host.style.position = "relative";

  /* renderer */
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  } catch {
    return null; /* caller falls back to the SVG engine */
  }
  renderer.setClearColor(0xffffff, 0);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  host.appendChild(renderer.domElement);
  renderer.domElement.style.display = "block";
  renderer.domElement.style.width = "100%";
  renderer.domElement.style.touchAction = "pan-y";

  const overlay = document.createElement("div");
  Object.assign(overlay.style, {
    position: "absolute", inset: "0", pointerEvents: "none", overflow: "hidden",
  });
  host.appendChild(overlay);

  const scene = new THREE.Scene();
  const CENTER = new THREE.Vector3(48, 0, 26);
  const camDir = new THREE.Vector3(1, 0.85, 1).normalize();

  const camera = new THREE.OrthographicCamera(-66, 66, 40, -40, 1, 600);
  camera.up.set(0, 1, 0);

  /* lights */
  scene.add(new THREE.HemisphereLight(0xffffff, 0xdde3ee, 1.25));
  const dir = new THREE.DirectionalLight(0xffffff, 1.55);
  dir.position.set(-30, 95, 10);
  dir.target.position.copy(CENTER);
  dir.castShadow = true;
  dir.shadow.mapSize.set(2048, 2048);
  dir.shadow.camera.left = -85;
  dir.shadow.camera.right = 85;
  dir.shadow.camera.top = 85;
  dir.shadow.camera.bottom = -85;
  dir.shadow.camera.far = 300;
  dir.shadow.bias = -0.0004;
  dir.shadow.normalBias = 0.5;
  scene.add(dir, dir.target);
  /* fill from the viewer side so wall faces stay light, no shadows */
  const fill = new THREE.DirectionalLight(0xffffff, 0.45);
  fill.position.set(120, 50, 130);
  scene.add(fill);

  /* material helper: fresh per call so zones can be dimmed safely */
  const mat = (color, o = {}) =>
    new THREE.MeshStandardMaterial({
      color,
      roughness: o.rough ?? 0.92,
      metalness: 0,
      emissive: o.emissive ?? 0x000000,
      emissiveIntensity: o.emissiveIntensity ?? 1,
      transparent: o.opacity !== undefined,
      opacity: o.opacity ?? 1,
    });

  const anim = { screens: [], leds: [], glints: [], bobs: [], bars: [], lamp: null };

  const box = (parent, w, h, d, color, o = {}) => {
    const r = Math.min(o.radius ?? 0.28, w / 2.01, h / 2.01, d / 2.01);
    const geo = new RoundedBoxGeometry(w, h, d, 2, r);
    const m = new THREE.Mesh(geo, o.material || mat(color, o));
    m.castShadow = o.cast !== false;
    m.receiveShadow = true;
    parent.add(m);
    return m;
  };

  /* ── ground + slab + floor texture ─────────────────────────────── */
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(320, 240),
    new THREE.ShadowMaterial({ opacity: 0.13 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.set(48, -3.02, 28);
  ground.receiveShadow = true;
  scene.add(ground);

  const plinth = box(scene, 96, 3, 56, C.wall, { radius: 0.5 });
  plinth.position.set(48, -1.5, 28);

  const floorCanvas = document.createElement("canvas");
  floorCanvas.width = 1152;
  floorCanvas.height = 672;
  {
    const ctx = floorCanvas.getContext("2d");
    const PX = 12; /* px per world unit */
    ctx.fillStyle = "#fdfdfe";
    ctx.fillRect(0, 0, 1152, 672);
    ctx.strokeStyle = "#e9edf5";
    ctx.lineWidth = 2;
    for (let gx = 8; gx < 96; gx += 8) {
      ctx.beginPath(); ctx.moveTo(gx * PX, 0); ctx.lineTo(gx * PX, 672); ctx.stroke();
    }
    for (let gz = 8; gz < 56; gz += 8) {
      ctx.beginPath(); ctx.moveTo(0, gz * PX); ctx.lineTo(1152, gz * PX); ctx.stroke();
    }
    /* halftone arrow inlay: the brand mark, properly blue */
    ctx.fillStyle = "rgba(43,85,176,0.32)";
    const MS = 2;
    for (let r = 0; r < MARK_GRID.rows; r += MS) {
      for (let c = 0; c < MARK_GRID.cols; c += MS) {
        if (!MARK_GRID.cells[r * MARK_GRID.cols + c]) continue;
        const wx = (33 + (c / MS) * 1.05) * PX;
        const wz = (6 + (r / MS) * 0.82) * PX;
        ctx.beginPath();
        ctx.roundRect(wx, wz, 9, 7, 2.5);
        ctx.fill();
      }
    }
    /* zone labels etched into the floor */
    ctx.fillStyle = "#c2c9d8";
    ctx.font = `600 30px ${fontStack}`;
    ctx.textAlign = "center";
    for (const z of ZONES) {
      ctx.fillText(
        z.name.toUpperCase().split("").join(" "),
        (z.x + z.w / 2) * PX,
        (z.z + z.d - 2) * PX
      );
    }
  }
  const floorTex = new THREE.CanvasTexture(floorCanvas);
  floorTex.anisotropy = 4;
  floorTex.colorSpace = THREE.SRGBColorSpace;
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(96, 56),
    new THREE.MeshStandardMaterial({ map: floorTex, roughness: 0.95 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(48, 0.02, 28);
  floor.receiveShadow = true;
  scene.add(floor);

  /* ── walls, doors, wall screen ─────────────────────────────────── */
  const structure = new THREE.Group();
  scene.add(structure);
  const backWall = box(structure, 96.6, 14, 1.6, C.wall, { radius: 0.4 });
  backWall.position.set(47.9, 7, 0.8);
  const leftWall = box(structure, 1.6, 11, 56.6, C.wall, { radius: 0.4 });
  leftWall.position.set(0.8, 5.5, 28.1);
  /* front knee walls with an entrance gap */
  const knee1 = box(structure, 26, 3.2, 1.6, C.wall, { radius: 0.4 });
  knee1.position.set(13, 1.6, 55.2);
  const knee2 = box(structure, 56, 3.2, 1.6, C.wall, { radius: 0.4 });
  knee2.position.set(68, 1.6, 55.2);
  const knee3 = box(structure, 1.6, 3.2, 56, C.wall, { radius: 0.4 });
  knee3.position.set(95.2, 1.6, 28);

  for (let i = 0; i < 12; i++) {
    const dx = 3 + i * 4.55 + 1.65;
    const door = box(structure, 3.3, 8.6, 0.5, C.wallDeep, { radius: 0.22, cast: false });
    door.position.set(dx, 4.3, 1.85);
    const knob = new THREE.Mesh(
      new THREE.SphereGeometry(0.26, 10, 10),
      mat("#b9c0cf", { emissive: C.accent, emissiveIntensity: 0 })
    );
    knob.position.set(dx + 1.05, 4.1, 2.2);
    structure.add(knob);
    anim.glints.push(knob);
  }

  /* boardroom wall screen with live bars */
  const board = box(structure, 24, 8, 0.5, C.white, { radius: 0.3, cast: false });
  board.position.set(76, 8.4, 1.9);
  for (let b = 0; b < 5; b++) {
    const h = 2 + (b % 3) * 1.5;
    const geo = new THREE.BoxGeometry(2.4, 1, 0.3);
    geo.translate(0, 0.5, 0); /* scale bars from their base */
    const bar = new THREE.Mesh(
      geo,
      mat(b === 3 ? C.accent : C.accent.clone().lerp(C.white, 0.25), {
        emissive: C.accent,
        emissiveIntensity: b === 3 ? 0.6 : 0.2,
      })
    );
    bar.position.set(67.6 + b * 4.2, 5.2, 2.2);
    bar.scale.y = h;
    structure.add(bar);
    anim.bars.push({ mesh: bar, base: h });
  }
  const boardDot = new THREE.Mesh(
    new THREE.SphereGeometry(0.35, 10, 10),
    mat(C.accent, { emissive: C.accent, emissiveIntensity: 1 })
  );
  boardDot.position.set(86.4, 11.2, 2.2);
  structure.add(boardDot);
  anim.leds.push(boardDot);

  /* ── furniture helpers ─────────────────────────────────────────── */
  const zoneGroups = {};
  const zg = (id) => {
    if (!zoneGroups[id]) {
      zoneGroups[id] = new THREE.Group();
      scene.add(zoneGroups[id]);
    }
    return zoneGroups[id];
  };

  const monitor = (parent, x, z, s = 1, rotY = 0) => {
    const g = new THREE.Group();
    g.position.set(x, 0, z);
    g.rotation.y = rotY;
    const base = box(g, 1.6 * s, 0.35, 1.1 * s, C.inkSoft, { radius: 0.12 });
    base.position.y = 3.8;
    const neck = box(g, 0.4, 1.2, 0.4, C.inkSoft, { radius: 0.1 });
    neck.position.y = 4.4;
    const panel = box(g, 3.9 * s, 2.6 * s, 0.3, C.inkSoft, { radius: 0.12 });
    panel.position.y = 5.9 * s;
    const screen = new THREE.Mesh(
      new THREE.PlaneGeometry(3.4 * s, 2.1 * s),
      mat(C.accent, { emissive: C.accent, emissiveIntensity: 0.85, rough: 0.4 })
    );
    screen.position.set(0, 5.9 * s, 0.17);
    g.add(screen);
    anim.screens.push(screen);
    parent.add(g);
    return g;
  };

  const desk = (parent, x, z, w = 8, d = 4.2, o = {}) => {
    const g = new THREE.Group();
    g.position.set(x + w / 2, 0, z + d / 2);
    const top = box(g, w, 0.8, d, C.white, { radius: 0.3 });
    top.position.y = 3.4;
    for (const [lx, lz] of [[-w / 2 + 0.7, -d / 2 + 0.7], [w / 2 - 0.7, -d / 2 + 0.7], [-w / 2 + 0.7, d / 2 - 0.7], [w / 2 - 0.7, d / 2 - 0.7]]) {
      const leg = box(g, 0.55, 3, 0.55, C.wallDeep, { radius: 0.12 });
      leg.position.set(lx, 1.5, lz);
    }
    if (o.monitor !== false) monitor(g, 0, -d / 2 + 1.3, o.ms ?? 1);
    if (o.papers) {
      const p = box(g, 2.4, 0.3, 1.7, C.white, { radius: 0.08 });
      p.position.set(-w / 2 + 2, 3.95, d / 2 - 1.4);
    }
    parent.add(g);
    return g;
  };

  const chair = (parent, x, z, rotY = 0) => {
    const g = new THREE.Group();
    g.position.set(x, 0, z);
    g.rotation.y = rotY;
    const seat = box(g, 2.9, 0.7, 2.9, C.accent, { radius: 0.3 });
    seat.position.y = 2.4;
    const back = box(g, 2.9, 3.6, 0.6, C.accent, { radius: 0.28 });
    back.position.set(0, 4.4, -1.35);
    const post = box(g, 0.45, 2.2, 0.45, C.inkSoft, { radius: 0.1 });
    post.position.y = 1.1;
    const foot = box(g, 2, 0.35, 2, C.inkSoft, { radius: 0.15 });
    foot.position.y = 0.18;
    parent.add(g);
    return g;
  };

  const roundTable = (parent, x, z, r = 4) => {
    const g = new THREE.Group();
    g.position.set(x, 0, z);
    const top = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 0.8, 36), mat(C.cream, { rough: 0.85 }));
    top.position.y = 4.4;
    top.castShadow = true;
    const rim = new THREE.Mesh(new THREE.CylinderGeometry(r - 0.01, r - 0.01, 0.18, 36), mat(C.creamDeep));
    rim.position.y = 3.95;
    const col = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.7, 4, 14), mat(C.wallDeep));
    col.position.y = 2;
    col.castShadow = true;
    const base = new THREE.Mesh(new THREE.CylinderGeometry(1.7, 1.9, 0.4, 20), mat(C.wallDeep));
    base.position.y = 0.2;
    g.add(top, rim, col, base);
    parent.add(g);
    return g;
  };

  const sofa = (parent, x, z, w = 9) => {
    const g = new THREE.Group();
    g.position.set(x + w / 2, 0, z + 1.7);
    const seat = box(g, w, 1.9, 3.4, C.accent, { radius: 0.5 });
    seat.position.y = 1.4;
    const back = box(g, w, 3.2, 1.1, C.accent, { radius: 0.45 });
    back.position.set(0, 2.8, -1.6);
    for (const s of [-1, 1]) {
      const arm = box(g, 1.2, 2.6, 4.2, C.accent, { radius: 0.45 });
      arm.position.set(s * (w / 2 + 0.35), 1.7, -0.2);
    }
    parent.add(g);
    return g;
  };

  const pingpong = (parent, x, z) => {
    const g = new THREE.Group();
    g.position.set(x + 4.5, 0, z + 2.5);
    const top = box(g, 9, 0.5, 5, C.accent, { radius: 0.2 });
    top.position.y = 3;
    const lineM = box(g, 0.18, 0.06, 5, C.white, { cast: false, radius: 0.02 });
    lineM.position.y = 3.29;
    const net = box(g, 0.1, 0.9, 5.3, C.white, { cast: false, radius: 0.04, opacity: 0.9 });
    net.position.y = 3.7;
    for (const [sx, sz] of [[-3.6, -1.9], [3.6, -1.9], [-3.6, 1.9], [3.6, 1.9]]) {
      const leg = box(g, 0.5, 2.8, 0.5, C.wallDeep, { radius: 0.1 });
      leg.position.set(sx, 1.4, sz);
    }
    parent.add(g);
    return g;
  };

  const plant = (parent, x, z, s = 1) => {
    const g = new THREE.Group();
    g.position.set(x, 0, z);
    const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.95 * s, 0.75 * s, 1.9 * s, 12), mat(C.accentDeep));
    pot.position.y = 0.95 * s;
    pot.castShadow = true;
    g.add(pot);
    const blobs = [
      [0, 3.4, 0, 1.65], [-1, 2.6, 0.3, 1.25], [0.9, 2.8, -0.3, 1.35],
    ];
    for (const [bx, by, bz, br] of blobs) {
      const leaf = new THREE.Mesh(
        new THREE.SphereGeometry(br * s, 12, 12),
        mat(Math.abs(bx) > 0.5 ? C.greenDeep : C.green)
      );
      leaf.position.set(bx * s, by * s, bz * s);
      leaf.castShadow = true;
      g.add(leaf);
    }
    parent.add(g);
    return g;
  };

  const cabinet = (parent, x, z) => {
    const g = new THREE.Group();
    g.position.set(x + 1.7, 0, z + 1.6);
    const bodyC = box(g, 3.4, 8.6, 3.2, C.white, { radius: 0.3 });
    bodyC.position.y = 4.3;
    for (let i = 0; i < 3; i++) {
      const front = box(g, 2.6, 1.7, 0.25, i === 1 ? C.accent : C.wallDeep, { radius: 0.15, cast: false });
      front.position.set(0, 2 + i * 2.5, 1.65);
    }
    parent.add(g);
    return g;
  };

  const rack = (parent, x, z) => {
    const g = new THREE.Group();
    g.position.set(x + 1.8, 0, z + 1.5);
    const bodyR = box(g, 3.6, 11.5, 3, C.ink, { radius: 0.3, rough: 0.7 });
    bodyR.position.y = 5.75;
    for (let r = 0; r < 4; r++) {
      const ledA = new THREE.Mesh(new THREE.SphereGeometry(0.22, 8, 8), mat(C.accent, { emissive: C.accent, emissiveIntensity: 1 }));
      ledA.position.set(-0.7, 2.4 + r * 2.4, 1.55);
      const ledB = new THREE.Mesh(new THREE.SphereGeometry(0.22, 8, 8), mat("#3fdb7c", { emissive: "#3fdb7c", emissiveIntensity: 0.9 }));
      ledB.position.set(0.35, 2.4 + r * 2.4, 1.55);
      g.add(ledA, ledB);
      anim.leds.push(ledA);
    }
    parent.add(g);
    return g;
  };

  const bookcase = (parent, x, z) => {
    const g = new THREE.Group();
    g.position.set(x, 0, z);
    const bodyB = box(g, 7, 9.4, 2.4, C.white, { radius: 0.3 });
    bodyB.position.y = 4.7;
    const cols = [C.accent, C.creamDeep, C.accentDeep, C.wallDeep];
    for (let s = 0; s < 3; s++) {
      for (let k = 0; k < 4; k++) {
        const b = box(g, 1, 2, 0.5, cols[(s + k) % 4], { radius: 0.08, cast: false });
        b.position.set(-2.2 + k * 1.5, 2 + s * 2.7, 1.25);
      }
    }
    parent.add(g);
    return g;
  };

  const lamp = (parent, x, z) => {
    const g = new THREE.Group();
    g.position.set(x, 0, z);
    const base = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.5, 0.4, 14), mat(C.wallDeep));
    base.position.y = 0.2;
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 9, 8), mat(C.inkSoft));
    pole.position.y = 4.7;
    const shade = new THREE.Mesh(
      new THREE.CylinderGeometry(1.4, 2.2, 2.6, 14, 1, true),
      mat(C.creamDeep, { rough: 0.7 })
    );
    shade.material.side = THREE.DoubleSide;
    shade.position.y = 9.6;
    shade.castShadow = true;
    const bulb = new THREE.PointLight(0xffe0b0, 60, 26, 2);
    bulb.position.y = 9;
    g.add(base, pole, shade, bulb);
    anim.lamp = bulb;
    parent.add(g);
    return g;
  };

  const cooler = (parent, x, z) => {
    const g = new THREE.Group();
    g.position.set(x, 0, z);
    const bodyW = box(g, 2.2, 5.2, 2, C.white, { radius: 0.3 });
    bodyW.position.y = 2.6;
    const bottle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.85, 0.95, 2.3, 12),
      mat(C.accent, { opacity: 0.45, rough: 0.3 })
    );
    bottle.position.y = 6.3;
    bottle.castShadow = true;
    g.add(bottle);
    parent.add(g);
    return g;
  };

  const rug = (parent, x, z, w, d) => {
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(w, d),
      mat(C.accent, { opacity: 0.08, rough: 1 })
    );
    m.rotation.x = -Math.PI / 2;
    m.position.set(x + w / 2, 0.06, z + d / 2);
    m.receiveShadow = true;
    parent.add(m);
    return m;
  };

  /* little cartoon worker, deliberately faceless: silhouette, colour
     blocking, pose and hair do all the talking. o.pose "work" puts the
     arms forward over a desk; o.seated bends real legs onto a chair. */
  const person = (parent, x, z, o = {}) => {
    const s = o.scale || 1;
    const g = new THREE.Group();
    g.position.set(x, 0, z);
    if (o.rotY) g.rotation.y = o.rotY;
    const inner = new THREE.Group();
    g.add(inner);
    const shirt = o.shirt || C.accent;
    const trousers = o.trousers || C.inkSoft;
    const skin = o.skin || C.skinA;
    const hairC = o.hair || C.ink;
    const seated = !!o.seated;

    const cap = (r, len, color, rough) => {
      const m = new THREE.Mesh(new THREE.CapsuleGeometry(r, len, 4, 10), mat(color, { rough: rough ?? 0.9 }));
      m.castShadow = true;
      inner.add(m);
      return m;
    };
    const sph = (r, color, rough) => {
      const m = new THREE.Mesh(new THREE.SphereGeometry(r, 18, 16), mat(color, { rough: rough ?? 0.85 }));
      m.castShadow = true;
      inner.add(m);
      return m;
    };
    const shoe = (lx, lz = 0) => {
      const m = box(inner, 0.9 * s, 0.55 * s, 1.4 * s, C.ink, { radius: 0.2 });
      m.position.set(lx * s, 0.28 * s, (lz + 0.18) * s);
      return m;
    };

    let hipY;
    if (!seated) {
      shoe(-0.6);
      shoe(0.6);
      for (const lx of [-0.58, 0.58]) {
        const leg = cap(0.46 * s, 2.1 * s, trousers);
        leg.position.set(lx * s, 2.15 * s, 0);
      }
      hipY = 3.4;
    } else {
      /* thighs forward, shins down: actually sitting on the chair */
      for (const lx of [-0.58, 0.58]) {
        const thigh = cap(0.48 * s, 1.4 * s, trousers);
        thigh.rotation.x = Math.PI / 2;
        thigh.position.set(lx * s, 2.85 * s, 1.05 * s);
        const shin = cap(0.4 * s, 1.3 * s, trousers);
        shin.position.set(lx * s, 1.3 * s, 1.95 * s);
        shoe(lx, 2.0);
      }
      hipY = 2.95;
    }

    /* torso with shoulders, and a collar in a deeper shade */
    const torso = cap(1.32 * s, 2.6 * s, shirt);
    torso.scale.set(1.18, 1, 0.9);
    torso.position.y = (hipY + 2.05) * s;
    const collarCol =
      o.collar === "white" ? C.white : shirt.clone().lerp(C.ink, 0.28);
    const collar = new THREE.Mesh(
      new THREE.CylinderGeometry(1.02 * s, 1.14 * s, 0.42 * s, 16),
      mat(collarCol)
    );
    collar.position.y = (hipY + 3.95) * s;
    collar.castShadow = true;
    inner.add(collar);

    /* arms with skin-tone hands; "work" pose reaches over the desk */
    for (const side of [-1, 1]) {
      const arm = cap(0.4 * s, 1.9 * s, shirt);
      const hand = sph(0.42 * s, skin, 0.75);
      if (o.pose === "work") {
        arm.rotation.x = -1.12;
        arm.position.set(side * 1.6 * s, (hipY + 2.6) * s, 0.95 * s);
        hand.position.set(side * 1.6 * s, (hipY + 2.05) * s, 2.05 * s);
      } else {
        arm.rotation.z = side * 0.14;
        arm.position.set(side * 1.82 * s, (hipY + 1.55) * s, 0);
        hand.position.set(side * 2 * s, (hipY + 0.25) * s, 0);
      }
    }

    if (o.tie) {
      const knot = box(inner, 0.52 * s, 0.42 * s, 0.24, o.tie, { radius: 0.1, cast: false });
      knot.position.set(0, (hipY + 3.68) * s, 1.22 * s);
      const tie = box(inner, 0.56 * s, 1.9 * s, 0.22, o.tie, { radius: 0.12, cast: false });
      tie.position.set(0, (hipY + 2.5) * s, 1.27 * s);
      tie.rotation.x = 0.09;
    }

    /* neck + faceless head */
    const neck = new THREE.Mesh(
      new THREE.CylinderGeometry(0.5 * s, 0.56 * s, 0.6 * s, 12),
      mat(skin, { rough: 0.75 })
    );
    neck.position.y = (hipY + 4.32) * s;
    inner.add(neck);
    const headY = hipY + 5.8;
    const head = sph(1.6 * s, skin, 0.72);
    head.position.y = headY * s;

    /* hair does the characterisation */
    const hs = o.hairStyle || "crop";
    const hairCap = new THREE.Mesh(
      new THREE.SphereGeometry(1.68 * s, 18, 12, 0, Math.PI * 2, 0, Math.PI * 0.52),
      mat(hairC, { rough: 0.92 })
    );
    hairCap.position.y = (headY + 0.24) * s;
    hairCap.castShadow = true;
    inner.add(hairCap);
    if (hs === "part") {
      const fringe = box(inner, 1.8 * s, 0.5 * s, 0.55 * s, hairC, { radius: 0.18, cast: false });
      fringe.position.set(0.3 * s, (headY + 0.92) * s, 1.22 * s);
      fringe.rotation.x = 0.35;
    } else if (hs === "bun") {
      const bun = sph(0.6 * s, hairC, 0.92);
      bun.position.set(0, (headY + 1.32) * s, -1.02 * s);
    } else if (hs === "long") {
      const fall = new THREE.Mesh(new THREE.CapsuleGeometry(1.02 * s, 1.6 * s, 4, 12), mat(hairC, { rough: 0.92 }));
      fall.scale.set(1.18, 1, 0.6);
      fall.position.set(0, (headY - 1.1) * s, -0.92 * s);
      fall.castShadow = true;
      inner.add(fall);
    }

    g.userData.inner = inner;
    if (o.wander) inner.position.y = 0.2; /* walkers drive their own gait */
    else anim.bobs.push(inner);
    parent.add(g);
    return g;
  };

  /* ── walkers: people who actually move around the office ───────── */
  const walkers = [];
  const addWalker = (g, pts, opts = {}) => {
    walkers.push({
      g,
      inner: g.userData.inner,
      pts,
      /* pts[0] is the spawn point; head for the next stop first */
      idx: 1 % pts.length,
      speed: opts.speed || 0.055,
      pause: 20 + Math.floor(Math.random() * 90),
      phase: Math.random() * 100,
    });
  };
  /* Delta-timed gait: ~2 gentle steps a second, a slight forward lean,
     speed ramps out of pauses and eases into stops, and the walk blends
     to an idle breath instead of snapping. dt is in 1/60s ticks. */
  function stepWalkers(dt, ease) {
    for (const w of walkers) {
      const inner = w.inner;
      if (w.pause > 0) {
        w.pause -= dt;
        w.moveT = 0;
        w.gait = Math.max(0, (w.gait || 0) - 0.045 * dt);
      } else {
        const [tx, tz] = w.pts[w.idx];
        const dx = tx - w.g.position.x;
        const dz = tz - w.g.position.z;
        const dist = Math.hypot(dx, dz);
        if (dist < 0.35) {
          w.idx = (w.idx + 1) % w.pts.length;
          w.pause = 90 + Math.random() * 330;
          continue;
        }
        w.moveT = (w.moveT || 0) + dt;
        w.gait = Math.min(1, (w.gait || 0) + 0.04 * dt);
        const v = w.speed * Math.min(1, w.moveT / 20, dist / 3);
        w.g.position.x += (dx / dist) * v * dt;
        w.g.position.z += (dz / dist) * v * dt;
        const heading = Math.atan2(dx, dz);
        let a = heading - w.g.rotation.y;
        a = Math.atan2(Math.sin(a), Math.cos(a));
        w.g.rotation.y += a * ease(0.13);
      }
      /* gait: a soft vertical step and a slight forward lean only; any
         roll at the feet reads as a metronome, so there is none */
      const g = w.gait || 0;
      const step = (tick + w.phase) * 0.11;
      inner.position.y =
        0.2 + 0.07 * Math.sin((tick + w.phase) / 40) + g * 0.06 * Math.abs(Math.sin(step));
      inner.rotation.z = 0;
      inner.rotation.x = g * 0.04;
    }
  }

  /* ── furnish the floor ─────────────────────────────────────────── */
  /* ARCHIVE — reactivation digs through the old list */
  rack(zg("archive"), 3, 4);
  rack(zg("archive"), 3, 8.6);
  cabinet(zg("archive"), 12, 3);
  cabinet(zg("archive"), 16.4, 3);
  cabinet(zg("archive"), 20.8, 3);
  desk(zg("archive"), 10, 13, 8, 4.2, { papers: true });
  chair(zg("archive"), 14, 11.5, 0);
  const agentArchive = person(zg("archive"), 19.5, 15.5, {
    shirt: C.accentDeep, skin: C.skinB, hair: C.hairBrown,
    hairStyle: "crop", wander: true,
  });
  addWalker(agentArchive, [[19.5, 15.5], [21, 21], [9, 21], [8.2, 14], [12, 9], [20, 9.5]]);

  /* BOARDROOM — the second brain holds what the business knows */
  bookcase(zg("boardroom"), 90.5, 5.5);
  roundTable(zg("boardroom"), 74, 13);
  chair(zg("boardroom"), 74, 7.4, 0);
  chair(zg("boardroom"), 81, 11, -Math.PI / 2);
  chair(zg("boardroom"), 80.2, 16.4, -Math.PI / 2);
  const agentBoard = person(zg("boardroom"), 68.5, 18.5, {
    shirt: C.accent, hairStyle: "part", wander: true,
  });
  addWalker(
    agentBoard,
    [[68.5, 18.5], [64, 15.5], [63, 9.5], [68, 4.6]],
    { speed: 0.045 }
  );
  person(zg("boardroom"), 74, 7.4, {
    seated: true, shirt: C.wallDeep, hair: C.hairLight,
    hairStyle: "bun", pose: "work",
  });

  /* RECEPTION — speed to lead answers before anyone else */
  desk(zg("reception"), 8, 34, 10, 4.6, { papers: true });
  const agentReception = person(zg("reception"), 10.5, 32.4, {
    shirt: C.accent, hairStyle: "long", wander: true,
  });
  addWalker(
    agentReception,
    [[10.5, 32.4], [19, 32.6], [22.5, 38.5], [19, 41.5], [6, 41], [5.5, 32.5]],
    { speed: 0.05 }
  );
  desk(zg("reception"), 24, 40, 8, 4.2);
  chair(zg("reception"), 28, 47, Math.PI);
  person(zg("reception"), 28, 47, {
    seated: true, shirt: C.accentDeep, skin: C.skinB, hair: C.hairBrown,
    hairStyle: "crop", pose: "work", rotY: Math.PI,
  });
  plant(zg("reception"), 6, 50);
  cooler(zg("reception"), 20.5, 36);

  /* COMMONS — the cartoon office breathes */
  const commons = new THREE.Group();
  scene.add(commons);
  pingpong(commons, 34, 26);
  sofa(commons, 45, 42);
  const lowT = box(commons, 4.6, 1.6, 3, C.white, { radius: 0.4 });
  lowT.position.set(49.3, 0.8, 38);
  plant(commons, 57.5, 27.5, 0.9);
  plant(commons, 41.5, 50.5, 0.9);
  /* a working desk cluster + roaming staff make it a full office */
  desk(commons, 44, 46, 8, 4.2);
  chair(commons, 48, 53, Math.PI);
  person(commons, 48, 53, {
    seated: true, shirt: C.wallDeep, hair: C.hairBrown,
    hairStyle: "crop", pose: "work", rotY: Math.PI,
  });
  const staffA = person(commons, 33, 52, {
    shirt: C.wallDeep, hairStyle: "bun", hair: C.hairLight, wander: true,
  });
  addWalker(staffA, [[33, 52], [33, 44], [42, 34], [52, 29], [45, 33.5]]);
  const staffB = person(commons, 10, 26, {
    shirt: C.inkSoft, skin: C.skinB, hairStyle: "crop", hair: C.hairLight, wander: true,
  });
  addWalker(staffB, [[10, 26], [28, 23.5], [50, 23], [55, 26.5], [30, 27.5]], { speed: 0.06 });

  /* CORNER OFFICE — the AI CEO runs the whole floor */
  rug(zg("corner"), 66, 34, 22, 15);
  desk(zg("corner"), 72, 38, 10, 5, { ms: 0.95 });
  monitor(zg("corner"), 79.8, 39.9, 0.8, -0.25);
  chair(zg("corner"), 77, 36.8, 0);
  const agentBoss = person(zg("corner"), 70, 47, {
    scale: 1.14, shirt: C.ink, tie: C.accent, collar: "white",
    hairStyle: "part", rotY: 0.7, wander: true,
  });
  addWalker(
    agentBoss,
    [[70, 47], [65.5, 41], [68, 36], [74, 33.5], [84, 34.5], [86.5, 42.5], [80, 46.5]],
    { speed: 0.04 }
  );
  lamp(zg("corner"), 88, 35);
  plant(zg("corner"), 90.5, 50.5);

  /* dim un-lit zones (demo mode lights everything) */
  const litZone = (id) => ((state.rooms && state.rooms[id]) || {}).state === "lit";
  for (const z of ZONES) {
    if (litZone(z.id)) continue;
    zg(z.id).traverse((n) => {
      if (n.isMesh && n.material) {
        n.material.color.lerp(C.white, 0.55);
        if (n.material.emissive) n.material.emissiveIntensity = 0;
      }
    });
  }

  /* ── runner dots: work flowing between the sections ────────────── */
  const runSamples = RUN_PATHS.map((pts) => {
    const s = [];
    for (let i = 0; i < pts.length - 1; i++) {
      const [x1, z1] = pts[i];
      const [x2, z2] = pts[i + 1];
      const n = Math.max(Math.abs(x2 - x1), Math.abs(z2 - z1)) * 2;
      for (let k = 0; k <= n; k++)
        s.push([x1 + ((x2 - x1) * k) / n, z1 + ((z2 - z1) * k) / n]);
    }
    return s;
  });
  const runners = [];
  const runnerGeo = new THREE.SphereGeometry(0.55, 10, 10);
  function spawnRunner() {
    const path = runSamples[Math.floor(Math.random() * runSamples.length)];
    const m = new THREE.Mesh(runnerGeo, mat(C.accent, { emissive: C.accent, emissiveIntensity: 0.9 }));
    m.castShadow = true;
    scene.add(m);
    runners.push({ m, path, i: 0 });
  }

  /* ── DOM overlay: name pills + hover plate + scan plaques ──────── */
  const pillEls = [];
  const mkPill = (p) => {
    const el = document.createElement("div");
    Object.assign(el.style, {
      position: "absolute",
      transform: "translate(-50%,-100%)",
      background: p.boss ? ACCENT : "rgba(10,10,10,0.92)",
      color: "#fff",
      fontFamily: fontStack,
      fontSize: "11px",
      fontWeight: "700",
      letterSpacing: "0.12em",
      padding: "4px 10px 4px 8px",
      borderRadius: "5px",
      display: "flex",
      alignItems: "center",
      gap: "6px",
      whiteSpace: "nowrap",
      opacity: litZone(p.zone) ? "1" : "0.55",
    });
    const dot = document.createElement("span");
    Object.assign(dot.style, {
      width: "6px", height: "6px", borderRadius: "50%",
      background: litZone(p.zone) ? (p.boss ? "#fff" : "#3fdb7c") : "#a3a3a3",
    });
    if (litZone(p.zone) && !reduced) dot.className = "live-dot";
    const txt = document.createElement("span");
    txt.textContent = p.label;
    const tail = document.createElement("span");
    Object.assign(tail.style, {
      position: "absolute", left: "50%", bottom: "-5px",
      width: "0", height: "0", transform: "translateX(-50%)",
      borderLeft: "5px solid transparent", borderRight: "5px solid transparent",
      borderTop: `5px solid ${p.boss ? ACCENT : "rgba(10,10,10,0.92)"}`,
    });
    el.append(dot, txt, tail);
    overlay.appendChild(el);
    return el;
  };
  const agentRefs = {
    archive: agentArchive,
    boardroom: agentBoard,
    reception: agentReception,
    corner: agentBoss,
  };
  for (const p of PILLS)
    pillEls.push({ p, el: mkPill(p), v: new THREE.Vector3(), target: agentRefs[p.zone] });

  const plateEl = document.createElement("div");
  Object.assign(plateEl.style, {
    position: "absolute", transform: "translate(-50%,-100%)",
    background: "#fff", color: "#0a0a0a", border: "1px solid #c7ccd8",
    fontFamily: fontStack, fontSize: "11px", fontWeight: "700",
    letterSpacing: "0.1em", padding: "5px 10px", borderRadius: "5px",
    whiteSpace: "nowrap", opacity: "0", transition: "opacity 0.15s",
    boxShadow: "3px 3px 0 rgba(43,85,176,0.12)",
  });
  overlay.appendChild(plateEl);

  if (state.mode === "scan") {
    for (const z of ZONES) {
      const rs = (state.rooms && state.rooms[z.id]) || {};
      if (!rs.plaque) continue;
      const chip = document.createElement("div");
      chip.textContent = rs.plaque;
      Object.assign(chip.style, {
        position: "absolute", transform: "translate(-50%,-50%)",
        background: "#fff", border: "1px solid #c7ccd8", color: "#525252",
        fontFamily: fontStack, fontSize: "10px", letterSpacing: "0.1em",
        padding: "4px 8px", borderRadius: "4px", whiteSpace: "nowrap",
      });
      chip.dataset.zone = z.id;
      overlay.appendChild(chip);
      pillEls.push({
        p: { zone: z.id, at: [z.x + z.w / 2, z.z + z.d / 2], h: 8, plaque: true },
        el: chip,
        v: new THREE.Vector3(),
        center: true,
      });
    }
  }

  /* ── zone hit planes + hover wash ──────────────────────────────── */
  const raycaster = new THREE.Raycaster();
  const pointerNdc = new THREE.Vector2(-2, -2);
  const hitMeshes = [];
  const washes = {};
  for (const z of ZONES) {
    const hit = new THREE.Mesh(
      new THREE.PlaneGeometry(z.w, z.d),
      new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false })
    );
    hit.rotation.x = -Math.PI / 2;
    hit.position.set(z.x + z.w / 2, 0.1, z.z + z.d / 2);
    hit.userData.zone = z;
    scene.add(hit);
    hitMeshes.push(hit);
    const wash = new THREE.Mesh(
      new THREE.PlaneGeometry(z.w, z.d),
      new THREE.MeshBasicMaterial({ color: C.accent, transparent: true, opacity: 0, depthWrite: false })
    );
    wash.rotation.x = -Math.PI / 2;
    wash.position.set(z.x + z.w / 2, 0.08, z.z + z.d / 2);
    scene.add(wash);
    washes[z.id] = wash;
  }

  /* ── camera state machine ──────────────────────────────────────── */
  const view = {
    target: CENTER.clone(),
    goalTarget: CENTER.clone(),
    zoom: 1,
    goalZoom: 1,
    par: new THREE.Vector2(0, 0),
    goalPar: new THREE.Vector2(0, 0),
  };
  let focus = null;
  const D = 170;

  function applyCamera() {
    const t = view.target;
    camera.position.set(
      t.x + camDir.x * D + view.par.x,
      6 + camDir.y * D,
      t.z + camDir.z * D + view.par.y
    );
    camera.lookAt(t.x + view.par.x, 6, t.z + view.par.y);
    camera.zoom = view.zoom;
    camera.updateProjectionMatrix();
  }

  function setFocus(zone) {
    focus = zone;
    if (zone) {
      view.goalTarget.set(zone.x + zone.w / 2, 0, zone.z + zone.d / 2);
      view.goalZoom = 1.85;
    } else {
      view.goalTarget.copy(CENTER);
      view.goalZoom = 1;
    }
    if (reduced) {
      view.target.copy(view.goalTarget);
      view.zoom = view.goalZoom;
      applyCamera();
      renderOnce();
    }
  }

  /* ── sizing ────────────────────────────────────────────────────── */
  const VIEW_W = 121;
  function resize() {
    const w = Math.max(host.clientWidth, 200);
    const h = Math.max(Math.round(w / 1.66), 240);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(w, h, true);
    renderer.domElement.style.height = `${h}px`;
    const half = VIEW_W / 2;
    camera.left = -half;
    camera.right = half;
    camera.top = half / (w / h);
    camera.bottom = -half / (w / h);
    applyCamera();
    renderOnce();
  }
  const ro = new ResizeObserver(() => resize());
  ro.observe(host);

  /* ── interaction listeners ─────────────────────────────────────── */
  let hoverZone = null;
  const el = renderer.domElement;
  function updatePointer(e) {
    const r = el.getBoundingClientRect();
    pointerNdc.set(((e.clientX - r.left) / r.width) * 2 - 1, -(((e.clientY - r.top) / r.height) * 2 - 1));
    view.goalPar.set(pointerNdc.x * 2.2, -pointerNdc.y * 1.6);
  }
  function pickZone() {
    raycaster.setFromCamera(pointerNdc, camera);
    const hits = raycaster.intersectObjects(hitMeshes, false);
    return hits.length ? hits[0].object.userData.zone : null;
  }
  const onPointerMove = (e) => {
    updatePointer(e);
    const z = pickZone();
    if (z !== hoverZone) {
      hoverZone = z;
      el.style.cursor = z ? "pointer" : "default";
      if (z) {
        plateEl.textContent = "";
        const dotSpan = document.createElement("span");
        Object.assign(dotSpan.style, {
          display: "inline-block", width: "7px", height: "7px",
          borderRadius: "50%", marginRight: "7px",
          background: litZone(z.id) ? ACCENT : "#a3a3a3",
        });
        plateEl.append(
          dotSpan,
          `${z.name.toUpperCase()} · ${z.week} · ${z.sys} ${litZone(z.id) ? "RUNNING" : "OFF"}`
        );
        plateEl.style.opacity = "1";
      } else {
        plateEl.style.opacity = "0";
      }
      if (reduced) renderOnce();
    }
  };
  const onPointerLeave = () => {
    hoverZone = null;
    plateEl.style.opacity = "0";
    view.goalPar.set(0, 0);
    el.style.cursor = "default";
  };
  const onClick = () => {
    const z = pickZone();
    if (z && focus !== z) {
      setFocus(z);
      if (opts.onSelect) opts.onSelect(z.id);
    } else {
      setFocus(null);
      if (opts.onSelect) opts.onSelect(null);
    }
  };
  el.addEventListener("pointermove", onPointerMove);
  el.addEventListener("pointerleave", onPointerLeave);
  el.addEventListener("click", onClick);

  /* ── frame loop ────────────────────────────────────────────────── */
  let raf = null;
  let tick = 0;
  let running = false;
  const plateAnchor = new THREE.Vector3();

  function projectOverlay() {
    const w = el.clientWidth, h = el.clientHeight;
    /* the pills are fixed-size DOM, so on a phone-width canvas they
       would collide: shrink them with the scene */
    const pillScale = w < 420 ? 0.6 : w < 560 ? 0.75 : w < 720 ? 0.88 : 1;
    for (const { p, el: pe, v, center, target } of pillEls) {
      const ax = target ? target.position.x : p.at[0];
      const az = target ? target.position.z : p.at[1];
      v.set(ax, p.h, az).project(camera);
      const sx = (v.x * 0.5 + 0.5) * w;
      const sy = (-v.y * 0.5 + 0.5) * h;
      pe.style.left = `${sx}px`;
      pe.style.top = `${sy}px`;
      pe.style.transformOrigin = center ? "center" : "bottom center";
      pe.style.transform = center
        ? `translate(-50%,-50%) scale(${pillScale})`
        : `translate(-50%,-100%) scale(${pillScale})`;
      pe.style.display = sx < -40 || sx > w + 40 || sy < -20 || sy > h + 20 ? "none" : "flex";
    }
    if (hoverZone) {
      plateAnchor.set(hoverZone.x + hoverZone.w / 2, 15, hoverZone.z + 2).project(camera);
      plateEl.style.left = `${(plateAnchor.x * 0.5 + 0.5) * w}px`;
      plateEl.style.top = `${Math.max((-plateAnchor.y * 0.5 + 0.5) * h, 30)}px`;
    }
  }

  function renderOnce() {
    projectOverlay();
    renderer.render(scene, camera);
  }

  let last = 0;
  const crossedEvery = (period, offset = 0) =>
    Math.floor((tick + offset) / period) !==
    Math.floor((tick + offset - lastDt) / period);
  let lastDt = 0;

  function frame(now) {
    raf = requestAnimationFrame(frame);
    if (!last) {
      last = now;
      return;
    }
    /* dt in 1/60s ticks, so motion is identical on 60Hz, 120Hz and
       throttled displays */
    const dt = Math.min((now - last) / 16.67, 3);
    last = now;
    tick += dt;
    lastDt = dt;
    const ease = (k) => 1 - Math.pow(1 - k, dt);

    /* camera easing */
    view.target.lerp(view.goalTarget, ease(0.06));
    view.zoom += (view.goalZoom - view.zoom) * ease(0.06);
    view.par.lerp(view.goalPar, ease(0.035));
    applyCamera();

    /* zone washes */
    for (const z of ZONES) {
      const m = washes[z.id].material;
      const goal = hoverZone === z ? 0.07 : 0;
      m.opacity += (goal - m.opacity) * ease(0.14);
    }

    /* life */
    anim.screens.forEach((s, i) => {
      s.material.emissiveIntensity = 0.75 + 0.2 * Math.sin((tick + i * 31) / 16);
    });
    anim.leds.forEach((l, i) => {
      l.material.emissiveIntensity = (tick + i * 37) % 160 < 110 ? 1 : 0.15;
    });
    anim.glints.forEach((k, i) => {
      const period = 420 + (i % 5) * 120;
      const ph = (tick + i * 97) % period;
      k.material.emissiveIntensity = ph < 18 ? 1.6 * (1 - ph / 18) : 0;
    });
    anim.bobs.forEach((b, i) => {
      b.position.y = 0.1 * Math.sin((tick + i * 29) / 45) + 0.15;
    });
    anim.bars.forEach(({ mesh, base }, i) => {
      if (crossedEvery(420, i * 90)) mesh.scale.y = base + ((tick / 60 + i) % 3) * 1.2;
    });
    if (anim.lamp) anim.lamp.intensity = 56 + 7 * Math.sin(tick / 50);

    /* runners */
    for (let i = runners.length - 1; i >= 0; i--) {
      const r = runners[i];
      r.i += 0.6 * dt;
      const idx = Math.floor(r.i);
      if (idx >= r.path.length) {
        scene.remove(r.m);
        r.m.material.dispose();
        runners.splice(i, 1);
        continue;
      }
      r.m.position.set(r.path[idx][0], 0.7 + 0.25 * Math.sin(r.i / 2.2), r.path[idx][1]);
    }
    if (crossedEvery(170)) spawnRunner();
    stepWalkers(dt, ease);

    renderOnce();
  }

  function start() {
    if (running || reduced) return;
    running = true;
    last = 0; /* re-seed dt after a pause so nothing jumps */
    raf = requestAnimationFrame(frame);
  }
  function stop() {
    running = false;
    if (raf) cancelAnimationFrame(raf);
    raf = null;
  }

  /* pause offscreen / hidden tab */
  const io = new IntersectionObserver(
    (entries) => (entries[0].isIntersecting ? start() : stop()),
    { rootMargin: "120px" }
  );
  io.observe(host);
  const onVis = () => (document.hidden ? stop() : start());
  document.addEventListener("visibilitychange", onVis);

  resize();
  applyCamera();
  renderOnce();
  if (reduced) {
    /* a static, fully-composed frame */
    projectOverlay();
    renderer.render(scene, camera);
  }

  /* ── contract ──────────────────────────────────────────────────── */
  const revealQueue = [];
  return {
    destroy() {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerleave", onPointerLeave);
      el.removeEventListener("click", onClick);
      scene.traverse((n) => {
        if (n.isMesh) {
          n.geometry?.dispose();
          if (Array.isArray(n.material)) n.material.forEach((m) => m.dispose());
          else n.material?.dispose();
        }
      });
      floorTex.dispose();
      renderer.dispose();
      host.innerHTML = "";
    },
    setState(next) {
      this.destroy();
      return renderOffice(host, next, opts);
    },
    focusRoom(id) {
      const z = ZONES.find((x) => x.id === id);
      if (z) setFocus(z);
    },
    zoomOut() {
      setFocus(null);
    },
    playReveal() {
      const order = ["boardroom", "reception", "archive", "corner"];
      order.forEach((id, i) => {
        const g = zoneGroups[id];
        if (!g) return;
        g.scale.y = 0.001;
        revealQueue.push({ g, at: tick + 20 + i * 26 });
      });
      const grow = () => {
        for (let i = revealQueue.length - 1; i >= 0; i--) {
          const r = revealQueue[i];
          if (tick >= r.at) {
            r.g.scale.y += (1 - r.g.scale.y) * 0.14;
            if (r.g.scale.y > 0.995) {
              r.g.scale.y = 1;
              revealQueue.splice(i, 1);
            }
          }
        }
        if (revealQueue.length) requestAnimationFrame(grow);
      };
      grow();
    },
    ROOMS: ZONES.map((z) => ({ ...z, y: z.z })),
  };
}

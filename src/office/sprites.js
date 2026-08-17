/*
  Fixture sprites: coordinate arrays, not images. Screen-space pixel
  art (8×8 to 16×16 logical px), stamped at a projected anchor. Each
  fixture returns rect lists per variant: dark / wired / lit. Colours
  come from the palette keys resolved by the renderer:
    L  = cream line   LD = cream 60%   A = accent   AD = accent-dim
    E  = ember        W  = warm lamp   D = danger   K = wall-dark
  Animated pixels carry a cls tag the clock drives.
*/

const px = (x, y, w, h, f, cls) => ({ x, y, w, h, f, cls });

/* Shared: outline-only ghost of a base shape for the dark variant. */
function ghost(rects) {
  return rects.map((r) => ({ ...r, f: "LD" }));
}

export const FIXTURES = {
  /* ── Boardroom ─────────────────────────────────────────────── */
  table: {
    lit: [
      px(0, 4, 16, 5, "L"),
      px(1, 9, 2, 3, "LD"),
      px(13, 9, 2, 3, "LD"),
      px(1, 3, 14, 1, "A", "glowline"),
    ],
    wired: [px(0, 4, 16, 5, "LD"), px(1, 3, 14, 1, "AD")],
    dark: ghost([px(0, 4, 16, 5), px(1, 9, 2, 3), px(13, 9, 2, 3)]),
  },
  intray: {
    lit: [
      px(0, 5, 8, 3, "L"),
      px(1, 3, 6, 1, "L"),
      px(1, 1, 5, 1, "L", "paper1"),
      px(2, 0, 4, 1, "LD", "paper2"),
    ],
    wired: [px(0, 5, 8, 3, "AD")],
    dark: ghost([px(0, 5, 8, 3)]),
  },
  rulebook: {
    lit: [
      px(0, 0, 5, 7, "L"),
      px(6, 0, 5, 7, "L"),
      px(5, 0, 1, 7, "A"),
      px(1, 2, 3, 1, "AD", "pageflick"),
      px(7, 3, 3, 1, "AD", "pageflick"),
    ],
    wired: [px(0, 0, 5, 7, "AD"), px(6, 0, 5, 7, "AD")],
    dark: [px(0, 0, 11, 7, "K"), ...ghost([px(0, 0, 11, 7)])],
  },
  chair: {
    lit: [
      px(2, 0, 6, 8, "L"),
      px(1, 8, 8, 2, "L"),
      px(4, 10, 2, 3, "LD"),
      px(3, 1, 4, 2, "A", "chairpulse"),
    ],
    wired: [px(2, 0, 6, 8, "AD"), px(1, 8, 8, 2, "AD")],
    dark: ghost([px(2, 0, 6, 8), px(1, 8, 8, 2)]),
  },
  phone: {
    lit: [
      px(0, 2, 8, 3, "L"),
      px(1, 0, 2, 2, "L"),
      px(5, 0, 2, 2, "L"),
      px(7, 4, 1, 1, "A", "phoneled"),
    ],
    wired: [px(0, 2, 8, 3, "AD")],
    dark: ghost([px(0, 2, 8, 3)]),
  },

  /* ── Reception ─────────────────────────────────────────────── */
  letterbox: {
    lit: [
      px(0, 0, 10, 2, "L"),
      px(2, 3, 6, 1, "K"),
      px(3, 4, 4, 3, "L", "envelope"),
    ],
    wired: [px(0, 0, 10, 2, "AD"), px(2, 3, 6, 1, "K")],
    dark: ghost([px(0, 0, 10, 2)]),
  },
  bell: {
    lit: [
      px(2, 3, 6, 3, "L", "bellbody"),
      px(4, 1, 2, 2, "L", "bellbody"),
      px(0, 7, 10, 1, "LD"),
      px(0, 2, 1, 1, "E", "bellarc"),
      px(9, 2, 1, 1, "E", "bellarc"),
      px(4, -2, 2, 1, "E", "bellarc"),
    ],
    wired: [px(2, 3, 6, 3, "AD"), px(4, 1, 2, 2, "AD")],
    dark: ghost([px(2, 3, 6, 3), px(4, 1, 2, 2)]),
  },
  clipboard: {
    lit: [
      px(0, 0, 8, 10, "L"),
      px(2, -1, 4, 2, "LD"),
      px(1, 3, 4, 1, "A", "tick1"),
      px(1, 5, 5, 1, "A", "tick2"),
      px(1, 7, 3, 1, "A", "tick3"),
    ],
    wired: [px(0, 0, 8, 10, "AD")],
    dark: ghost([px(0, 0, 8, 10)]),
  },
  shelf: {
    lit: [
      px(0, 4, 12, 1, "L"),
      px(1, 0, 2, 4, "L"),
      px(4, 0, 2, 4, "A", "folderslide"),
      px(7, 0, 2, 4, "L"),
      px(10, 0, 2, 4, "LD"),
    ],
    wired: [px(0, 4, 12, 1, "AD"), px(1, 0, 2, 4, "AD")],
    dark: ghost([px(0, 4, 12, 1)]),
  },

  /* ── Archive ───────────────────────────────────────────────── */
  cabinets: {
    lit: [
      px(0, 0, 4, 10, "L"),
      px(5, 0, 4, 10, "L"),
      px(10, 0, 4, 10, "L"),
      px(1, 2, 2, 1, "A", "drawer1"),
      px(6, 5, 2, 1, "A", "drawer2"),
      px(11, 3, 2, 1, "A", "drawer3"),
    ],
    wired: [px(0, 0, 4, 10, "AD"), px(5, 0, 4, 10, "AD"), px(10, 0, 4, 10, "AD")],
    dark: [
      ...ghost([px(0, 0, 4, 10), px(5, 0, 4, 10), px(10, 0, 4, 10)]),
      px(2, -3, 1, 1, "LD", "dust"),
      px(8, -4, 1, 1, "LD", "dust"),
    ],
  },
  sortdesk: {
    lit: [
      px(0, 4, 14, 4, "L"),
      px(2, 2, 3, 2, "LD", "pile1"),
      px(6, 1, 3, 3, "L", "pile2"),
      px(10, 2, 3, 2, "LD", "pile3"),
    ],
    wired: [px(0, 4, 14, 4, "AD")],
    dark: ghost([px(0, 4, 14, 4)]),
  },
  outbox: {
    lit: [
      px(0, 2, 9, 3, "L"),
      px(1, 0, 7, 2, "LD"),
      px(3, -1, 4, 1, "E", "outpaper"),
    ],
    wired: [px(0, 2, 9, 3, "AD")],
    dark: ghost([px(0, 2, 9, 3)]),
  },
  till: {
    lit: [
      px(0, 3, 12, 6, "L"),
      px(2, 0, 8, 3, "LD"),
      px(3, 1, 6, 1, "A"),
      px(0, 9, 12, 2, "L", "tilldrawer"),
      px(5, 10, 2, 1, "E", "coin"),
    ],
    wired: [px(0, 3, 12, 6, "AD"), px(2, 0, 8, 3, "AD")],
    dark: ghost([px(0, 3, 12, 6), px(2, 0, 8, 3)]),
  },

  /* ── Corner office ─────────────────────────────────────────── */
  desklamp: {
    lit: [
      px(0, 8, 14, 4, "L"),
      px(11, 2, 3, 2, "W"),
      px(12, 0, 1, 2, "LD"),
      px(9, 4, 2, 1, "W", "lampdither"),
      px(8, 5, 2, 1, "W", "lampdither"),
      px(7, 6, 2, 1, "W", "lampdither"),
    ],
    wired: [px(0, 8, 14, 4, "AD"), px(11, 2, 3, 2, "AD")],
    dark: ghost([px(0, 8, 14, 4), px(11, 2, 3, 2)]),
  },
  page: {
    lit: [
      px(0, 0, 7, 9, "L"),
      px(1, 2, 5, 1, "AD"),
      px(1, 4, 4, 1, "AD"),
      px(1, 6, 5, 1, "AD"),
      px(0, 0, 7, 1, "A", "printline"),
    ],
    wired: [px(0, 0, 7, 9, "AD")],
    dark: ghost([px(0, 0, 7, 9)]),
  },
  wallchart: {
    lit: [
      px(0, 0, 12, 9, "LD"),
      px(2, 6, 2, 2, "A", "bar1"),
      px(5, 4, 2, 4, "A", "bar2"),
      px(8, 2, 2, 6, "A", "bar3"),
    ],
    wired: [px(0, 0, 12, 9, "AD")],
    dark: ghost([px(0, 0, 12, 9)]),
  },
  flagtray: {
    lit: [
      px(0, 6, 9, 2, "L"),
      px(2, 0, 1, 6, "LD"),
      px(3, 0, 4, 3, "D", "flag"),
    ],
    wired: [px(0, 6, 9, 2, "AD")],
    dark: ghost([px(0, 6, 9, 2)]),
  },
};

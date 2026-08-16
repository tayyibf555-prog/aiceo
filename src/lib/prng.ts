/*
  Deterministic pseudo-randomness for the dither and halftone art.
  Everything visual that looks random MUST come from here, seeded by a
  readable string, so server-rendered SVG is identical on every render
  (no hydration mismatches, no diff noise between builds).
*/

/** FNV-1a 32-bit hash — turns a readable seed string into a uint32. */
export function hashSeed(str: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** mulberry32 — small fast PRNG, returns a () => number in [0, 1). */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Convenience: seeded generator straight from a string. */
export function seeded(seed: string): () => number {
  return mulberry32(hashSeed(seed));
}
